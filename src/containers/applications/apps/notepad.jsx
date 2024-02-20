import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";

export const Notepad = () => {
  const app = useSelector((state) => state.apps.notepad);
  const files = useSelector((state) => state.files);

  const dispatch = useDispatch();

  const [value, setValue] = useState("");
  const [fileName, setFileName] = useState("");
  const historyRef = useRef([value]);
  const indexRef = useRef(0);

  const { active } = files;

  const resetState = () => {
    setValue("");
    setFileName("");
    historyRef.current = [""];
    indexRef.current = 0;
  };

  useEffect(() => {
    if (active) {
      const item = files.data.getId(active);
      historyRef.current = [item.data.content.value];
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

  const onChange = (newValue) => {
    if (newValue !== historyRef.current[indexRef.current]) {
      historyRef.current = historyRef.current.slice(0, indexRef.current + 1);
      historyRef.current.push(newValue);
      indexRef.current++;
    }

    if (active) {
      const item = files.data.getId(active);
      setValue(newValue);
      item.setData({
        content: {
          value: newValue,
        },
      });
      files.data.saveChanges();
    } else {
      setValue(newValue);
    }
  };

  const undo = () => {
    const newIndex = indexRef.current - 1;
    if (newIndex >= 0) {
      onChange(historyRef.current[newIndex]);
      indexRef.current = newIndex;
    }
  };

  const onKeyDown = (event) => {
    if (event.key === "Tab" && !event.shiftKey) {
      event.preventDefault();

      const { selectionStart, selectionEnd } = event.target;
      const before = value.substring(0, selectionStart);
      const after = value.substring(selectionEnd);

      const selection = value.substring(selectionStart, selectionEnd);
      const tabCharacter = "\t";

      // If there is no selection, simply insert the tab character at the cursor
      if (selectionStart === selectionEnd) {
        onChange(before + tabCharacter + after);
        queueMicrotask(() => {
          event.target.selectionStart = selectionStart + tabCharacter.length;
          event.target.selectionEnd = selectionEnd + tabCharacter.length;
        });
      } else {
        // There is some text selected, handle multi-line indenting
        const lines = selection.split("\n");
        const indentedLines = lines
          .map((line) => tabCharacter + line)
          .join("\n");
        onChange(before + indentedLines + after);
        queueMicrotask(() => {
          event.target.selectionStart = selectionStart;
          event.target.selectionEnd = selectionStart + indentedLines.length;
        });
      }
    } else if (event.key === "Tab" && event.shiftKey) {
      event.preventDefault();
    } else if ((event.ctrlKey || event.metaKey) && event.key === "z") {
      event.preventDefault();
      undo();
    } else if ((event.ctrlKey || event.metaKey) && event.key === "s") {
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
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={onKeyDown}
              className="noteText win11Scroll"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
