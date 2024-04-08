/** 
 * @file EditProfileScreen.tsx
 * 
 * @description
 * This module contains everything located on the edit profile screen of the app
 * 
 * @exports EditProfileScreen - The parent component holding the entire edit profile screen
 */ 

// External libraries
import { useState, useRef, useEffect } from 'react';

// Internal modules and styles
import './settings-screens.css';
import { UserData } from '../../types/interfaces';
import { compressAndCropProfilePicture, createDefaultProfilePic } from '../../utils/profile-pictures';
import { updateUserInfo } from '../../services/db';
import { ReactInputChange, SetStateBoolean, SetStateUserData } from '../../types/aliases';
import { useUsers } from '../../contexts/users-context';



// REACT COMPONENTS

/**
 * The parent component holding the entire edit profile screen
 * @component
 * @param setEditProfileOpen - The setter for determining whether this component is visible
 * @returns The EditProfileScreen component
 */
function EditProfileScreen({ setEditProfileOpen }:{ setEditProfileOpen: SetStateBoolean }): JSX.Element {
  // Get userInfo from context
  const { currUserInfo } = useUsers();

  // useStates for determining state variables
  const [newUserInfo, setNewUserInfo] = useState(currUserInfo || 
    { uid: '', displayName: '', defaultProfilePic: true, profilePic: 'default', colour: '#FFFFFF', pronouns: null, bio: null })

  // useEffects that run every time the dependencies change
  useEffect(() => { if (newUserInfo.defaultProfilePic) { 
      setNewUserInfo({...newUserInfo, profilePic: createDefaultProfilePic(newUserInfo.displayName, newUserInfo.colour)}) 
    }}, [newUserInfo.colour, newUserInfo.displayName])


  // The JSX Element
  return (
    <div className='settingsScreen editProfileScreen'>
      <h2> My Profile </h2>
      <ExitButtons newUserInfo={newUserInfo} setEditProfileOpen={setEditProfileOpen}/>
      <TopBar newUserInfo={newUserInfo} setNewUserInfo={setNewUserInfo}/>
      Display Name
      <DisplayNameBox newUserInfo={newUserInfo} setNewUserInfo={setNewUserInfo}/>
      Pronouns
      <PronounsBox newUserInfo={newUserInfo} setNewUserInfo={setNewUserInfo}/>
      Bio
      <BioBox newUserInfo={newUserInfo} setNewUserInfo={setNewUserInfo}/>
      Colour
      <ColourPicker newUserInfo={newUserInfo} setNewUserInfo={setNewUserInfo}/>
    </div>
  )
}
  
export default EditProfileScreen

/**
 * The buttons at the top of the screen allowing user to save changes and exit screen
 * @component
 * @param newUserInfo - The updated user info
 * @param setEditProfileOpen - The setter for the useState determining if this whole screen is open
 * @returns The ExitButtons component
 */
function ExitButtons({newUserInfo, setEditProfileOpen} : { newUserInfo: UserData, setEditProfileOpen: SetStateBoolean}) : JSX.Element {
  // Fetch userInfo from context
  const { currUserInfo, setCurrUserInfo } = useUsers();

  // Determine whether to show the save changes button
  const [showSaveButton, setShowSaveButton] = useState(true)
  useEffect(() => {
    if ( // Compares newUserInfo to old userInfo
      newUserInfo.displayName === currUserInfo?.displayName &&
      newUserInfo.colour === currUserInfo.colour &&
      newUserInfo.pronouns === currUserInfo.pronouns &&
      newUserInfo.bio === currUserInfo.bio &&
      newUserInfo.defaultProfilePic == currUserInfo.defaultProfilePic &&
      (currUserInfo.defaultProfilePic == true || newUserInfo.profilePic == currUserInfo.profilePic)
    ) {
      setShowSaveButton(false)
    } else {
      // Shows save button if userInfo has changed
      setShowSaveButton(true)
    }
  }, [newUserInfo]) // Checks every time newUserInfo is updated

  /**
   * Determines what happens when the save button is clicked
   */
  function onSaveButtonClick() {
    // Update locally stored user info
    setCurrUserInfo(newUserInfo)

    // Updates Firebase user info
    updateUserInfo(newUserInfo, currUserInfo)

    // Hides save button
    setShowSaveButton( false )
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
      <button onClick={() => {setEditProfileOpen(false)}}>Exit</button>
    </div>
  )
}

/**
 * The bar across the top of the screen in the user's colour containing their profile pic
 * @component
 * @param newUserInfo - The updated user info
 * @param setNewUserInfo - The setter for the updated user info
 * @returns The Top Bar component
 */
function TopBar({newUserInfo, setNewUserInfo}: {newUserInfo: UserData, setNewUserInfo: SetStateUserData}): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return(
    <div className= "topBar" style={{background: "linear-gradient(to bottom, " + newUserInfo?.colour + " 50%, transparent 50%)"}}>
      <div className="profileImage">
        <img className="profilePicture" src={newUserInfo?.profilePic} alt="Profile"/>

        {/* The visuals for button which allows updating profile image - clicking automatically clicks the hidden input element */}
        <div className="profilePictureOverlay" onClick={() => {fileInputRef.current?.click()}}>+</div>

        {/* The invisible input element that allows user to add a new profile pic*/}
        <input
          type = "file"
          accept = "image/*"
          ref = {fileInputRef}
          style = {{ display: "none" }}
          onChange={ async (event: ReactInputChange) => {
            if (event.target.files) {
              const file = event.target.files?.[0];
              if (file) {
                const profilePic = await compressAndCropProfilePicture(file)
                setNewUserInfo({...newUserInfo, profilePic: profilePic, defaultProfilePic: false});
              }
            }
          }}
        />
        {/* Button that appears with overlay to reset profile picture to default */}
        {!newUserInfo.defaultProfilePic &&
          <button className='removeProfilePicButton' onClick={()=>{
            setNewUserInfo({...newUserInfo, profilePic: createDefaultProfilePic(newUserInfo.displayName, newUserInfo.colour), defaultProfilePic: true})
          }}>×</button>
        }
      </div>
    </div>
  )
}

/**
 * The input box for changing the user's display name
 * @component
 * @param newUserInfo - The updated user info
 * @param setNewUserInfo - The setter for the updated user info
 * @returns The Display Name Box component
 */
function DisplayNameBox({newUserInfo, setNewUserInfo}: {newUserInfo: UserData, setNewUserInfo: SetStateUserData}): JSX.Element {
  return (
    <textarea 
      placeholder='...'
      maxLength={25} // Limits character length to 25
      value={ newUserInfo.displayName }

      // Handles response to typing in the box
      onChange={(event) => { setNewUserInfo({...newUserInfo, displayName: event.currentTarget.value}); }}
      onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); }}} // Prevents new lines

    ></textarea>
  )
}

/**
 * The input box for changing the user's pronouns
 * @component
 * @param newUserInfo - The updated user info
 * @param setNewUserInfo - The setter for the updated user info
 * @returns The Pronouns Box component
 */
function PronounsBox({newUserInfo, setNewUserInfo}: {newUserInfo: UserData, setNewUserInfo: SetStateUserData}): JSX.Element {
  return (
    <textarea 
      placeholder='...'
      maxLength={25} // Limits character length to 25
      value={ newUserInfo.pronouns? newUserInfo.pronouns: "" }

      // Handles response to typing in the box
      onChange={(event) => { 
        if (event.currentTarget.value === "") { setNewUserInfo({...newUserInfo, pronouns: null}); } // Removes pronouns if box empty
        else { setNewUserInfo({...newUserInfo, pronouns: event.currentTarget.value}); }
      }}
      onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); }}} // Prevents new lines
      
    ></textarea>
  )
}

/**
 * The input box for changing the user's bio
 * @component
 * @param newUserInfo - The updated user info
 * @param setNewUserInfo - The setter for the updated user info
 * @returns The Bio Box component
 */
function BioBox({newUserInfo, setNewUserInfo}: {newUserInfo: UserData, setNewUserInfo: SetStateUserData}): JSX.Element {
  return (
    <textarea 
      className='bio'
      placeholder='...'
      maxLength={128} // Limits character length to 128
      value={ newUserInfo.bio? newUserInfo.bio : "" }

      // Handles response to typing in the box
      onChange={(event) => { 
        if (event.currentTarget.value === "") { setNewUserInfo({...newUserInfo, bio: null}); } // Removes bio if box empty
        else { setNewUserInfo({...newUserInfo, bio: event.currentTarget.value}); }
      }}
      onKeyDown={(event) => { if (event.key === "Enter") { 
        const lines = event.currentTarget.value.split('\n');
          if (lines.length >= 7) { // Limits new lines to 7
            event.preventDefault(); 
          }
      }}}

    ></textarea>
  )
}

/**
 * The input component for changing the user's colour
 * @component
 * @param newUserInfo - The updated user info
 * @param setNewUserInfo - The setter for the updated user info
 * @returns The Colour Picker component
 */
function ColourPicker({newUserInfo, setNewUserInfo}: {newUserInfo: UserData, setNewUserInfo: SetStateUserData}): JSX.Element {
  return (
    <input
        className= "colourPicker"
        type="color"
        value={newUserInfo?.colour}
        onChange={(event: ReactInputChange) => {
            const updatedInfo = {...newUserInfo, colour: event.target.value}
            setNewUserInfo(updatedInfo);
          }}
      />
  )
}