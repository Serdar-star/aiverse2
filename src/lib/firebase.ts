import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCnkI5sQmVSsyCX_4gwaRNsmi9MKrydWLY",
  authDomain: "chatapp-23897.firebaseapp.com",
  projectId: "chatapp-23897",
  storageBucket: "chatapp-23897.firebasestorage.app",
  messagingSenderId: "169064244744",
  appId: "1:169064244744:web:6ed92d7cbb73c1653513bd",
  measurementId: "G-G4T18JYQP8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Analytics only in browser
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, analytics };
