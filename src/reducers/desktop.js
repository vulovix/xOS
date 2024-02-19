import { desktopApps } from "../utils";

const defState = {
  apps: desktopApps,
  hide: false,
  size: 1,
  sort: "none",
  aboutOpen: false,
};

function saveAppsToLocalStorage(apps) {
  localStorage.setItem("desktop", JSON.stringify(apps.map((app) => app.name)));
}

const deskReducer = (state = defState, action) => {
  let arr;

  switch (action.type) {
    case "DESKREM":
      arr = state.apps.filter((app) => app.name !== action.payload);
      saveAppsToLocalStorage(arr);
      return { ...state, apps: arr };

    case "DESKADD":
      arr = [...state.apps, action.payload];
      saveAppsToLocalStorage(arr);
      return { ...state, apps: arr };

    case "DESKHIDE":
      return { ...state, hide: true };

    case "DESKSHOW":
      return { ...state, hide: false };

    case "DESKTOGG":
      return { ...state, hide: !state.hide };

    case "DESKSIZE":
      return { ...state, size: action.payload };

    case "DESKSORT":
      return { ...state, sort: action.payload || "none" };

    case "DESKABOUT":
      return { ...state, aboutOpen: action.payload };

    default:
      return state;
  }
};

export default deskReducer;
