import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";

export const Notepad = () => {
  const app = useSelector((state) => state.apps.notepad);
  const files = useSelector((state) => state.files);

  const dispatch = useDispatch();

  const [value, setValue] = useState("");
  const [fileName, setFileName] = useState("");

  const { active } = files;

  const resetState = () => {
    setValue("");
    setFileName("");
  };

  useEffect(() => {
    if (active) {
      const item = files.data.getId(active);
      setFileName(item.name);
      setValue(item.data.content.value);
    }
  }, [active]);

  useEffect(() => {
    if (app.hide) {
      dispatch({ type: "FILECLOSE" });
      resetState();
    }
  }, [app.hide]);

  const onChange = (e) => {
    if (active) {
      const item = files.data.getId(active);
      setValue(e.target.value);
      item.setData({
        content: {
          value: e.target.value,
        },
      });
      files.data.saveChanges();
    } else {
      setValue(e.target.value);
    }
  };

  return (
    <div
      className="notepad floatTab dpShad"
      data-size={app.size}
      data-max={app.max}
      style={{
        ...(app.size == "cstm" ? app.dim : null),
        zIndex: app.z,
      }}
      data-hide={app.hide}
      id={app.icon + "App"}
    >
      <ToolBar
        app={app.action}
        icon={app.icon}
        size={app.size}
        name={(fileName || "Untitled") + " - Notepad"}
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="flex text-xs py-2 topBar">
          <div className="mx-2">File</div>
          <div className="mx-4">Edit</div>
          <div className="mx-4">View</div>
        </div>
        <div className="restWindow h-full flex-grow">
          <div className="w-full h-full overflow-hidden">
            <textarea
              id="textpad"
              value={value}
              spellCheck="false"
              onChange={onChange}
              className="noteText win11Scroll"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
