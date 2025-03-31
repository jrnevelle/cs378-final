// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbGAzDVGb1opD7IdzCKSUdNOy3kHCqeVk",
  authDomain: "vote-voyage.firebaseapp.com",
  projectId: "vote-voyage",
  storageBucket: "vote-voyage.firebasestorage.app",
  messagingSenderId: "993832086387",
  appId: "1:993832086387:web:d41208fe58e24d5389f306",
  measurementId: "G-BDX2QW3M4T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };