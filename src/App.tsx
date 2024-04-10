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
import { useState } from 'react';

// Components
import MessageScreen from './components/MessageScreen/MessageScreen';
import SignInScreen from './components/SignInScreen/SignInScreen';
import EditProfileScreen from './components/SettingsScreens/EditProfileScreen';

// Styles
import './styles/themes.css';
import './styles/app.css';

// Services
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
  // User information state variables
  const { userAuth, currUserSettings } = useUsers()

  // Visible components state variables
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // The JSX element for the app
  return (
    <div className={currUserSettings.darkMode? 'App dark-mode': 'App'}>
      { !userAuth ? ( 
          // Display sign in screen if not logged in 
          <SignInScreen/> 
        ) : (
        <div className='appScreen'>
          {/* Main section of screen */}
          { editProfileOpen? (
            <EditProfileScreen setEditProfileOpen={setEditProfileOpen}/>
          ) : ( settingsOpen? (
            <MainSettingsScreen setSettingsOpen={setSettingsOpen}/>
          ) : (
            <>
              <MessagesSideBar setEditProfileOpen={setEditProfileOpen} setSettingsOpen={setSettingsOpen}/>
              <MessageScreen/>
            </>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
