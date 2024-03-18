// External libraries
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useState, useRef } from 'react';
import { ChangeEvent } from 'react';

// Internal modules and styles
import './edit-profile-screen.css';
import { UserInfo } from '../../App';
import { compressAndCropProfilePicture, createDefaultProfilePic } from '../../utils/user-profiles';
import { updateUserInfo } from '../../services/db';

/** 
 * @file This module contains everything located on the edit profile screen of the app
 * @module EditProfileScreen
 */ 


// REACT COMPONENTS

/**
 * The parent component holding the entire message screen
 * @component
 * @param userInfo - The global information stored about the user
 * @param setUserInfo - The setter for updating the global information about the user
 * @param setEditProfileOpen - The setter for determining whether this component is visible
 * @returns The MessageScreen component
 */
function EditProfileScreen({userInfo, setUserInfo, setEditProfileOpen}:{
  userInfo: UserInfo | null, setUserInfo: Dispatch<SetStateAction<UserInfo | null>>, setEditProfileOpen: Dispatch<SetStateAction<boolean>>}): JSX.Element {

  // useStates for determining state variables
  const [newUserInfo, setNewUserInfo] = useState(userInfo || 
    { uid: '', displayName: '', defaultProfilePic: true, profilePic: 'default', colour: '#FFFFFF', pronouns: null, bio: null })

  // useEffects that run every time the dependencies change
  useEffect(() => { if (newUserInfo.defaultProfilePic) { 
      setNewUserInfo({...newUserInfo, profilePic: createDefaultProfilePic(newUserInfo.displayName, newUserInfo.colour)}) 
    }}, [newUserInfo.colour, newUserInfo.displayName])


  // The JSX Element
  return (
    <div className='editProfileScreen'>
      <h2> My Profile </h2>
      <ExitButtons newUserInfo={newUserInfo} userInfo={userInfo} setUserInfo={setUserInfo} setEditProfileOpen={setEditProfileOpen}/>
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
  



// COMPONENTS

/**
 * The buttons at the top of the screen allowing user to save changes and exit screen
 * @param newUserInfo - The updated user info
 * @param userInfo - The old user info
 * @param setUserInfo - The setter for updating the global user info
 * @param setEditProfileOpen - The setter for the useState determining if this whole screen is open
 * @returns The ExitButtons component
 */
function ExitButtons({newUserInfo, userInfo, setUserInfo, setEditProfileOpen} : { newUserInfo: UserInfo, userInfo: UserInfo | null,
  setUserInfo: Dispatch<SetStateAction<UserInfo | null>>, setEditProfileOpen: Dispatch<SetStateAction<boolean>>}) : JSX.Element {

  // Determine whether to show the save changes button
  const [showSaveButton, setShowSaveButton] = useState(true)
  useEffect(() => {
    if ( // Compares newUserInfo to old userInfo
      newUserInfo.displayName === userInfo?.displayName &&
      newUserInfo.colour === userInfo.colour &&
      newUserInfo.pronouns === userInfo.pronouns &&
      newUserInfo.bio === userInfo.bio &&
      newUserInfo.defaultProfilePic == userInfo.defaultProfilePic &&
      (userInfo.defaultProfilePic == true || newUserInfo.profilePic == userInfo.profilePic)
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
    setUserInfo(newUserInfo)

    // Updates Firebase user info
    updateUserInfo(newUserInfo, userInfo)

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
 * @param newUserInfo - The updated user info
 * @param setNewUserInfo - The setter for the updated user info
 * @returns The Top Bar component
 */
function TopBar({newUserInfo, setNewUserInfo}: {newUserInfo: UserInfo, setNewUserInfo: Dispatch<SetStateAction<UserInfo>>}): JSX.Element {
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
          onChange={ async (event: React.ChangeEvent<HTMLInputElement>) => {
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
 * @param newUserInfo - The updated user info
 * @param setNewUserInfo - The setter for the updated user info
 * @returns The Display Name Box component
 */
function DisplayNameBox({newUserInfo, setNewUserInfo}: {newUserInfo: UserInfo, setNewUserInfo: Dispatch<SetStateAction<UserInfo>>}): JSX.Element {
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
 * @param newUserInfo - The updated user info
 * @param setNewUserInfo - The setter for the updated user info
 * @returns The Pronouns Box component
 */
function PronounsBox({newUserInfo, setNewUserInfo}: {newUserInfo: UserInfo, setNewUserInfo: Dispatch<SetStateAction<UserInfo>>}): JSX.Element {
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
 * @param newUserInfo - The updated user info
 * @param setNewUserInfo - The setter for the updated user info
 * @returns The Bio Box component
 */
function BioBox({newUserInfo, setNewUserInfo}: {newUserInfo: UserInfo, setNewUserInfo: Dispatch<SetStateAction<UserInfo>>}): JSX.Element {
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
 * @param newUserInfo - The updated user info
 * @param setNewUserInfo - The setter for the updated user info
 * @returns The Colour Picker component
 */
function ColourPicker({newUserInfo, setNewUserInfo}: {newUserInfo: UserInfo, setNewUserInfo: Dispatch<SetStateAction<UserInfo>>}): JSX.Element {
  return (
    <input
        className= "colourPicker"
        type="color"
        value={newUserInfo?.colour}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const updatedInfo = {...newUserInfo, colour: event.target.value}
            setNewUserInfo(updatedInfo);
          }}
      />
  )
}