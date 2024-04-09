/**
 * @file App.tsx
 * 
 * @description
 * The main parent component for the entire app
 * This contains the logic and code for which components to display
 * 
 * @exports App - The React component for the app 
 */

// External Libraries
import { useEffect, useState, useRef } from 'react';

// Components
import MessageScreen from './components/MessageScreen/MessageScreen';
import SignInScreen from './components/SignInScreen/SignInScreen';
import EditProfileScreen from './components/SettingsScreens/EditProfileScreen';

// Styles
import './styles/themes.css';
import './styles/app.css';

// Types
import { UserData } from './types/interfaces';
import { SetStateBoolean, DivRefObject, ReactButtonClick } from './types/aliases';

// Services
import { handleLogout } from './services/auth';
import { useUsers } from './contexts/users-context';
import MainSettingsScreen from './components/SettingsScreens/MainSettingsScreen';
import MessagesSideBar from './components/MessagesSideBar/MessagesSideBar';



// APP COMPONENTS

/**
 * Main parent component for the app
 * @component
 * @returns The App Component
 */
function App(): JSX.Element {
  // Reference objects that persist across re-renders
  const userMenuRef = useRef<HTMLDivElement>(null);

  // User information state variables
  const { userAuth, currUserInfo, currUserSettings } = useUsers()

  // Visible components state variables
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)


  // useEffects that run on app starting
  useEffect(() => { outsideUserMenuClick(userMenuRef, setUserMenuOpen) }, [])

  // The JSX element for the app
  return (
    <div className={currUserSettings.darkMode? 'App dark-mode': 'App'}>
      { !userAuth ? ( 
          // Display sign in screen if not logged in 
          <SignInScreen/> 
        ) : (
        <div className='appScreen'>
          {/* Main section of screen */}
          <MessagesSideBar/>
          { editProfileOpen? (
            <EditProfileScreen setEditProfileOpen={setEditProfileOpen}/>
          ) : ( settingsOpen? (
            <MainSettingsScreen setSettingsOpen={setSettingsOpen}/>
          ) : (
            <MessageScreen/>
          ))}

          {/* Account button */}
          <button 
            className="accountButton"
            onClick={(event) => handleProfileButtonClick(event, setUserMenuOpen, userMenuOpen)}
          >
            <img className="profilePicture" src={currUserInfo?.profilePic} alt="Profile" />
          </button>

          {/* Account button dropdown menu */}
          {userMenuOpen && (
            <DropDownUserMenu 
              userMenuRef={userMenuRef}
              userInfo={currUserInfo}
              setUserMenuOpen={setUserMenuOpen}
              setEditProfileOpen={setEditProfileOpen}
              setSettingsOpen={setSettingsOpen}
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
 * @component
 * @param userMenuRef - The ref object for this component
 * @param userInfo - The info stored about the current user
 * @param setUserMenuOpen - The setter to determine whether the dropdown menu is visible
 * @param setEditProfileOpen - The setter to determine if the edit profile screen is open 
 * @returns The DropDownUserMenu React component
 */
function DropDownUserMenu({userMenuRef, userInfo, setUserMenuOpen, setEditProfileOpen, setSettingsOpen} : { userMenuRef: DivRefObject,
userInfo: UserData | null, setUserMenuOpen: SetStateBoolean, setEditProfileOpen: SetStateBoolean, setSettingsOpen: SetStateBoolean }): JSX.Element {
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
          style={{width:"80px", border:"5px solid var(--primary-background-colour)"}}
        />
      </div>

      {/* The profile info about the user */}
      <div className = "profileInfo">
        <h2>{userInfo?.displayName}</h2>
        <div style={{fontStyle:"italic"}}>{userInfo?.pronouns}</div>
        <div style={{whiteSpace:"pre-line"}}>{userInfo?.bio}</div>
      </div>

      {/* The buttons to access other screens */}
      <button onClick={()=> {setUserMenuOpen(false), setSettingsOpen(false), setEditProfileOpen(true)}}>
        Edit Profile
      </button>
      <button onClick={()=> {setUserMenuOpen(false), setEditProfileOpen(false), setSettingsOpen(true)}}>
        Settings
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