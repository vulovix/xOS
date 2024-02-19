import { combineReducers, createStore } from "redux";

import wallpaperReducer from "./wallpaper";
import taskbarReducer from "./taskbar";
import deskReducer from "./desktop";
import menuReducer from "./startmenu";
import paneReducer from "./sidepane";
import widReducer from "./widpane";
import appReducer from "./apps";
import menusReducer from "./menu";
import globalReducer from "./globals";
import settingsReducer from "./settings";
import fileReducer from "./files";

const allReducers = combineReducers({
  wallpaper: wallpaperReducer,
  taskbar: taskbarReducer,
  desktop: deskReducer,
  startmenu: menuReducer,
  sidepane: paneReducer,
  widpane: widReducer,
  apps: appReducer,
  menus: menusReducer,
  globals: globalReducer,
  setting: settingsReducer,
  files: fileReducer,
});

var store = createStore(allReducers);

export default store;
