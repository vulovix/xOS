import { taskApps } from "../utils";

const alignment = localStorage.getItem("taskbar-align") || "center";

const initialState = {
  apps: taskApps,
  prev: false,
  prevApp: "",
  prevPos: 0,
  align: alignment,
  search: true,
  widgets: true,
  audio: 3,
};

const taskbarReducer = (state = initialState, action) => {
  let newAlignment;

  switch (action.type) {
    case "TASKADD":
    case "TASKREM":
      return state;

    case "TASKCEN":
      return { ...state, align: "center" };

    case "TASKLEF":
      localStorage.setItem("taskbar-align", "left");
      return { ...state, align: "left" };

    case "TASKTOG":
      newAlignment = state.align === "left" ? "center" : "left";
      localStorage.setItem("taskbar-align", newAlignment);
      return { ...state, align: newAlignment };

    case "TASKPSHOW":
      return {
        ...state,
        prev: true,
        prevApp: action.payload?.app || "store",
        prevPos: action.payload?.pos || 50,
      };

    case "TASKPHIDE":
      return { ...state, prev: false };

    case "TASKSRCH":
      return { ...state, search: action.payload === "true" };

    case "TASKWIDG":
      return { ...state, widgets: action.payload === "true" };

    case "TASKAUDO":
      return { ...state, audio: action.payload };

    default:
      return state;
  }
};

export default taskbarReducer;
