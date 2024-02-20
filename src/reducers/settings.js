const storageState = localStorage.getItem("setting");

const isDarkPreffered =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const defaultInitialState = {
  system: {
    power: {
      saver: {
        state: false,
      },
      battery: 100,
    },
    display: {
      brightness: 100,
      nightlight: {
        state: false,
      },
      connect: false,
    },
  },
  person: {
    name: "X",
    theme: isDarkPreffered ? "dark" : "light",
    color: "blue",
  },
  devices: {
    bluetooth: false,
  },
  network: {
    wifi: {
      state: true,
    },
    airplane: false,
  },
  privacy: {
    location: {
      state: false,
    },
  },
};

const initialState = storageState
  ? JSON.parse(storageState) || defaultInitialState
  : defaultInitialState;

document.body.dataset.theme = initialState.person.theme;

// Helper function: toggle or set value with a given path inside an object
const changeVal = (obj, path, val = "togg") => {
  let tmp = obj;
  const keys = path.split(".");
  const lastKey = keys.pop();

  keys.forEach((key) => {
    tmp = tmp[key];
  });

  tmp[lastKey] = val === "togg" ? !tmp[lastKey] : val;
  return obj;
};

const settingsReducer = (defaultState = initialState, action) => {
  let state = { ...defaultState };
  let changed = false;

  const updateState = (newState, path, value) => {
    changed = true;
    return changeVal(newState, path, value);
  };

  switch (action.type) {
    case "STNGTHEME":
      state = updateState(state, "person.theme", action.payload);
      break;

    case "STNGTOGG":
      state = updateState(state, action.payload);
      break;

    case "STNGSETV":
      const { path, value } = action.payload;
      state = updateState(state, path, value);
      break;

    case "SETTLOAD":
      changed = true;
      state = { ...action.payload };
      break;

    case "TOGGAIRPLNMD":
      changed = true;
      const { airplane } = state.network;
      if (state.network.wifi.state && !airplane) {
        state.network.wifi.state = false;
      }
      if (state.devices.bluetooth && !airplane) {
        state.devices.bluetooth = false;
      }
      state.network.airplane = !airplane;
      break;

    default:
    // No need to handle default case with no changes
  }

  if (changed) {
    localStorage.setItem("setting", JSON.stringify(state));
  }

  return state;
};

export default settingsReducer;
