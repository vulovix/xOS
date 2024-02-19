const walls = [
  "Windows/img0.jpg",
  "Windows/img1.jpg",
  "Windows/img2.jpg",
  "Windows/img3.jpg",
  "Windows/img4.jpg",
  "Windows/img5.jpg",
  "Windows/img6.jpg",
  "Windows/img7.jpg",
  "Windows/img8.jpg",

  "Mac/img0.jpg",
  "Mac/img1.jpg",

  "Chill/img0.jpg",
  "Chill/img1.jpg",
  "Chill/img2.jpg",
  "Chill/img3.jpg",
  "Chill/img4.jpg",
  "Chill/img5.jpg",
  "Chill/img6.jpg",
  "Chill/img7.jpg",
  "Chill/img8.jpg",
  "Chill/img9.jpg",
  "Chill/img10.jpg",

  "Urban/img0.jpg",
  "Urban/img1.jpg",
  "Urban/img2.jpg",
  "Urban/img3.jpg",
];

const themes = ["Windows", "Mac", "Chill", "Urban"];
const wps = localStorage.getItem("wps") || 0;

const initialState = {
  themes: themes,
  wps,
  src: walls[wps],
  locked: localStorage.getItem("locked") !== "false",
  booted: false || import.meta.env.MODE === "development",
  update: false,
  act: "",
  dir: 0,
};
const wallpaperReducer = (state = initialState, action) => {
  let nextState;

  switch (action.type) {
    case "WALLUNLOCK":
      localStorage.setItem("locked", "false");
      nextState = { ...state, locked: false, dir: 0 };
      break;

    case "WALLNEXT":
      const nextWps = (state.wps + 1) % walls.length;
      localStorage.setItem("wps", nextWps.toString());
      nextState = { ...state, wps: nextWps, src: walls[nextWps] };
      break;

    case "WALLALOCK":
      localStorage.setItem("locked", "true");
      nextState = { ...state, locked: true, dir: -1 };
      break;

    case "WALLBOOTED":
      nextState = { ...state, booted: true, dir: 0, act: "" };
      break;

    case "WALLRESTART":
      nextState = {
        ...state,
        booted: false,
        dir: -1,
        locked: true,
        act: "restart",
      };
      break;

    case "WALLUPDATE":
      nextState = {
        ...state,
        booted: true,
        dir: -1,
        locked: true,
        update: true,
        act: "",
      };
      break;

    case "WALLUPDATED":
      nextState = {
        ...state,
        booted: true,
        dir: 0,
        locked: true,
        update: false,
        act: "",
      };
      break;

    case "WALLBACKUP":
    case "WALLSYNC":
      nextState = {
        ...state,
        booted: true,
        dir: -1,
        locked: false,
        [action.type === "WALLBACKUP" ? "backup" : "sync"]: true,
        act: "",
      };
      break;

    case "WALLBACKUPED":
    case "WALLSYNCED":
      nextState = {
        ...state,
        booted: true,
        dir: 0,
        locked: false,
        [action.type === "WALLBACKUPED" ? "backup" : "sync"]: false,
        act: "",
      };
      break;

    case "WALLSHUTDN":
      nextState = {
        ...state,
        booted: false,
        dir: -1,
        locked: true,
        act: "shutdn",
      };
      break;

    case "WALLSET":
      const isIndex = !Number.isNaN(parseInt(action.payload));
      let wps = 0;
      let src = "";

      if (isIndex) {
        wps = localStorage.getItem("wps");
        src = walls[wps] ? walls[wps] : walls[0];
      } else {
        const idx = walls.findIndex((item) => item === action.payload);
        localStorage.setItem("wps", idx);
        src = action.payload;
        wps = walls[idx];
      }

      nextState = {
        ...state,
        wps: wps,
        src: src,
      };
      break;

    default:
      return state;
  }

  return nextState;
};

export default wallpaperReducer;
