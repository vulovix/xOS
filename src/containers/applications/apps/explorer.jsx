import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Image, ToolBar } from "../../../utils/general";
import { dispatchAction, handleFileOpen } from "../../../actions";
import "./assets/fileexpo.scss";

const NavTitle = (props) => {
  const src = props.icon || "folder";

  return (
    <div
      className="navtitle flex prtclk"
      data-action={props.action}
      data-payload={props.payload}
      onClick={dispatchAction}
    >
      <Icon
        className="mr-1"
        src={"win/" + src + "-sm"}
        width={props.isize || 16}
      />
      <span>{props.title}</span>
    </div>
  );
};

const FolderDrop = ({ dir }) => {
  const files = useSelector((state) => state.files);
  const folder = files.data.getId(dir);

  return (
    <>
      {folder.data &&
        folder.data.map((item, i) => {
          if (item.type == "folder") {
            return (
              <Dropdown
                key={i}
                icon={item.info && item.info.icon}
                title={item.name}
                notoggle={item.data.length === 0}
                dir={item.id}
              />
            );
          }
        })}
    </>
  );
};

const Dropdown = (props) => {
  const [open, setOpen] = useState(props.isDropped != null);
  const special = useSelector((state) => state.files.data.special);
  const [folderID] = useState(() => {
    if (props.spid) return special[props.spid];
    else return props.dir;
  });
  const toggle = () => setOpen(!open);

  return (
    <div className="dropdownmenu">
      <div className="droptitle">
        {!props.notoggle ? (
          <Icon
            className="arrUi"
            fafa={open ? "faChevronDown" : "faChevronRight"}
            width={10}
            onClick={toggle}
            pr
          />
        ) : (
          <Icon className="arrUi opacity-0" fafa="faCircle" width={10} />
        )}
        <NavTitle
          icon={props.icon}
          title={props.title}
          isize={props.isize}
          action={props.action !== "" ? props.action || "FILEDIR" : null}
          payload={folderID}
        />
        {props.pinned != null ? (
          <Icon className="pinUi" src="win/pinned" width={16} />
        ) : null}
      </div>
      {!props.notoggle ? (
        <div className="dropcontent">
          {open ? props.children : null}
          {open && folderID != null ? <FolderDrop dir={folderID} /> : null}
        </div>
      ) : null}
    </div>
  );
};

export const Explorer = () => {
  const [selected, setSelect] = useState(null);
  const app = useSelector((state) => state.apps.explorer);
  const files = useSelector((state) => state.files);
  const folderData = files.data.getId(files.cdir);
  const [directoryPath, setDirectoryPath] = useState(files.cpath);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const isSelectedSpecial = selected
    ? !!files.data.getId(selected).info.spid
    : false;
  const handleChange = (e) => setDirectoryPath(e.target.value);
  const handleSearchChange = (e) => setSearchText(e.target.value);

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      dispatch({ type: "FILEPATH", payload: directoryPath });
    }
  };

  const onAddFile = () => {
    const fileName = `File ${new Date().getTime()}`;
    files.data.addByPath(directoryPath, {
      type: "file",
      name: fileName,
      info: { icon: "file" },
      data: { content: { value: "Hello World!" } },
    });
  };

  const onAddFolder = () => {
    const name = `Folder ${new Date().getTime()}`;
    files.data.addByPath(directoryPath, {
      type: "folder",
      name: name,
    });
  };

  const onUpdate = (itemId, itemValue) => {
    files.data.updateItem(itemId, {
      name: itemValue,
    });
  };
  const onRemove = () => {
    files.data.removeItem(selected);
  };

  const DirCont = () => {
    var arr = [],
      curr = folderData,
      index = 0;

    while (curr) {
      arr.push(
        <div key={index++} className="dirCont flex items-center">
          <div
            className="dncont"
            onClick={dispatchAction}
            tabIndex="-1"
            data-action="FILEDIR"
            data-payload={curr.id}
          >
            {curr.name}
          </div>
          <Icon className="dirchev" fafa="faChevronRight" width={8} />
        </div>
      );

      curr = curr.host;
    }

    arr.push(
      <div key={index++} className="dirCont flex items-center">
        <div className="dncont" tabIndex="-1">
          This PC
        </div>
        <Icon className="dirchev" fafa="faChevronRight" width={8} />
      </div>
    );

    arr.push(
      <div key={index++} className="dirCont flex items-center">
        <Icon
          className="pr-1 pb-px"
          src={"win/" + folderData.info.icon + "-sm"}
          width={16}
        />
        <Icon className="dirchev" fafa="faChevronRight" width={8} />
      </div>
    );

    return (
      <div key={index++} className="dirfbox h-full flex">
        {arr.reverse()}
      </div>
    );
  };

  useEffect(() => {
    setDirectoryPath(files.cpath);
    setSearchText("");
  }, [files.cpath]);

  return (
    <div
      className="msfiles floatTab dpShad"
      data-size={app.size}
      data-max={app.max}
      style={{
        ...(app.size === "cstm" ? app.dim : null),
        zIndex: app.z,
      }}
      data-hide={app.hide}
      id={app.icon + "App"}
    >
      <ToolBar
        app={app.action}
        icon={app.icon}
        size={app.size}
        name="File Explorer"
      />
      <div className="windowScreen flex flex-col">
        <Ribbon
          selected={selected}
          onRemove={onRemove}
          onAddFile={onAddFile}
          onAddFolder={onAddFolder}
          isSpecial={isSelectedSpecial}
        />
        <div className="restWindow flex-grow flex flex-col">
          <div className="sec1">
            <Icon
              className={
                "navIcon hvtheme" + (files.hid == 0 ? " disableIt" : "")
              }
              fafa="faArrowLeft"
              width={14}
              click="FILEPREV"
              pr
            />
            <Icon
              className={
                "navIcon hvtheme" +
                (files.hid + 1 == files.hist.length ? " disableIt" : "")
              }
              fafa="faArrowRight"
              width={14}
              click="FILENEXT"
              pr
            />
            <Icon
              className="navIcon hvtheme"
              fafa="faArrowUp"
              width={14}
              click="FILEBACK"
              pr
            />
            <div className="path-bar noscroll" tabIndex="-1">
              <input
                className="path-field"
                type="text"
                value={directoryPath}
                onChange={handleChange}
                onKeyDown={handleEnter}
              />
              <DirCont />
            </div>
            <div className="srchbar">
              <Icon className="searchIcon" src="search" width={12} />
              <input
                type="text"
                onChange={handleSearchChange}
                value={searchText}
                placeholder="Search"
              />
            </div>
          </div>
          <div className="sec2">
            <NavPane />
            <ContentArea
              searchtxt={searchText}
              onUpdate={onUpdate}
              selected={selected}
              setSelect={setSelect}
            />
          </div>
          <div className="sec3">
            <div className="item-count text-xs">
              {folderData.data?.length} items
            </div>
            <div className="view-opts flex">
              <Icon
                className="viewicon hvtheme p-1"
                click="FILEVIEW"
                payload="5"
                open={files.view == 5}
                src="win/viewinfo"
                width={16}
              />
              <Icon
                className="viewicon hvtheme p-1"
                click="FILEVIEW"
                payload="1"
                open={files.view == 1}
                src="win/viewlarge"
                width={16}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContentArea = ({ searchtxt, selected, setSelect, onUpdate }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editValue, setEditValue] = useState("");
  const files = useSelector((state) => state.files);
  // const special = useSelector((state) => state.files.data.special);
  const fdata = files.data.getId(files.cdir);
  const dispatch = useDispatch();
  const handleClick = (e) => {
    e.stopPropagation();
    setSelect(e.target.dataset.id);
  };

  const handleDouble = (e) => {
    e.stopPropagation();
    handleFileOpen(e.target.dataset.id);
  };

  const emptyClick = (e) => {
    setSelect(null);
  };

  const handleKey = (e) => {
    if (e.key == "Backspace" && !isEditMode) {
      dispatch({ type: "FILEPREV" });
    }
  };

  const handleOnEdit = (item) => {
    if (editValue.trim()) {
      onUpdate(item.id, editValue.trim());
      setEditValue("");
    }
    setIsEditMode(false);
  };

  return (
    <div
      className="contentarea"
      onClick={emptyClick}
      onKeyDown={handleKey}
      tabIndex="-1"
    >
      <div className="contentwrap win11Scroll">
        <div className="gridshow" data-size="lg">
          {fdata.data?.map((item, i) => {
            return (
              item.name.toLowerCase().includes(searchtxt.toLowerCase()) && (
                <div
                  key={i}
                  className="conticon hvtheme flex flex-col items-center prtclk"
                  // prtclk
                  data-id={item.id}
                  data-focus={selected == item.id}
                  onClick={handleClick}
                  onDoubleClick={handleDouble}
                >
                  <Image src={`icon/win/${item.info.icon}`} />
                  <span
                    contentEditable={isEditMode}
                    className={`${isEditMode ? "editable-area" : ""}`}
                    onClick={() => {
                      setSelect(item.id);
                      setIsEditMode(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleOnEdit(item);
                      }
                    }}
                    onBlur={() => handleOnEdit(item)}
                    onInput={(e) => setEditValue(e.currentTarget.textContent)}
                    style={{ pointerEvents: "all" }}
                  >
                    {isEditMode && selected === item.id
                      ? editValue || item.name
                      : item.name}
                  </span>
                </div>
              )
            );
          })}
        </div>
        {!fdata.data || fdata.data?.length == 0 ? (
          <span className="text-xs mx-auto">This folder is empty.</span>
        ) : null}
      </div>
    </div>
  );
};

const NavPane = ({}) => {
  const files = useSelector((state) => state.files);
  const special = useSelector((state) => state.files.data.special);

  return (
    <div className="navpane win11Scroll">
      <div className="extcont">
        <Dropdown icon="star" title="Quick access" action="" isDropped>
          <Dropdown icon="user" title="X" spid="%user%" notoggle pinned />
          <Dropdown
            icon="docs"
            title="Documents"
            spid="%documents%"
            notoggle
            pinned
          />
        </Dropdown>
        <Dropdown icon="thispc" title="This PC" action="" isDropped>
          <Dropdown icon="desk" title="Desktop" spid="%desktop%" />
          <Dropdown icon="down" title="Downloads" spid="%downloads%" />
          <Dropdown icon="docs" title="Documents" spid="%documents%" />
          <Dropdown icon="music" title="Music" spid="%music%" />
          <Dropdown icon="vid" title="Videos" spid="%videos%" />
          <Dropdown icon="pics" title="Pictures" spid="%pictures%" />
          <Dropdown icon="onedrive" title="OneDrive" spid="%onedrive%" />
          <Dropdown icon="disc" title="Local Disk (C:)" spid="%cdrive%" />
          <Dropdown icon="disk" title="Local Disk (D:)" spid="%ddrive%" />
        </Dropdown>
      </div>
    </div>
  );
};

const Ribbon = ({ onAddFile, onAddFolder, onRemove, selected, isSpecial }) => {
  return (
    <div className="msribbon flex">
      <div className="ribsec">
        <div className="drdwcont flex" onClick={onAddFolder}>
          <Icon src="add-folder" ui width={18} margin="0 6px" />
          {/* <span>New Folder</span> */}
        </div>
        <div className="drdwcont flex" onClick={onAddFile}>
          <Icon src="add-file" ui width={18} margin="0 6px" />
          {/* <span>New File</span> */}
        </div>
      </div>
      {selected && !isSpecial ? (
        <div className="ribsec">
          <Icon src="delete" ui width={18} margin="0 6px" onClick={onRemove} />
        </div>
      ) : (
        <></>
      )}
      {/* <Icon src="cut" ui width={18} margin="0 6px" /> */}
      {/* <Icon src="cut" ui width={18} margin="0 6px" />
        <Icon src="copy" ui width={18} margin="0 6px" />
        <Icon src="rename" ui width={18} margin="0 6px" onClick={onUpdate} />
        <Icon src="paste" ui width={18} margin="0 6px" /> */}
      {/* <Icon src="share" ui width={18} margin="0 6px" /> */}
      <div className="ribsec">
        <div className="drdwcont flex">
          <Icon src="sort" ui width={18} margin="0 6px" />
          <span>Sort</span>
        </div>
        <div className="drdwcont flex">
          <Icon src="view" ui width={18} margin="0 6px" />
          <span>View</span>
        </div>
      </div>
    </div>
  );
};
