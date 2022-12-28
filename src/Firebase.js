// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBftwjwkpr9YG25PGgQXctjaFo9xGAcV08",
  authDomain: "d-libra.firebaseapp.com",
  projectId: "d-libra",
  storageBucket: "d-libra.appspot.com",
  messagingSenderId: "490236854339",
  appId: "1:490236854339:web:45d7cf34733cdd19c354f6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider, signInWithPopup, GoogleAuthProvider };
