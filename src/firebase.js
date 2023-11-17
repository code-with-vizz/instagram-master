import firebase from "firebase";
const firebaseApp = firebase.initializeApp(
    {
    apiKey: "AIzaSyAb4aqcPX0jNYoDcmtRtPQyHt3jS7CaEhc",
    authDomain: "myinstagram-f9f29.firebaseapp.com",
    projectId: "myinstagram-f9f29",
    storageBucket: "myinstagram-f9f29.appspot.com",
    messagingSenderId: "581988219863",
    appId: "1:581988219863:web:72d294e0dbc443c71ea992",
    measurementId: "G-QC1NNV98HK"}
);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db,auth,storage};

