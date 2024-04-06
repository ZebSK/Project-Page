import { initializeApp, FirebaseApp } from "firebase/app";
// Add SDKs for Firebase products
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

/** 
 * This module contains everything required to initialise Firebase
 */ 

// Set up web app's Firebase configuration
let firebaseConfig = {};
if (import.meta.env.API_KEY) {
  // If running through GitActions and config passed in through secrets
  firebaseConfig = {
    apiKey: import.meta.env.API_KEY,
    authDomain: import.meta.env.AUTH_DOMAIN,
    projectId: import.meta.env.PROJECT_ID,
    storageBucket: import.meta.env.STORAGE_BUCKET,
    messagingSenderId: import.meta.env.MESSAGING_SENDER_ID,
    appId: import.meta.env.APP_ID
  }; 
} else if (import.meta.env.VITE_API_KEY) {
  // If running on local machine and config passed in through .env
  firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID
  };
}

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