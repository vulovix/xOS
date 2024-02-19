import { allApps } from "../utils";

let dev = "";
if (import.meta.env.MODE == "development") {
  dev = ""; // set the name (lowercase) of the app you are developing so that it will be opened on refresh
}

const initialState = {};
for (let i = 0; i < allApps.length; i++) {
  initialState[allApps[i].icon] = allApps[i];
  initialState[allApps[i].icon].size = "mini";
  initialState[allApps[i].icon].hide = true;
  initialState[allApps[i].icon].max = null;
  initialState[allApps[i].icon].z = 0;

  if (allApps[i].icon == dev) {
    initialState[allApps[i].icon].size = "mini";
    initialState[allApps[i].icon].hide = false;
    initialState[allApps[i].icon].max = true;
    initialState[allApps[i].icon].z = 1;
  }
}

initialState.hz = 2;

const appReducer = (defaultState = initialState, action) => {
  let state = { ...defaultState };
  if (action.type == "EDGELINK") {
    let obj = { ...state["edge"] };
    if (action.payload && action.payload.startsWith("http")) {
      obj.url = action.payload;
    } else if (action.payload && action.payload.length != 0) {
      obj.url = "https://www.bing.com/search?q=" + action.payload;
    } else {
      obj.url = null;
    }

    obj.size = "mini";
    obj.hide = false;
    obj.max = true;
    state.hz += 1;
    obj.z = state.hz;
    state["edge"] = obj;
    return state;
  } else if (action.type == "SHOWDSK") {
    let keys = Object.keys(state);

    for (let i = 0; i < keys.length; i++) {
      let obj = state[keys[i]];
      if (obj.hide == false) {
        obj.max = false;
        if (obj.z == state.hz) {
          state.hz -= 1;
        }
        obj.z = -1;
        state[keys[i]] = obj;
      }
    }

    return state;
  } else if (action.type == "EXTERNAL") {
    window.open(action.payload, "_blank");
  } else if (action.type == "OPENTERM") {
    let obj = { ...state["terminal"] };
    obj.dir = action.payload;

    obj.size = "mini";
    obj.hide = false;
    obj.max = true;
    state.hz += 1;
    obj.z = state.hz;
    state["terminal"] = obj;
    return state;
  } else if (action.type === "TOGGLE_FULSCREEN") {
    if (
      !document.fullscreenElement && // alternative standard method
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  } else if (action.type == "ADDAPP") {
    state[action.payload.icon] = action.payload;
    state[action.payload.icon].size = "mini";
    state[action.payload.icon].hide = true;
    state[action.payload.icon].max = null;
    state[action.payload.icon].z = 0;

    return state;
  } else if (action.type == "DELAPP") {
    delete state[action.payload];
    return state;
  } else {
    let keys = Object.keys(defaultState);
    for (let i = 0; i < keys.length; i++) {
      let obj = defaultState[keys[i]];
      if (obj.action == action.type) {
        state = { ...defaultState };

        if (action.payload == "full") {
          obj.size = "mini";
          obj.hide = false;
          obj.max = true;
          state.hz += 1;
          obj.z = state.hz;
        } else if (action.payload == "close") {
          obj.hide = true;
          obj.max = null;
          obj.z = -1;
          state.hz -= 1;
        } else if (action.payload == "mxmz") {
          obj.size = ["mini", "full"][obj.size != "full" ? 1 : 0];
          obj.hide = false;
          obj.max = true;
          state.hz += 1;
          obj.z = state.hz;
        } else if (action.payload == "togg") {
          if (obj.z != state.hz) {
            obj.hide = false;
            if (!obj.max) {
              state.hz += 1;
              obj.z = state.hz;
              obj.max = true;
            } else {
              obj.z = -1;
              obj.max = false;
            }
          } else {
            obj.max = !obj.max;
            obj.hide = false;
            if (obj.max) {
              state.hz += 1;
              obj.z = state.hz;
            } else {
              obj.z = -1;
              state.hz -= 1;
            }
          }
        } else if (action.payload == "mnmz") {
          obj.max = false;
          obj.hide = false;
          if (obj.z == state.hz) {
            state.hz -= 1;
          }
          obj.z = -1;
        } else if (action.payload == "resize") {
          obj.size = "cstm";
          obj.hide = false;
          obj.max = true;
          if (obj.z != state.hz) state.hz += 1;
          obj.z = state.hz;
          obj.dim = action.dim;
        } else if (action.payload == "front") {
          obj.hide = false;
          obj.max = true;
          if (obj.z != state.hz) {
            state.hz += 1;
            obj.z = state.hz;
          }
        }

        state[keys[i]] = obj;
        return state;
      }
    }
  }

  return defaultState;
};

export default appReducer;
