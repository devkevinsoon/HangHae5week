import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  // 인증정보!
  apiKey: "AIzaSyBJMIWN50yT5jMauzPROVIs50__1w0fvtQ",
  authDomain: "project02-35533.firebaseapp.com",
  projectId: "project02-35533",
  storageBucket: "project02-35533.appspot.com",
  messagingSenderId: "219706519369",
  appId: "1:219706519369:web:2d896d8bb159e4d240b498",
  measurementId: "G-ECRS7Q5E47",
};

firebase.initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export { auth, apiKey, firestore, storage };
