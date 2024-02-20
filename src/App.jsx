import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useDispatch, useSelector } from "react-redux";
import "./i18nextConf";
import "./index.css";

import ActionMenu from "./components/menu";
import {
  BandPanel,
  Calendar,
  DesktopApp,
  SidePanel,
  StartMenu,
  WidgetsPanel,
} from "./components/start";
import Taskbar from "./components/taskbar";
import {
  Background,
  BootScreen,
  LockScreen,
  UpdateScreen,
  SyncScreen,
  BackupScreen,
} from "./containers/background";

import { onInitialLoad } from "./actions";
import * as Applications from "./containers/applications";
import * as Drafts from "./containers/applications/draft";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <meta charSet="UTF-8" />
      <title>404 - Page</title>
      <script src="https://xos.dev/script.js"></script>
      <link rel="stylesheet" href="https://xos.dev/style.css" />
      {/* partial:index.partial.html */}
      <div id="page">
        <div id="container">
          <h1>:(</h1>
          <h2>
            Your PC ran into a problem and needs to restart. We're just
            collecting some error info, and then we'll restart for you.
          </h2>
          <h2>
            <span id="percentage">0</span>% complete
          </h2>
          <div id="details">
            <div id="qr">
              <div id="image"></div>
            </div>
            <div id="stopcode">
              <h4>
                For more information about this issue and possible fixes, visit
                <br />{" "}
                <a href="https://github.com/vulovix/xOS/issues">
                  https://github.com/vulovix/xOS/issues
                </a>{" "}
              </h4>
              <h5>
                If you call a support person, give them this info:
                <br />
                Stop Code: {error.message}
              </h5>
              <button onClick={resetErrorBoundary}>Try again</button>
            </div>
          </div>
        </div>
      </div>
      {/* partial */}
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  const apps = useSelector((state) => state.apps);
  const wallpaper = useSelector((state) => state.wallpaper);

  const onGlobalClick = (event) => {
    var ess = [
      ["START", "STARTHID"],
      ["BAND", "BANDHIDE"],
      ["PANE", "PANEHIDE"],
      ["WIDG", "WIDGHIDE"],
      ["CALN", "CALNHIDE"],
      ["MENU", "MENUHIDE"],
    ];

    var actionType = "";
    try {
      actionType = event.target.dataset.action || "";
    } catch (err) {}

    var actionType0 = getComputedStyle(event.target).getPropertyValue(
      "--prefix"
    );

    ess.forEach((item, i) => {
      if (!actionType.startsWith(item[0]) && !actionType0.startsWith(item[0])) {
        dispatch({
          type: item[1],
        });
      }
    });
  };

  const onContextMenu = (e) => {
    onGlobalClick(e);
    e.preventDefault();
    var data = {
      top: e.clientY,
      left: e.clientX,
    };

    if (e.target.dataset.menu != null) {
      data.menu = e.target.dataset.menu;
      data.attr = e.target.attributes;
      data.dataset = e.target.dataset;
      dispatch({
        type: "MENUSHOW",
        payload: data,
      });
    }
  };

  useEffect(() => {
    onInitialLoad();
    window.onclick = onGlobalClick;
    window.oncontextmenu = onContextMenu;
    dispatch({ type: "WALLBOOTED" });
  }, []);

  return (
    <div className="App">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {wallpaper.backup ? <BackupScreen dir={wallpaper.dir} /> : null}
        {wallpaper.sync ? <SyncScreen dir={wallpaper.dir} /> : null}
        {wallpaper.update ? <UpdateScreen dir={wallpaper.dir} /> : null}
        {!wallpaper.booted ? <BootScreen dir={wallpaper.dir} /> : null}
        {wallpaper.locked ? <LockScreen dir={wallpaper.dir} /> : null}
        <div className="appwrap">
          <Background />
          <div className="desktop" data-menu="desk">
            <DesktopApp />
            {Object.keys(Applications).map((key, idx) => {
              var WinApp = Applications[key];
              return <WinApp key={idx} />;
            })}
            {Object.keys(apps)
              .filter((x) => x != "hz")
              .map((key) => apps[key])
              .map((app, i) => {
                if (app.pwa) {
                  var WinApp = Drafts[app.data.type];
                  return <WinApp key={i} icon={app.icon} {...app.data} />;
                }
              })}
            <StartMenu />
            <BandPanel />
            <SidePanel />
            <WidgetsPanel />
            <Calendar />
          </div>
          <Taskbar />
          <ActionMenu />
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default App;
