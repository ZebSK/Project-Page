// External Libraries
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

// Internal Modules
import { auth } from "./firebase"

/** 
 * @file This module contains everything that requires accessing Firebase Authentication 
 * @module Auth
 */ 

// Sets up google provider
const provider = new GoogleAuthProvider();


/**
 * Function opening a popup allowing the user to sign in with Google
 */
export const signInWithGoogle = () => signInWithPopup(auth, provider)
  .then((result) => {
    console.log("User signed in successfully: " + result.user.displayName)
  }).catch((error) => {
    console.error("Error signing in: " + error.message)
  });

/**
 * Function logging the user out from auth
 */
export const handleLogout = () => signOut(auth)
  .then(() => {
    console.log("User signed out successfully");
  }).catch((error) => {
    console.error("Error signing out: " + error.message);
  });