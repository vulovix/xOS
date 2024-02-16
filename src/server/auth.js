import { firebase } from "./server";

// https://firebase.google.com/docs/auth/web/manage-users
// https://firebase.google.com/docs/reference/js/v8/firebase.User
// https://firebase.google.com/docs/rules/rules-and-auth

export async function login() {
  console.log("Login Invoked.");
  const provider = new firebase.auth.GoogleAuthProvider();

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

export function logout() {
  console.log("Logout Invoked.");
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

export const checkAuthState = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("Logged in as ", user.displayName, ".");
      // user.getIdToken().then(console.log);
      // user.providerData.forEach((profile) => {
      //   console.log("Sign-in provider: " + profile.providerId);
      //   console.log("  Provider-specific UID: " + profile.uid);
      //   console.log("  Name: " + profile.displayName);
      //   console.log("  Email: " + profile.email);
      //   console.log("  Photo URL: " + profile.photoURL);
      // });
      // console.log("  UID: " + user.uid);
      return user;
    }
    console.log("Not logged in.");
    return null;
  });
};

checkAuthState();
