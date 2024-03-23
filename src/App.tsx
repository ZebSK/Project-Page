// External libraries
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState, useRef } from 'react';
import { User } from 'firebase/auth';

// Internal modules
import MessageScreen from './components/MessageScreen/MessageScreen';
import SignInScreen from './components/SignInScreen/SignInScreen';
import EditProfileScreen from './components/EditProfileScreen/EditProfileScreen';

import './styles/app.css';

import { UserInfo, UserDictionary } from './types/interfaces';
import { SetStateBoolean, SetStateUserDict, DivRefObject, ReactButtonClick } from './types/aliases';

import { auth } from './services/firebase';
import { handleLogout } from './services/auth';
import { handleSignIn, subscribeToUserInfo } from './services/db';




// APP COMPONENTS

/**
 * Main parent component for the app
 * @returns The App Component
 */
function App(): JSX.Element {
  // Reference objects that persist across re-renders
  const userMenuRef = useRef<HTMLDivElement>(null);

  // User information state variables
  const [userAuth] = useAuthState(auth); // Check if signed in
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [otherUserInfo, setOtherUserInfo] = useState<UserDictionary>({})

  // Visible components state variables
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)

  // useEffects that run on app starting
  useEffect(() => { outsideUserMenuClick(userMenuRef, setUserMenuOpen) }, [])

  // useEffects that run on login/logout
  useEffect(() => { handleSignIn(setUserInfo) }, [userAuth])
  useEffect(() => { listenToUserInfo(userAuth, setOtherUserInfo) }, [userAuth])

  // The JSX element for the app
  return (
    <div className='App'>
      { !userAuth ? ( 
          // Display sign in screen if not logged in 
          <SignInScreen/> 
        ) : (
        <div className='appScreen'>
          {/* Main section of screen */}
          { editProfileOpen? (
            <EditProfileScreen 
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              setEditProfileOpen={setEditProfileOpen}
            />
          ) : (
            <MessageScreen 
              userInfo={userInfo}
              otherUserInfo={otherUserInfo}
            />
          )}

          {/* Account button */}
          <button 
            className="accountButton"
            onClick={(event) => handleProfileButtonClick(event, setUserMenuOpen, userMenuOpen)}
          >
            <img className="profilePicture" src={userInfo?.profilePic} alt="Profile" />
          </button>

          {/* Account button dropdown menu */}
          {userMenuOpen && (
            <DropDownUserMenu 
              userMenuRef={userMenuRef}
              userInfo={userInfo}
              setUserMenuOpen={setUserMenuOpen}
              setEditProfileOpen={setEditProfileOpen}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;

/**
 * The component containing the dropdown menu that appears when clicking profile picture
 * @param userMenuRef - The ref object for this component
 * @param userInfo - The info stored about the current user
 * @param setUserMenuOpen - The setter to determine whether the dropdown menu is visible
 * @param setEditProfileOpen - The setter to determine if the edit profile screen is open 
 * @returns The DropDownUserMenu React component
 */
function DropDownUserMenu({userMenuRef, userInfo, setUserMenuOpen, setEditProfileOpen} : { userMenuRef: DivRefObject,
userInfo: UserInfo | null, setUserMenuOpen: SetStateBoolean, setEditProfileOpen: SetStateBoolean }): JSX.Element {
  return (
    <div className = "userMenu" ref={userMenuRef}>
      {/* The bar across the top of the dropdown menu */}
      <div 
        className= "menuBar" 
        style={{background: "linear-gradient(to bottom, " + userInfo?.colour + " 50%, transparent 50%)"}}
      >
        <img
          className="profilePicture"
          src={userInfo?.profilePic}
          alt="Profile"
          style={{width:"80px", border:"5px solid #FFF"}}
        />
      </div>

      {/* The profile info about the user */}
      <div className = "profileInfo">
        <h2>{userInfo?.displayName}</h2>
        <div style={{fontStyle:"italic"}}>{userInfo?.pronouns}</div>
        <div style={{whiteSpace:"pre-line"}}>{userInfo?.bio}</div>
      </div>

      {/* The buttons to access other screens */}
      <button onClick={()=> {setUserMenuOpen(false), setEditProfileOpen(true)}}>
        Edit Profile
      </button>
      <button onClick={()=> {handleLogout() ;setUserMenuOpen(false)}}>
        Log Out
      </button>
    </div>
  )
}



// FUNCTIONS

/**
 * Sets up a listener to hide user menu if clicking outside of it
 * @param menuRef - Reference to user menu
 * @param setUserMenuOpen - Setter to set whether menu is hidden
 */
function outsideUserMenuClick(menuRef: DivRefObject, setUserMenuOpen: SetStateBoolean) {
  /**
   * Function to check if menu is open and close if click event not on menu
   * @param event - Mouse clicking event
   */
  function handleOutsideUserMenuCLick(event: MouseEvent) {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setUserMenuOpen(false);
    }
  }
  // Add event listener
  document.addEventListener("click", handleOutsideUserMenuCLick);

  // Remove event listener on disconnect
  return () => {
    document.removeEventListener("click", handleOutsideUserMenuCLick);
  }
}

/**
 * Function to handle the clicking of the profile picture button
 * @param event - The mouse clicking event
 * @param setUserMenuOpen - The setter to determine if the menu is showing
 * @param userMenuOpen - The variable for whether the menu is showing
 */
function handleProfileButtonClick(event: ReactButtonClick, setUserMenuOpen: SetStateBoolean, userMenuOpen: boolean) {
  event.stopPropagation(); // Stop outsideUserMenuClick from triggering
  setUserMenuOpen(!userMenuOpen) // Hides or shows the dropdown menu depending on current state
}

/**
 * Listener to record any updates to user info
 * @param userAuth - The authentication of the current user
 * @param setOtherUserInfo - The setter to update information about other users
 * @returns 
 */
function listenToUserInfo(userAuth: User | null | undefined, setOtherUserInfo: SetStateUserDict): () => void {
  if (userAuth) {
    // Add event listener on new user
    const unsubscribe = subscribeToUserInfo(userAuth.uid, setOtherUserInfo)

    // Remove event listener on changing user/disconnect
    return () => { unsubscribe() }
  }
  return () => { return }
}
