// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKRXtc_NOF9_efSSTeZAQPlKE_V6NT-X0",
  authDomain: "curiositylaberp.firebaseapp.com",
  projectId: "curiositylaberp",
  storageBucket: "curiositylaberp.firebasestorage.app",
  messagingSenderId: "290676223069",
  appId: "1:290676223069:web:949c45d33b3f401c21b1b4",
  measurementId: "G-2JT79710TF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 