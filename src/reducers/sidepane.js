const initialState = {
  quicks: [
    {
      ui: true,
      src: "wifi",
      name: "WiFi",
      state: "network.wifi.state",
      action: "STNGTOGG",
    },
    {
      ui: true,
      src: "bluetooth",
      name: "Bluetooth",
      state: "devices.bluetooth",
      action: "STNGTOGG",
    },
    {
      ui: true,
      src: "airplane",
      name: "Flight Mode",
      state: "network.airplane",
      action: "flightMode",
    },
    {
      ui: true,
      src: "saver",
      name: "Battery Saver",
      state: "system.power.saver.state",
      action: "STNGTOGG",
    },
    {
      ui: true,
      src: "sun",
      name: "Theme",
      state: "person.theme",
      action: "changeTheme",
    },
    {
      ui: true,
      src: "nightlight",
      name: "Night Light",
      state: "system.display.nightlight.state",
      action: "STNGTOGG",
    },
  ],
  hide: true,
  banhide: true,
  calhide: true,
};

const paneReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PANETHEM": {
      // Update an item in the `quicks` array immutably
      const updatedQuicks = state.quicks.map((item, index) =>
        index === 4 ? { ...item, src: action.payload } : item
      );
      return { ...state, quicks: updatedQuicks };
    }
    case "BANDTOGG":
      return { ...state, banhide: !state.banhide };
    case "BANDHIDE":
      return { ...state, banhide: true };
    case "PANETOGG":
      return { ...state, hide: !state.hide };
    case "PANEHIDE":
      return { ...state, hide: true };
    case "CALNTOGG":
      return { ...state, calhide: !state.calhide };
    case "CALNHIDE":
      return { ...state, calhide: true };
    default:
      return state;
  }
};

export default paneReducer;
