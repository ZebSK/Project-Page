// Internal Modules
import { signInWithGoogle } from "../services/auth"
import '../styles/sign-in-screen.css';

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
    <div className="signInScreen">
      <button className="googleButton" onClick={signInWithGoogle}>
        <img className="googleLogo" src="http://1000logos.net/wp-content/uploads/2016/11/New-Google-Logo.jpg" alt="Google Logo"/>
        Sign in with Google
      </button>

    </div>
  )
}

export default SignInScreen
