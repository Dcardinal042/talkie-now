// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDD6qmujmBByoCasbvnsr_lgdPjrJYHn8c",
  authDomain: "talkie-now.firebaseapp.com",
  projectId: "talkie-now",
  storageBucket: "talkie-now.firebasestorage.app",
  messagingSenderId: "80029536527",
  appId: "1:80029536527:web:d69ea9f2421cd444f92e7a",
  measurementId: "G-7BP5G1EZFB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
