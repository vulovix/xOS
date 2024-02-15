export const gene_name = () =>
  Math.random().toString(36).substring(2, 10).toUpperCase();

let installed = JSON.parse(localStorage.getItem("installed") || "[]");

const apps = [
  {
    name: "Start",
    icon: "home",
    type: "action",
    action: "STARTMENU",
  },
  {
    name: "Search",
    icon: "search",
    type: "action",
    action: "SEARCHMENU",
  },
  {
    name: "Widget",
    icon: "widget",
    type: "action",
    action: "WIDGETS",
  },
  {
    name: "Settings",
    icon: "settings",
    type: "app",
    action: "SETTINGS",
  },
  {
    name: "Task Manager",
    icon: "taskmanager",
    type: "app",
    action: "TASKMANAGER",
  },
  {
    name: "File Explorer",
    icon: "explorer",
    type: "app",
    action: "EXPLORER",
  },
  {
    name: "Browser",
    icon: "edge",
    type: "app",
    action: "MSEDGE",
  },
  // {
  //   name: "Buy me a coffee",
  //   icon: "buyme",
  //   type: "app",
  //   action: "EXTERNAL",
  //   payload: "https://www.buymeacoffee.com/blueedgetechno",
  // },
  {
    name: "Store",
    icon: "store",
    type: "app",
    action: "WNSTORE",
  },
  {
    name: "Recycle Bin",
    icon: "bin0",
    type: "app",
  },
  {
    name: "Blue",
    icon: "win/user",
    type: "app",
    action: "EXPLORER",
  },
  {
    name: "Alarms",
    icon: "alarm",
    type: "app",
  },
  {
    name: "Calculator",
    icon: "calculator",
    type: "app",
    action: "CALCUAPP",
  },
  {
    name: "Calendar",
    icon: "calendar",
    type: "app",
  },
  {
    name: "Camera",
    icon: "camera",
    type: "app",
    action: "CAMERA",
  },
  {
    name: "Your Phone",
    icon: "yphone",
    type: "app",
  },
  {
    name: "Feedback",
    icon: "feedback",
    type: "app",
  },
  {
    name: "Get Started",
    icon: "getstarted",
    type: "app",
    action: "OOBE",
  },
  {
    name: "Groove Music",
    icon: "groove",
    type: "app",
  },
  {
    name: "Help",
    icon: "help",
    type: "app",
    action: "EXTERNAL",
    payload: "https://win11react-docs.andrewstech.me/",
  },
  {
    name: "Yammer",
    icon: "yammer",
    type: "app",
  },
  {
    name: "Mail",
    icon: "mail",
    type: "app",
    action: "EXTERNAL",
    payload: "mailto:vulovix@gmail.com",
  },
  {
    name: "Movies",
    icon: "movies",
    type: "app",
  },
  {
    name: "Xbox",
    icon: "xbox",
    type: "app",
  },
  {
    name: "Office",
    icon: "msoffice",
    type: "app",
  },
  {
    name: "Narrator",
    icon: "narrator",
    type: "app",
  },
  {
    name: "News",
    icon: "news",
    type: "app",
  },
  {
    name: "Notepad",
    icon: "notepad",
    type: "app",
    action: "NOTEPAD",
  },
  {
    name: "Sticky Notes",
    icon: "notes",
    type: "app",
  },
  {
    name: "OneDrive",
    icon: "oneDrive",
    type: "app",
  },
  {
    name: "OneNote",
    icon: "onenote",
    type: "app",
  },
  {
    name: "Outlook",
    icon: "outlook",
    type: "app",
  },
  {
    name: "People",
    icon: "people",
    type: "app",
  },
  {
    name: "Photos",
    icon: "photos",
    type: "app",
  },
  // {
  //   name: "Pinterest",
  //   icon: "pinterest",
  //   type: "app",
  //   payload: "https://www.pinterest.com/blueedgetechno/",
  //   action: "EXTERNAL",
  // },
  {
    name: "Security",
    icon: "security",
    type: "app",
  },
  {
    name: "Sharepoint",
    icon: "share",
    type: "app",
  },
  {
    name: "Skype",
    icon: "skype",
    type: "app",
  },
  {
    name: "Snipping Tool",
    icon: "snip",
    type: "app",
  },
  {
    name: "Twitter",
    icon: "twitter",
    type: "app",
    action: "EXTERNAL",
    payload: "https://twitter.com/vulovix",
  },
  {
    name: "Teams",
    icon: "teams",
    type: "app",
  },
  {
    name: "Terminal",
    icon: "terminal",
    type: "app",
    action: "TERMINAL",
  },
  {
    name: "Tips",
    icon: "tips",
    type: "app",
  },
  {
    name: "To Do",
    icon: "todo",
    type: "app",
  },
  {
    name: "Maps",
    icon: "maps",
    type: "app",
  },
  {
    name: "Voice Recorder",
    icon: "voice",
    type: "app",
  },
  {
    name: "Weather",
    icon: "weather",
    type: "app",
  },
  {
    name: "Whiteboard",
    icon: "board",
    type: "app",
    action: "WHITEBOARD",
  },
  {
    name: "Cortana",
    icon: "cortana",
    type: "app",
  },
  {
    name: "Github",
    icon: "github",
    type: "app",
    action: "EXTERNAL",
    payload: "https://github.com/vulovix/xOS",
  },
  // {
  //   name: "MindHub",
  //   icon: "https://mindhub.dev/favicon.png",
  //   type: "app",
  //   payload: "https://mindhub.dev",
  //   action: "EXTERNAL",
  // },
];

for (let i = 0; i < installed.length; i++) {
  installed[i].action = gene_name();
  apps.push(installed[i]);
}

export default apps;
