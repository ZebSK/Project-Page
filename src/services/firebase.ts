import { initializeApp, FirebaseApp } from "firebase/app";
// Add SDKs for Firebase products
import { } from "firebase/auth";
import { } from 'firebase/firestore';
import { } from 'firebase/storage';

// Set up web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA73g4kSDJF3KvH5tXNIOXHLeQOANzLph4",
  authDomain: "zubblehome.firebaseapp.com",
  projectId: "zubblehome",
  storageBucket: "zubblehome.appspot.com",
  messagingSenderId: "948413495471",
  appId: "1:948413495471:web:ad438521c19933ccb13c5a"
};

// Initialize Firebase
const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);

// Export the initialized Firebase app
export default firebaseApp;