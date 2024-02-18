export class Item {
  constructor({ type, name, info, data, host }) {
    const defaultType = type || "folder";
    const defaultName = name || `Unnamed at ${new Date().getTime()}`;
    let defaultInfo = info || {}; // default to empty object if not provided
    if (defaultType === "folder" && (!info || !info.icon)) {
      defaultInfo.icon = "folder"; // Set default icon for folders if not provided
    }
    // Ensure data is never undefined for folders
    // Empty array for "folder", null for others
    const defaultData = defaultType === "folder" ? data || [] : data;
    const defaultHost = host || null;

    this.type = defaultType;
    this.name = defaultName;
    this.info = defaultInfo;
    this.data = defaultData;
    this.host = defaultHost;
    this.id = this.gene();
    // ...
  }

  gene() {
    return Math.random().toString(36).substring(2, 10).toLowerCase();
  }

  getId() {
    return this.id;
  }

  getData() {
    return this.data;
  }

  setData(data) {
    if (this.type === "folder") {
      this.data = Array.isArray(data) ? data : [];
    } else {
      this.data = data;
    }
  }

  addChild({ type, name, info, data }) {
    if (this.type !== "folder") {
      throw new Error("Cannot add child to a non-folder item");
    }

    // Ensure this.data is an array before using push
    if (!Array.isArray(this.data)) {
      this.data = []; // Initialize to an empty array if not already
    }

    const child = new Item({
      type,
      name,
      info,
      data,
      host: this,
    });

    this.data.push(child);
    return child;
  }

  extract() {
    const obj = {
      type: this.type,
      name: this.name,
      info: { ...this.info }, // Shallow copy of info
    };

    if (this.type === "folder" && this.data && Array.isArray(this.data)) {
      // For folders, process each child and build a nested structure
      obj.data = {};
      this.data.forEach((child) => {
        obj.data[child.name] = child.extract();
      });
    } else if (this.type === "file") {
      // For files, data should be preserved as is since it's not a collection of items
      obj.data = this.data;
    }

    return obj;
  }
}

export class Bin {
  constructor() {
    this.tree = [];
    this.lookup = {};
    this.special = {};
  }

  setSpecial(spid, id) {
    this.special[spid] = id;
  }

  setId(id, item) {
    this.lookup[id] = item;
  }

  getId(id) {
    return this.lookup[id];
  }

  getPath(id) {
    var cpath = "";
    var curr = this.getId(id);

    while (curr) {
      cpath = curr.name + "\\" + cpath;
      curr = curr.host;
    }

    return cpath.count("\\") > 1 ? cpath.strip("\\") : cpath;
  }

  parsePath(cpath) {
    if (cpath.includes("%")) {
      return this.special[cpath.trim()];
    }

    cpath = cpath
      .split("\\")
      .filter((x) => x !== "")
      .map((x) => x.trim().toLowerCase());
    if (cpath.length === 0) return null;

    var pid = null,
      curr = null;
    for (var i = 0; i < this.tree.length; i++) {
      if (this.tree[i].name.toLowerCase() === cpath[0]) {
        curr = this.tree[i];
        break;
      }
    }

    if (curr) {
      var i = 1,
        l = cpath.length;
      while (curr.type === "folder" && i < l) {
        var res = true;
        for (var j = 0; j < curr.data.length; j++) {
          if (curr.data[j].name.toLowerCase() === cpath[i]) {
            i += 1;
            if (curr.data[j].type === "folder") {
              res = false;
              curr = curr.data[j];
            }

            break;
          }
        }

        if (res) break;
      }

      if (i === l) pid = curr.id;
    }

    return pid;
  }

  toJSON() {
    const structure = {};
    this.tree.forEach((rootItem) => {
      structure[rootItem.name] = rootItem.extract(); // Convert each root item
    });
    return structure;
  }

  stringify() {
    const structure = this.toJSON();
    return JSON.stringify(structure);
  }
  saveChanges() {
    localStorage.setItem("xOS_Explorer", this.stringify());
  }

  parseFolder(data, name, host = null) {
    var item = new Item({
      type: data.type,
      name: data.name || name,
      info: data.info,
      host: host,
      data: data.data,
    });

    this.setId(item.id, item);

    if (data.info && data.info.spid) {
      this.setSpecial(data.info.spid, item.id);
    }

    if (data.type === "folder") {
      const fdata =
        (data.data &&
          Object.keys(data.data).map((key) => {
            return this.parseFolder(data.data[key], key, item);
          })) ||
        [];
      item.setData(fdata);
    } else {
      item.setData(data.data);
    }

    return item;
  }

  parse(data) {
    if (!data) {
      this.tree = [];
      return;
    }
    var drives = Object.keys(data);
    var tree = [];
    for (var i = 0; i < drives.length; i++) {
      tree.push(this.parseFolder(data[drives[i]]));
    }

    this.tree = tree;
  }

  addByPath(path, { type, name, info, data }) {
    const parentId = this.parsePath(path);
    if (!parentId) {
      throw new Error(`No such path: ${path}`);
    }

    const parentItem = this.getId(parentId);

    if (parentItem.type !== "folder") {
      throw new Error(`The path specified is not a folder: ${path}`);
    }

    const item = parentItem.addChild({
      type,
      name,
      info,
      data,
    });

    this.refresh(); // Rebuilds the lookup and special tables

    return item;
  }

  refresh() {
    this.lookup = {};
    this.special = {};
    // Re-parse the tree to refresh ids, lookups, and so on
    this.tree.map((rootItem) => {
      // Walk through the entire tree and reassociate ids with items
      const walk = (item) => {
        this.setId(item.getId(), item);
        if (item.info && item.info.spid) {
          this.setSpecial(item.info.spid, item.getId());
        }
        if (item.type === "folder") {
          if (item.data) {
            item.data.forEach((child) => walk(child)); // Recursive walk
          } else {
            item.data = [];
          }
        }
      };
      walk(rootItem);
    });
    this.saveChanges();
  }

  updateItem(id, updates) {
    const itemToUpdate = this.lookup[id];
    if (!itemToUpdate) {
      throw new Error(`Item with ID ${id} does not exist.`);
    }

    // Go through each update field and update the item
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        itemToUpdate[key] = updates[key];
      }
    }

    this.refresh();
  }

  removeItem(id) {
    const itemToRemove = this.lookup[id];
    if (!itemToRemove) {
      throw new Error(`Item with ID ${id} does not exist.`);
    }

    const parentItem = itemToRemove.host;
    if (!parentItem || parentItem.type !== "folder") {
      throw new Error(
        "Cannot remove the root item or items without a folder parent."
      );
    }

    // Filter out the item to remove
    parentItem.data = parentItem.data.filter((item) => item !== itemToRemove);

    // Optionally, if you want to deep clean the lookup table and the item has children,
    // make sure to recursively remove them from the lookup table
    if (itemToRemove.type === "folder") {
      const deepCleanLookup = (item) => {
        if (item.data && item.type === "folder") {
          item.data.forEach((child) => deepCleanLookup(child));
        }
        delete this.lookup[item.getId()];
      };
      deepCleanLookup(itemToRemove);
    }

    // Remove the item from lookup table
    delete this.lookup[id];

    this.refresh();
  }
}
