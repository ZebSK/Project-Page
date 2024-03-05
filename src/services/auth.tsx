// External Libraries
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

// Internal Modules
import { auth } from "./firebase"

const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
      'login_hint': 'user@example.com'
  })

export const signInWithGoogle = () => signInWithPopup(auth, provider)
  .then((result) => {
    console.log("User signed in successfully: " + result.user.displayName)
  }).catch((error) => {
    console.error("Error signing in: " + error.message)
  });

export const handleLogout = () => signOut(auth)
  .then(() => {
    console.log("User signed out successfully");
  }).catch((error) => {
    console.error("Error signing out: " + error.message);
  });