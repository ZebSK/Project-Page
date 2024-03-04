import { initializeApp, FirebaseApp } from "firebase/app";
// Add SDKs for Firebase products
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

/** 
 * @file This module contains everything required to initialise Firebase 
 * @module Firebase
 */ 

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
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

// Connect to emulators if in development mode
if (process.env.NODE_ENV === 'development') {
  console.log("DEVELOPMENT MODE");
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectStorageEmulator(storage, "127.0.0.1", 9199)
}

// Export the initialized Firebase app
export { firebaseApp, auth, db, storage }