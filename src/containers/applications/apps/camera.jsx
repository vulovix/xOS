import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Icon, ToolBar } from "~/utils/general";
import { useTranslation } from "react-i18next";

export const Camera = () => {
  const app = useSelector((state) => state.apps.camera);
  const hide = useSelector((state) => state.apps.camera.hide);
  const [stream, setStream] = useState(null);
  const { t } = useTranslation();

  const capture = () => {
    let video = document.querySelector("video");
    let canvas = document.querySelector("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let df = video.videoWidth - video.videoHeight;

    canvas
      .getContext("2d")
      .drawImage(video, -df / 2, 0, video.videoWidth + df, video.videoHeight);
  };

  useEffect(() => {
    if (!app.hide) {
      let video = document.getElementById("camvideo");

      video.setAttribute("playsinline", "");
      video.setAttribute("autoplay", "");
      video.setAttribute("muted", "");

      let constraints = {
        audio: false,
        video: true,
      };

      navigator.mediaDevices.getUserMedia(constraints).then((dstream) => {
        setStream(dstream);
        console.log(dstream);
        video.srcObject = dstream;
      });
    } else {
      if (stream != null) stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [hide]);

  return (
    <div
      className="wnCam floatTab dpShad"
      data-size={app.size}
      id={app.icon + "App"}
      data-max={app.max}
      style={{
        ...(app.size == "cstm" ? app.dim : null),
        zIndex: app.z,
      }}
      data-hide={app.hide}
    >
      <ToolBar
        app={app.action}
        icon={app.icon}
        size={app.size}
        name="Camera"
        invert
        bg="#060606"
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow flex-grow flex flex-col">
          <div className="camcont">
            <div className="camctrl">
              <div
                className="cmicon"
                title={t("camera.take-photo")}
                onClick={capture}
              >
                <Icon icon="camera" />
              </div>
              <canvas id="camcanvas"></canvas>
            </div>
            <div className="vidcont">
              <div className="vidwrap">
                <video id="camvideo"></video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
