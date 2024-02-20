import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "../../utils/general";
import CommunicationProviderContext from "../../providers/Communication/context";

export const IFrame = (props) => {
  const { onIFrameLoad } = useContext(CommunicationProviderContext);
  const app = useSelector((state) => state.apps[props.icon]);
  if (!app) return null;
  var data = app.data;

  return app.hide ? null : (
    <div
      data-size={app.size}
      className={
        "floatTab dpShad " +
        (data.invert != true ? "lightWindow" : "darkWindow")
      }
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
        name={app.name}
        invert={data.invert == true ? true : null}
        noinvert
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow flex-grow flex flex-col">
          <div className="flex-grow overflow-hidden">
            <iframe
              title="xOS App"
              src={data.url}
              allow="camera;microphone"
              className="w-full h-full"
              frameborder="0"
              onLoad={onIFrameLoad}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};
