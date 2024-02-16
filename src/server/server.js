import "firebase/compat/auth";
import firebase from "firebase/compat/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBB2bAlqG4o-uQxgvz24LBF9GqeyjO7LSY",
  authDomain: "auth.xos.dev",
  projectId: "xos-36e4f",
  storageBucket: "xos-36e4f.appspot.com",
  messagingSenderId: "661371614434",
  appId: "1:661371614434:web:095d6831bba5c7fb3f9abb",
  measurementId: "G-1VMERJSDSQ",
};

const app = firebase.initializeApp(firebaseConfig);

if (window.location.hostname !== "localhost") {
  getAnalytics(app);
}

export { firebase, firebaseConfig, app };
