// Internal Modules
import { signInWithGoogle } from "../services/auth"

/** 
 * @file This module contains the sign-in screen that appears if not logged in
 * @module SignInScreen
 */ 



// REACT COMPONENTS

/**
 * The parent component holding the entire sign-in screen
 * @component
 * @returns The SignInScreen component
 */
function SignInScreen(): JSX.Element {
  // The JSX Element
  return (
    <div>
      <button onClick={signInWithGoogle}>
        Sign in with Google
      </button>

    </div>
  )
}

export default SignInScreen
