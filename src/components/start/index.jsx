import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../../actions";
import { getTreeValue } from "../../actions";
import { Icon } from "../../utils/general";
import Battery from "../shared/Battery";
import "./searchpane.scss";
import "./sidepane.scss";
import "./startmenu.scss";

export * from "./start";
export * from "./widget";

export const DesktopApp = () => {
  const deskApps = useSelector((state) => {
    var arr = { ...state.desktop };
    var tmpApps = [...arr.apps];

    if (arr.sort == "name") {
      tmpApps.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
    } else if (arr.sort == "size") {
      tmpApps.sort((a, b) => {
        var anm = a.name,
          bnm = b.name;

        return anm[bnm.charCodeAt(0) % anm.length] >
          bnm[anm.charCodeAt(0) % bnm.length]
          ? 1
          : -1;
      });
    } else if (arr.sort == "date") {
      tmpApps.sort((a, b) => {
        var anm = a.name,
          bnm = b.name;
        var anml = anm.length,
          bnml = bnm.length;

        return anm[(bnml * 13) % anm.length] > bnm[(anml * 17) % bnm.length]
          ? 1
          : -1;
      });
    }

    arr.apps = tmpApps;
    return arr;
  });

  const charsRef = useRef([]);
  const [draggingIndex, setDraggingIndex] = useState(null);

  useEffect(() => {
    const preventDefault = (e) => {
      e.dataTransfer.dropEffect = "move";
      e.preventDefault();
    };
    document.addEventListener("dragover", preventDefault);

    const startDrag = (index) => {
      setDraggingIndex(index);
    };

    const endDrag = () => {
      setDraggingIndex(null);
    };

    const dragEnd = (e, elementRef, left, top) => {
      elementRef.current.style.opacity = "1";
      elementRef.current.style.left = `${e.clientX - left - elementRef.current.offsetWidth / 2}px`;
      elementRef.current.style.top = `${e.clientY - top - elementRef.current.offsetHeight / 2}px`;
      endDrag();
    };

    const dragTouch = (e, elementRef) => {
      let touchLocation = e.targetTouches[0];
      let offsetX = elementRef.current.offsetWidth / 2;
      let offsetY = elementRef.current.offsetHeight / 2;
      elementRef.current.style.left = `${touchLocation.clientX - offsetX}px`;
      elementRef.current.style.top = `${touchLocation.clientY - offsetY}px`;
    };

    charsRef.current.forEach((elementRef, index) => {
      const rect = elementRef.current.getBoundingClientRect();
      elementRef.current.addEventListener("dragstart", () => startDrag(index));
      elementRef.current.addEventListener("dragend", (e) =>
        dragEnd(e, elementRef, rect.left, rect.top)
      );
      elementRef.current.addEventListener("touchmove", (e) =>
        dragTouch(e, elementRef)
      );
      elementRef.current.addEventListener("touchend", endDrag);
      elementRef.current.addEventListener("touchcancel", endDrag);
    });

    return () => {
      document.removeEventListener("dragover", preventDefault);
      charsRef.current.forEach((elementRef, index) => {
        const rect = elementRef.current.getBoundingClientRect();

        elementRef.current.removeEventListener("dragstart", () =>
          startDrag(index)
        );
        elementRef.current.removeEventListener("dragend", (e) =>
          dragEnd(e, elementRef, rect.left, rect.top)
        );
        elementRef.current.removeEventListener("touchmove", (e) =>
          dragTouch(e, elementRef)
        );
        elementRef.current.removeEventListener("touchend", endDrag);
        elementRef.current.removeEventListener("touchcancel", endDrag);
      });
    };
  }, []);

  return (
    <div className="desktopCont">
      {!deskApps.hide &&
        deskApps.apps.map((app, i) => {
          return (
            <div
              key={i}
              tabIndex={0}
              draggable={true}
              ref={(el) => (charsRef.current[i] = { current: el })}
              className={`dskApp  ${draggingIndex === i ? "is-dragging" : ""}`}
              style={{
                opacity: draggingIndex === i ? 0.25 : 1,
                transition: "none",
              }}
            >
              <Icon
                pr
                menu="app"
                src={app.icon}
                click={app.action}
                className="dskIcon prtclk"
                payload={app.payload || "full"}
                width={Math.round(deskApps.size * 36)}
              />
              <div className="appName">{app.name}</div>
            </div>
          );
        })}
    </div>
  );
};

export const BandPane = () => {
  const sidepane = useSelector((state) => state.sidepane);

  return (
    <div
      className="bandpane dpShad"
      data-hide={sidepane.banhide}
      style={{ "--prefix": "BAND" }}
    >
      <div className="bandContainer">
        <Icon
          className="hvlight"
          width={17}
          click="CALCUAPP"
          payload="togg"
          open="true"
          src="calculator"
        />
        <Icon
          className="hvlight"
          width={17}
          click="NOTEPAD"
          payload="togg"
          src="notepad"
        />
      </div>
    </div>
  );
};

export const SidePane = () => {
  const sidepane = useSelector((state) => state.sidepane);
  const setting = useSelector((state) => state.setting);
  const tasks = useSelector((state) => state.taskbar);
  const [pnstates, setPnstate] = useState([]);
  const dispatch = useDispatch();

  let [btlevel, setBtLevel] = useState("");
  const childToParent = () => {};

  const clickDispatch = (event) => {
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload,
    };

    if (action.type) {
      if (action.type != action.type.toUpperCase()) {
        Actions[action.type](action.payload);
      } else dispatch(action);
    }
    // For battery saver
    if (action.payload === "system.power.saver.state") setBrightness();
  };

  const vSlider = document.querySelector(".vSlider");
  const bSlider = document.querySelector(".bSlider");

  const setVolume = (e) => {
    var aud = 3;
    if (e.target.value < 70) aud = 2;
    if (e.target.value < 30) aud = 1;
    if (e.target.value == 0) aud = 0;

    dispatch({ type: "TASKAUDO", payload: aud });

    sliderBackground(vSlider, e.target.value);
  };

  function sliderBackground(elem, e) {
    elem.style.setProperty(
      "--track-color",
      `linear-gradient(90deg, var(--clrPrm) ${e - 3}%, #888888 ${e}%)`
    );
  }

  const setBrightness = (e) => {
    var brgt = document.getElementById("brightnessSlider").value;
    if (!e) {
      // Battery saver
      const state = setting.system.power.saver.state;
      const factor = state ? 0.7 : 100 / 70;
      const newBrgt = brgt * factor;
      setBrightnessValue(newBrgt);
      document.getElementById("brightnessSlider").value = newBrgt;
    } else {
      // Brightness slider
      setBrightnessValue(brgt);
    }
  };

  function setBrightnessValue(brgt) {
    document.getElementById("brightoverlay").style.opacity = (100 - brgt) / 100;
    dispatch({
      type: "STNGSETV",
      payload: {
        path: "system.display.brightness",
        value: brgt,
      },
    });
    sliderBackground(bSlider, brgt);
  }

  useEffect(() => {
    sidepane.quicks.map((item, i) => {
      if (item.src == "nightlight") {
        if (pnstates[i]) document.body.dataset.sepia = true;
        else document.body.dataset.sepia = false;
      }
    });
  });

  useEffect(() => {
    // console.log("ok")
    var tmp = [];
    for (var i = 0; i < sidepane.quicks.length; i++) {
      var val = getTreeValue(setting, sidepane.quicks[i].state);
      if (sidepane.quicks[i].name == "Theme") val = val == "dark";
      tmp.push(val);
    }

    setPnstate(tmp);
  }, [setting, sidepane]);

  return (
    <div
      className="sidePane dpShad"
      data-hide={sidepane.hide}
      style={{ "--prefix": "PANE" }}
    >
      <div className="quickSettings p-5 pb-8">
        <div className="qkCont">
          {sidepane.quicks.map((qk, idx) => {
            return (
              <div key={idx} className="qkGrp">
                <div
                  className="qkbtn handcr prtclk"
                  onClick={clickDispatch}
                  data-action={qk.action}
                  data-payload={qk.payload || qk.state}
                  data-state={pnstates[idx]}
                >
                  <Icon
                    className="quickIcon"
                    ui={qk.ui}
                    src={qk.src}
                    width={14}
                    invert={pnstates[idx] ? true : null}
                  />
                </div>
                <div className="qktext">{qk.name}</div>
              </div>
            );
          })}
        </div>
        <div className="sliderCont">
          <Icon className="mx-2" src="brightness" ui width={20} />
          <input
            id="brightnessSlider"
            className="sliders bSlider"
            onChange={setBrightness}
            type="range"
            min="10"
            max="100"
            defaultValue="100"
          />
        </div>
        <div className="sliderCont">
          <Icon className="mx-2" src={"audio" + tasks.audio} ui width={18} />
          <input
            className="sliders vSlider"
            onChange={setVolume}
            type="range"
            min="0"
            max="100"
            defaultValue="100"
          />
        </div>
      </div>
      <div className="p-1 bottomBar">
        <div className="px-3 battery-sidepane">
          <Battery pct />
        </div>
      </div>
    </div>
  );
};

export const CalnWid = () => {
  const sidepane = useSelector((state) => state.sidepane);
  const [loaded, setLoad] = useState(false);

  const [collapse, setCollapse] = useState("");

  const collapseToggler = () => {
    collapse === "" ? setCollapse("collapse") : setCollapse("");
  };

  useEffect(() => {
    if (!loaded) {
      setLoad(true);
      window.dycalendar.draw({
        target: "#dycalendar",
        type: "month",
        dayformat: "ddd",
        monthformat: "full",
        prevnextbutton: "show",
        highlighttoday: true,
      });
    }
  });

  return (
    <div
      className={`calnpane ${collapse} dpShad`}
      data-hide={sidepane.calhide}
      style={{ "--prefix": "CALN" }}
    >
      <div className="topBar pl-4 text-sm">
        <div className="date">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div className="collapser p-2 m-4 rounded" onClick={collapseToggler}>
          {collapse === "" ? (
            <Icon fafa="faChevronDown" />
          ) : (
            <Icon fafa="faChevronUp" />
          )}
        </div>
      </div>
      <div id="dycalendar"></div>
    </div>
  );
};
