import axios from "axios";
import store from "~/reducers";
import { dfApps } from "~/utils";
import { gene_name } from "~/utils/apps";
import apps from "~/configuration/apps";

export const dispatchAction = (event) => {
  const action = {
    type: event.target.dataset.action,
    payload: event.target.dataset.payload,
  };

  if (action.type) {
    store.dispatch(action);
  }
};

export const refresh = (pl, menu) => {
  if (menu.menus.desk[0].opts[4].check) {
    store.dispatch({ type: "DESKHIDE" });
    setTimeout(() => store.dispatch({ type: "DESKSHOW" }), 100);
  }
};

export const changeIconSize = (size, menu) => {
  var tmpMenu = { ...menu };
  tmpMenu.menus.desk[0].opts[0].dot = false;
  tmpMenu.menus.desk[0].opts[1].dot = false;
  tmpMenu.menus.desk[0].opts[2].dot = false;
  var isize = 1;

  if (size == "large") {
    tmpMenu.menus.desk[0].opts[0].dot = true;
    isize = 1.5;
  } else if (size == "medium") {
    tmpMenu.menus.desk[0].opts[1].dot = true;
    isize = 1.2;
  } else {
    tmpMenu.menus.desk[0].opts[2].dot = true;
  }

  refresh("", tmpMenu);
  store.dispatch({ type: "DESKSIZE", payload: isize });
  store.dispatch({ type: "MENUCHNG", payload: tmpMenu });
};

export const deskHide = (payload, menu) => {
  var tmpMenu = { ...menu };
  tmpMenu.menus.desk[0].opts[4].check ^= 1;

  store.dispatch({ type: "DESKTOGG" });
  store.dispatch({ type: "MENUCHNG", payload: tmpMenu });
};

export const toggleFullscreen = (payload, menu) => {
  var tmpMenu = { ...menu };
  tmpMenu.menus.desk[0].opts[5].check ^= 1;

  store.dispatch({ type: "TOGGLE_FULSCREEN" });
  store.dispatch({ type: "MENUCHNG", payload: tmpMenu });
};

export const changeSort = (sort, menu) => {
  var tmpMenu = { ...menu };
  tmpMenu.menus.desk[1].opts[0].dot = false;
  tmpMenu.menus.desk[1].opts[1].dot = false;
  tmpMenu.menus.desk[1].opts[2].dot = false;
  if (sort == "name") {
    tmpMenu.menus.desk[1].opts[0].dot = true;
  } else if (sort == "size") {
    tmpMenu.menus.desk[1].opts[1].dot = true;
  } else {
    tmpMenu.menus.desk[1].opts[2].dot = true;
  }

  refresh("", tmpMenu);
  store.dispatch({ type: "DESKSORT", payload: sort });
  store.dispatch({ type: "MENUCHNG", payload: tmpMenu });
};

export const changeTaskAlign = (align, menu) => {
  var tmpMenu = { ...menu };
  if (tmpMenu.menus.task[0].opts[align == "left" ? 0 : 1].dot) return;

  tmpMenu.menus.task[0].opts[0].dot = false;
  tmpMenu.menus.task[0].opts[1].dot = false;

  if (align == "left") {
    tmpMenu.menus.task[0].opts[0].dot = true;
  } else {
    tmpMenu.menus.task[0].opts[1].dot = true;
  }

  store.dispatch({ type: "TASKTOG" });
  store.dispatch({ type: "MENUCHNG", payload: tmpMenu });
};

export const performApp = (action, menu) => {
  var data = {
    type: menu.dataset.action,
    payload: menu.dataset.payload,
  };

  if (action == "open") {
    if (data.type) store.dispatch(data);
  } else if (action == "delshort") {
    if (data.type) {
      var apps = store.getState().apps;
      var app = Object.keys(apps).filter(
        (x) =>
          apps[x].action == data.type ||
          (apps[x].payload == data.payload && apps[x].payload != null)
      );

      app = apps[app];
      if (app) {
        store.dispatch({ type: "DESKREM", payload: app.name });
      }
    }
  }
};

export const delApp = (action, menu) => {
  var data = {
    type: menu.dataset.action,
    payload: menu.dataset.payload,
  };

  if (action == "delete") {
    if (data.type) {
      var apps = store.getState().apps;
      var app = Object.keys(apps).filter((x) => apps[x].action == data.type);
      if (app) {
        app = apps[app];
        if (app && app.pwa == true) {
          store.dispatch({ type: app.action, payload: "close" });
          store.dispatch({ type: "DELAPP", payload: app.icon });

          var installed = localStorage.getItem("installed");
          if (!installed) installed = "[]";

          installed = JSON.parse(installed);
          installed = installed.filter((x) => x.icon != app.icon);
          localStorage.setItem("installed", JSON.stringify(installed));

          store.dispatch({ type: "DESKREM", payload: app.name });
        }
      }
    }
  }
};

export const installApp = (data) => {
  var app = { ...data, type: "app", pwa: true };

  var installed = localStorage.getItem("installed");
  if (!installed) installed = "[]";

  installed = JSON.parse(installed);
  installed.push(app);
  localStorage.setItem("installed", JSON.stringify(installed));

  var desk = localStorage.getItem("desktop");
  if (!desk) desk = dfApps.desktop;
  else desk = JSON.parse(desk);

  desk.push(app.name);
  localStorage.setItem("desktop", JSON.stringify(desk));

  app.action = gene_name();
  store.dispatch({ type: "ADDAPP", payload: app });
  store.dispatch({ type: "DESKADD", payload: app });
  console.log("New app installed: ", app.name);
  // store.dispatch({ type: "WNSTORE", payload: "mnmz" });
};

export const getTreeValue = (obj, path) => {
  if (path == null) return false;

  var tdir = { ...obj };
  path = path.split(".");
  for (var i = 0; i < path.length; i++) {
    tdir = tdir[path[i]];
  }

  return tdir;
};

export const changeTheme = () => {
  var thm = store.getState().setting.person.theme,
    thm = thm == "light" ? "dark" : "light";
  var icon = thm == "light" ? "sun" : "moon";

  document.body.dataset.theme = thm;
  store.dispatch({ type: "STNGTHEME", payload: thm });
  store.dispatch({ type: "PANETHEM", payload: icon });
  store.dispatch({ type: "WALLSET", payload: thm == "light" ? 0 : 1 });
};

const loadWidget = async () => {
  var tmpWdgt = {
      ...store.getState().widpane,
    },
    date = new Date();

  // console.log('fetching ON THIS DAY');
  var wikiurl = "https://en.wikipedia.org/api/rest_v1/feed/onthisday/events";
  await axios
    .get(`${wikiurl}/${date.getMonth()}/${date.getDay()}`)
    .then((res) => res.data)
    .then((data) => {
      var event = data.events[Math.floor(Math.random() * data.events.length)];
      date.setYear(event.year);

      tmpWdgt.data.date = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      tmpWdgt.data.event = event;
    })
    .catch((error) => {});

  // console.log('fetching NEWS');
  await axios
    .get("https://github.win11react.com/api-cache/news.json")
    .then((res) => res.data)
    .then((data) => {
      var newsList = [];
      data["articles"].forEach((e) => {
        e.title = e["title"].split(`-`).slice(0, -1).join(`-`).trim();
        newsList.push(e);
      });
      tmpWdgt.data.news = newsList;
    })
    .catch((error) => {});

  store.dispatch({
    type: "WIDGREST",
    payload: tmpWdgt,
  });
};

export const onInitialLoad = () => {
  preinstallApps();
  if (import.meta.env.MODE !== "development") {
    loadWidget();
  }
};

export const playStartupSound = () => {
  var audio = new Audio("/audio/startup.mp3");
  audio.play();
};

export const preinstallApps = () => {
  const installed = JSON.parse(localStorage.getItem("installed") || "[]");

  const preinstalled = JSON.parse(
    localStorage.getItem("xOS_preinstalled_apps") || "[]"
  );

  const configureApp = ({ appName, appURL, appIcon }) => ({
    type: "app",
    icon: appIcon,
    name: appName,
    data: {
      pwa: true,
      url: appURL,
      invert: false,
      type: "IFrame",
    },
  });

  const appsToInstall = [];
  const availableToInstall = [];

  apps.forEach((config) => {
    const candidate = configureApp(config);
    if (!installed.find((i) => i.name === candidate.name)) {
      // if it is not ever been preinstalled
      const preinstalledApp = preinstalled.find(
        (p) => p.name === candidate.name
      );
      if (!preinstalledApp) {
        appsToInstall.push(candidate);
      } else {
        availableToInstall.push(candidate);
      }
    }
  });

  if (appsToInstall.length) {
    console.log(
      "New apps available for installation: ",
      appsToInstall.map((x) => x.name).join(", "),
      "."
    );

    appsToInstall.forEach(installApp);

    localStorage.setItem(
      "xOS_preinstalled_apps",
      JSON.stringify([...preinstalled, ...appsToInstall])
    );
  } else {
    console.log("No new apps for installation.");
    if (availableToInstall.length) {
      console.log(
        "Available apps you can install: ",
        availableToInstall.map((x) => x.name).join(", "),
        "."
      );
    } else {
      console.log("All default apps are already installed.");
    }
  }
};

// mostly file explorer
export const handleFileOpen = (id) => {
  if (!id) {
    return;
  }
  // handle double click open
  const item = store.getState().files.data.getId(id);
  // console.log("handleFileOpen 1", id, item);
  if (item != null) {
    if (item.type == "folder") {
      store.dispatch({ type: "FILEDIR", payload: item.id });
    }
    if (item.type == "file") {
      store.dispatch({ type: "FILEOPEN", payload: item.id });
      store.dispatch({ type: "NOTEPAD", payload: "full" });
      // console.log("open", item);
    }
  }
};

export const flightMode = () => {
  store.dispatch({ type: "TOGGAIRPLNMD", payload: "" });
};
