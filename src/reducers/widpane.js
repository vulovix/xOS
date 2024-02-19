import * as history from "./static/history.json";
import * as news from "./static/news.json";

const date = new Date();
const eventIndex = Math.floor(Math.random() * history.default.length);
const event = history.default[eventIndex];
date.setFullYear(event.year);

const newsList = news.default.articles.map((article) => {
  const titleParts = article.title.split("-");
  titleParts.pop();
  return {
    ...article,
    title: titleParts.join("-").trim(),
  };
});

const abbr = ["sn", "sl", "h", "t", "hr", "lr", "s", "hc", "lc", "c"];
const wstates = [
  "Snow",
  "Sleet",
  "Hail",
  "Thunderstorm",
  "Heavy Rain",
  "Light Rain",
  "Showers",
  "Heavy Cloud",
  "Light Cloud",
  "Clear",
];

const getRandom = (max, remember = false) => {
  const num = Math.floor(Math.random() * max);
  if (!remember) return num;

  if (typeof getRandom.remembered === "undefined") {
    getRandom.remembered = num;
  }
  return getRandom.remembered;
};

const generateWeatherDays = () =>
  Array.from({ length: 4 }, (_, i) => {
    const dayIndex = (new Date().getDay() + i) % 7;
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return {
      day: daysOfWeek[dayIndex],
      icon: abbr[getRandom(abbr.length)],
      min: 30 + getRandom(10),
      max: 40 + getRandom(10),
    };
  });

const generateStocks = () =>
  Array.from({ length: 2 }, () => [
    Number(parseFloat(2300 + Math.random() * 200).toFixed(2)).toLocaleString(),
    parseFloat(Math.random() * 2).toFixed(2),
    Math.round(Math.random()),
  ]);

const defState = {
  data: {
    weather: {
      city: "New Delhi",
      country: "India",
      wstate: wstates[getRandom(10, true)],
      icon: abbr[getRandom(abbr.length)],
      temp: 30 + getRandom(20),
      rain: 10 + getRandom(80),
      wind: 4 + getRandom(5),
      days: generateWeatherDays(),
    },
    stock: generateStocks(),
    date: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    event: event,
    news: newsList,
  },
  hide: true,
};

const widReducer = (state = defState, action) => {
  switch (action.type) {
    case "WIDGHIDE":
      return { ...state, hide: true };
    case "WIDGTOGG":
      return { ...state, hide: !state.hide };
    case "WIDGREST":
      return { ...action.payload };
    default:
      return state;
  }
};

export default widReducer;
