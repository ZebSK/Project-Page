/** 
 * @file MainSettingsScreen.tsx
 * 
 * @description
 * This module contains everything located on the main settings screen of the app
 * 
 * @exports MainSettingsScreen - The parent component holding the entire edit profile screen
 */

// External Libraries
import { useEffect, useState } from "react";

// Internal Modules
import { useUsers } from "../../contexts/users-context";
import { SetStateBoolean, setStateUserSettings } from "../../types/aliases";
import { UserSettings } from "../../types/interfaces";
import { updateUserSettings } from "../../services/db";
 


// REACT COMPONENTS

/**
 * The parent component holding the entire main settings screen
 * @component
 * @returns The MainSettingsScreen component
 */
function MainSettingsScreen({ setSettingsOpen }:{ setSettingsOpen: SetStateBoolean }): JSX.Element {
  // Get userInfo from context
  const { currUserSettings, setCurrUserSettings } = useUsers();

  // useStates for determining state variables
  // const [newUserSettings, setNewUserSettings] = useState(currUserSettings)
  const [newUserSettings, setNewUserSettings] = useState(currUserSettings)

  // The JSX Element
  return (
    <div className='settingsScreen'>
      <h2> Settings </h2>
      <ExitButtons newUserSettings={newUserSettings} setNewUserSettings={setNewUserSettings} setSettingsOpen={setSettingsOpen}/>
      <DarkModeSwitch currUserSettings={currUserSettings} setCurrUserSettings={setCurrUserSettings}/>
    </div>
  )
}

export default MainSettingsScreen

/**
 * The buttons at the top of the screen allowing user to save changes and exit screen
 * @component
 * @param newUserSettings - The updated user info
 * @param setEditProfileOpen - The setter for the useState determining if this whole screen is open
 * @returns The ExitButtons component
 */
function ExitButtons({newUserSettings, setNewUserSettings, setSettingsOpen} : { newUserSettings: UserSettings, 
setNewUserSettings: setStateUserSettings, setSettingsOpen: SetStateBoolean}) : JSX.Element {
  // Fetch userInfo from context
  const { currUserSettings, setCurrUserSettings } = useUsers();

  // Determine whether to show the save changes button
  const [showSaveButton, setShowSaveButton] = useState(true)
  useEffect(() => {
    if ( // Compares newUserSettings to old userSettings
      newUserSettings.darkMode === currUserSettings.darkMode
    ) {
      setShowSaveButton(false)
    } else {
      // Shows save button if userSettings has changed
      setShowSaveButton(true)
    }
  }, [newUserSettings, currUserSettings]) // Checks every time newUserInfo is updated

  /**
   * Determines what happens when the save button is clicked
   */
  function onSaveButtonClick() {
    // Update locally stored user info
    setNewUserSettings({...newUserSettings, darkMode: currUserSettings.darkMode});
    setCurrUserSettings({...newUserSettings, darkMode: currUserSettings.darkMode});

    // Update settings in database
    updateUserSettings({...newUserSettings, darkMode: currUserSettings.darkMode})

    // Hides save button
    setShowSaveButton(false);
  }

  /**
   * Determines what happens when the exit button is clicked
   */
  function onExitButtonClick() {
    // Reset dark mode if changed
    setCurrUserSettings({...currUserSettings, darkMode: newUserSettings.darkMode})

    // Closes settings
    setSettingsOpen(false)
  }

  // The JSX Element
  return (
    <div className='exitButtons'> 
      {/* Button to save changes in User Data */}
      {showSaveButton?
      <button className='saveButton' onClick={() => onSaveButtonClick()}>
        Save Changes
      </button> : <div/> } 
      {/* Button to exit the Edit Profile Screen */}
      <button onClick={() => {onExitButtonClick()}}>Exit</button>
    </div>
  )
}

/**
 * The slider to switch between dark and light mode
 * @component
 * @param newUserSettings - The updated user settings
 * @param setNewUserSettings - The setter for the updated user settings 
 * @returns The slider to change between dark/light mode
 */
function DarkModeSwitch ({ currUserSettings, setCurrUserSettings } : { currUserSettings: UserSettings, setCurrUserSettings: setStateUserSettings }): JSX.Element {
  // Switches mode on clicking check
  const handleChange = () => {
    const newValue = !currUserSettings.darkMode;
    // Changes actual user settings in order to show dark mode
    setCurrUserSettings({...currUserSettings, darkMode: newValue});
  };

  // The JSX element
  return (
    <div className="inline-slider-switch">
    <span className="inline-text">Dark Mode</span>
    <label className="slider-switch">
      <input type="checkbox" checked={currUserSettings.darkMode} onChange={handleChange} />
      <span className="slider"></span>
    </label>
  </div>
  );
};
