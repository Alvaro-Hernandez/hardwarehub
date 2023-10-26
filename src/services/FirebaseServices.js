import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDxwSszxM92xKlNizDFl-2dR1BPlk7Iqqc",
  authDomain: "hardwarehub-6f3ac.firebaseapp.com",
  projectId: "hardwarehub-6f3ac",
  storageBucket: "hardwarehub-6f3ac.appspot.com",
  messagingSenderId: "951254573318",
  appId: "1:951254573318:web:f81da63455bf6a32bdfe87",
};

// Initialize Firabase
const app = firebase.initializeApp(firebaseConfig);

// Use these for firestore, authentication and storage
const auth = firebase.auth();
const db = app.firestore();
const storage = firebase.storage();

// Export
export { auth, db, storage };
