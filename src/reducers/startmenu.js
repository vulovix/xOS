import { pinnedApps, recentApps } from "../utils";

const initialState = {
  pnApps: pinnedApps,
  rcApps: recentApps,
  hide: true,
  menu: false,
  showAll: false,
  alpha: false,
  pwctrl: false,
  curAlpha: "A",
  qksrch: [
    ["faClock", 1, "Today in history"],
    ["faChartLine", null, "Markets today"],
    ["faFilm", null, "New movies"],
    ["faNewspaper", 1, "Top news"],
  ],
};

const menuReducer = (state = initialState, { type, payload = "A" }) => {
  switch (type) {
    case "STARTSHW":
      return { ...state, menu: true, hide: false, pwctrl: false };
    case "STARTHID":
      return { ...state, hide: true, showAll: false, pwctrl: false };
    case "STARTOGG":
      return {
        ...state,
        hide: !(state.hide || !state.menu),
        menu: true,
        alpha: false,
        curAlpha: "A",
        pwctrl: false,
        showAll: state.menu && state.showAll,
      };
    case "STARTALL":
      return {
        ...state,
        showAll: !state.showAll,
        alpha: false,
        pwctrl: false,
        curAlpha: "A",
      };
    case "STARTALPHA":
      return {
        ...state,
        alpha: !state.alpha,
        pwctrl: false,
        curAlpha: payload,
      };
    case "STARTSRC":
      return {
        ...state,
        hide: !(state.hide || state.menu),
        menu: false,
        pwctrl: false,
      };
    case "STARTPWC":
      return { ...state, pwctrl: true };
    default:
      return state;
  }
};

export default menuReducer;
