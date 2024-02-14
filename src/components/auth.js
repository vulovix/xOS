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

const provider = new firebase.auth.GoogleAuthProvider();

const app = firebase.initializeApp(firebaseConfig);

if (window.location.hostname !== "localhost") {
  getAnalytics(app);
}

export async function login() {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      var credential = result.credential;

      var token = credential.accessToken;
      var user = result.user;

      console.log(credential, token, user);
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
    });
}

function showUserDetails(user) {
  console.log(user.displayName);
}

function checkAuthState() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      showUserDetails(user);
    } else {
      console.log("Not logged in");
    }
  });
}

export function logout() {
  console.log("Logout Invoked");
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("logged out");
    })
    .catch((e) => {
      console.log(e);
    });
}

checkAuthState();
