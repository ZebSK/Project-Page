// External Libraries
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Internal Modules
import { auth } from "./firebase"

const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
      'login_hint': 'user@example.com'
  })

export const signInWithGoogle = () => signInWithPopup(auth, provider)
