import { Bin } from "../utils/bin";
import fdata from "./static/dir.json";

const initialState = {
  cdir: "%user%",
  hist: [],
  hid: 0,
  view: 1,
};

initialState.hist.push(initialState.cdir);
initialState.data = new Bin();
initialState.data.parse(
  localStorage.getItem("xOS_Explorer")
    ? JSON.parse(localStorage.getItem("xOS_Explorer")) || fdata
    : fdata
);

const fileReducer = (defaultState = initialState, action) => {
  let state = { ...defaultState };
  let navHist = false;

  switch (action.type) {
    case "FILEDIR":
      state.cdir = action.payload;
      break;

    case "FILEPATH":
      const pathid = state.data.parsePath(action.payload);
      if (pathid) {
        state.cdir = pathid;
      }
      break;

    case "FILEBACK":
      const item = state.data.getId(state.cdir);
      if (item && item.host) {
        state.cdir = item.host.id;
      }
      break;

    case "FILEVIEW":
      state.view = action.payload;
      break;

    case "FILEPREV":
      state.hid = Math.max(0, state.hid - 1);
      navHist = true;
      break;

    case "FILENEXT":
      state.hid = Math.min(state.hist.length - 1, state.hid + 1);
      navHist = true;
      break;

    case "FILEOPEN":
      state.active = action.payload;
      break;

    case "FILECLOSE":
      state.active = null;
      break;

    default:
    // No default action
  }

  if (!navHist && state.cdir !== state.hist[state.hid]) {
    state.hist = state.hist.slice(0, state.hid + 1);
    state.hist.push(state.cdir);
    state.hid = state.hist.length - 1;
  }

  state.cdir = state.hist[state.hid];
  if (state.cdir.includes("%") && state.data.special[state.cdir] != null) {
    state.cdir = state.data.special[state.cdir];
    state[state.hid] = state.cdir;
  }

  state.cpath = state.data.getPath(state.cdir);
  return state;
};

// const fileReducer = (state = defState, action) => {
//   var tmp = { ...state };
//   var navHist = false;

//   if (action.type === "FILEDIR") {
//     tmp.cdir = action.payload;
//   } else if (action.type === "FILEPATH") {
//     var pathid = tmp.data.parsePath(action.payload);
//     if (pathid) tmp.cdir = pathid;
//   } else if (action.type === "FILEBACK") {
//     var item = tmp.data.getId(tmp.cdir);
//     if (item.host) {
//       tmp.cdir = item.host.id;
//     }
//   } else if (action.type === "FILEVIEW") {
//     tmp.view = action.payload;
//   } else if (action.type === "FILEPREV") {
//     tmp.hid--;
//     if (tmp.hid < 0) tmp.hid = 0;
//     navHist = true;
//   } else if (action.type === "FILENEXT") {
//     tmp.hid++;
//     if (tmp.hid > tmp.hist.length - 1) tmp.hid = tmp.hist.length - 1;
//     navHist = true;
//   } else if (action.type === "FILEOPEN") {
//     tmp.active = action.payload;
//   } else if (action.type === "FILECLOSE") {
//     tmp.active = null;
//   }

//   if (!navHist && tmp.cdir != tmp.hist[tmp.hid]) {
//     tmp.hist.splice(tmp.hid + 1);
//     tmp.hist.push(tmp.cdir);
//     tmp.hid = tmp.hist.length - 1;
//   }

//   tmp.cdir = tmp.hist[tmp.hid];
//   if (tmp.cdir.includes("%")) {
//     if (tmp.data.special[tmp.cdir] != null) {
//       tmp.cdir = tmp.data.special[tmp.cdir];
//       tmp[tmp.hid] = tmp.cdir;
//     }
//   }

//   tmp.cpath = tmp.data.getPath(tmp.cdir);
//   return tmp;
// };

export default fileReducer;
