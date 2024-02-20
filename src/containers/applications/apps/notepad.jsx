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

  const onKeyDown = (event) => {
    if (event.key === "Tab") {
      // Prevent the default tab behavior (focus change)
      event.preventDefault();

      // Set up variables for the selection and the textarea value
      const { selectionStart, selectionEnd } = event.target;
      const before = value.substring(0, selectionStart); // Text before cursor
      const after = value.substring(selectionEnd); // Text after cursor

      // Define the character for indentation (here it's a tab character)
      const tabCharacter = "\t";

      // Update the value with the tab character inserted
      setValue(`${before}${tabCharacter}${after}`);

      // Put cursor after the inserted tab character
      // Use queueMicrotask to ensure the state is updated before we set the selection

      // `queueMicrotask` is used to defer the selection update until after React has
      // processed the state update, ensuring that the cursor positions are updated accurately. As an alternative, you might use `setTimeout` with a very short delay (such as `0` or `1` millisecond) to achieve a similar result.

      queueMicrotask(() => {
        event.target.selectionStart = selectionStart + tabCharacter.length;
        event.target.selectionEnd = selectionEnd + tabCharacter.length;
      });
    } else if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      // Prevent the default save functionality
      event.preventDefault();

      console.log("Document is autosaved.");
    }
  };
  return (
    <div
      className="notepad floatTab dpShad"
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
              onKeyDown={onKeyDown}
              className="noteText win11Scroll"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
