var wps = localStorage.getItem("wps") || 0;
var locked = localStorage.getItem("locked");

const walls = [
  "Windows/img0.jpg",
  "Windows/img1.jpg",
  "Windows/img2.jpg",
  "Windows/img3.jpg",
  "Windows/img4.jpg",
  "Windows/img5.jpg",

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

const defState = {
  themes: themes,
  wps: wps,
  src: walls[wps],
  locked: !(locked == "false"),
  booted: false || import.meta.env.MODE == "development",
  act: "",
  dir: 0,
};

const wallReducer = (state = defState, action) => {
  switch (action.type) {
    case "WALLUNLOCK":
      localStorage.setItem("locked", false);
      return {
        ...state,
        locked: false,
        dir: 0,
      };
    case "WALLNEXT":
      var twps = (state.wps + 1) % walls.length;
      localStorage.setItem("wps", twps);
      return {
        ...state,
        wps: twps,
        src: walls[twps],
      };
    case "WALLALOCK":
      return {
        ...state,
        locked: true,
        dir: -1,
      };
    case "WALLBOOTED":
      return {
        ...state,
        booted: true,
        dir: 0,
        act: "",
      };
    case "WALLRESTART":
      return {
        ...state,
        booted: false,
        dir: -1,
        locked: true,
        act: "restart",
      };
    case "WALLSHUTDN":
      return {
        ...state,
        booted: false,
        dir: -1,
        locked: true,
        act: "shutdn",
      };
    case "WALLSET":
      var isIndex = !Number.isNaN(parseInt(action.payload)),
        wps = 0,
        src = "";

      if (isIndex) {
        wps = localStorage.getItem("wps");
        src = walls[wps] ? walls[wps] : walls[0];
      } else {
        const idx = walls.findIndex((item) => item === action.payload);
        localStorage.setItem("wps", idx);
        src = action.payload;
        wps = walls[idx];
      }

      return {
        ...state,
        wps: wps,
        src: src,
      };
    default:
      return state;
  }
};

export default wallReducer;
