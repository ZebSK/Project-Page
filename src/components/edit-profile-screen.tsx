// External libraries
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useState } from 'react';
import { ChangeEvent } from 'react';

// Internal modules and styles
import '../styles/edit-profile-screen.css';
import { UserInfo } from '../App';
import { createDefaultProfilePic } from '../utils/user-profiles';
import { updateUserInfo } from '../services/db';

/** 
 * @file This module contains everything located on the edit profile screen of the app
 * @module EditProfileScreen
 */ 


// REACT COMPONENTS

/**
 * The parent component holding the entire message screen
 * @component
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
      <div className= "topBar" style={{background: "linear-gradient(to bottom, " + newUserInfo?.colour + " 50%, transparent 50%)"}}>
        <img className="profilePicture" src={newUserInfo?.profilePic} alt="Profile" style={{width:"120px", border:"5px solid #FFF"}}/>
      </div>

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

function ExitButtons({newUserInfo, userInfo, setUserInfo, setEditProfileOpen} : { newUserInfo: UserInfo, userInfo: UserInfo | null,
  setUserInfo: Dispatch<SetStateAction<UserInfo | null>>, setEditProfileOpen: Dispatch<SetStateAction<boolean>>}) : JSX.Element {

  // Determine whether to show the save changes button
  const [showSaveButton, setShowSaveButton] = useState(true)
  useEffect(() => {
    if (
      newUserInfo.displayName === userInfo?.displayName &&
      newUserInfo.colour === userInfo.colour &&
      newUserInfo.pronouns === userInfo.pronouns &&
      newUserInfo.bio === userInfo.bio
    ) {
      setShowSaveButton(false)
    } else {
      setShowSaveButton(true)
    }
  }, [newUserInfo])

  function onSaveButtonClick() {
    setUserInfo(newUserInfo)
    updateUserInfo(newUserInfo)
    setShowSaveButton( false )
  }

  return (
    <div className='exitButtons'> 
      {showSaveButton?
      <button className='saveButton' onClick={() => onSaveButtonClick()}>
        Save Changes
      </button> : <div/> } 
      <button onClick={() => {setEditProfileOpen(false)}}>Exit</button>
    </div>
  )
}

function DisplayNameBox({newUserInfo, setNewUserInfo}: {newUserInfo: UserInfo, setNewUserInfo: Dispatch<SetStateAction<UserInfo>>}): JSX.Element {
  return (
    <textarea 
      placeholder='...'
      maxLength={25}
      value={ newUserInfo.displayName }

      // Handles response to typing in the box
      onChange={(event) => { setNewUserInfo({...newUserInfo, displayName: event.currentTarget.value}); }}
      onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); }}}

    ></textarea>
  )
}

function PronounsBox({newUserInfo, setNewUserInfo}: {newUserInfo: UserInfo, setNewUserInfo: Dispatch<SetStateAction<UserInfo>>}): JSX.Element {
  return (
    <textarea 
      placeholder='...'
      maxLength={25}
      value={ newUserInfo.pronouns? newUserInfo.pronouns: "" }

      // Handles response to typing in the box
      onChange={(event) => { 
        if (event.currentTarget.value === "") { setNewUserInfo({...newUserInfo, pronouns: null}); }
        else { setNewUserInfo({...newUserInfo, pronouns: event.currentTarget.value}); }
      }}
      onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); }}}
      
    ></textarea>
  )
}

function BioBox({newUserInfo, setNewUserInfo}: {newUserInfo: UserInfo, setNewUserInfo: Dispatch<SetStateAction<UserInfo>>}): JSX.Element {
  return (
    <textarea 
      className='bio'
      placeholder='...'
      maxLength={128}
      value={ newUserInfo.bio? newUserInfo.bio : "" }

      // Handles response to typing in the box
      onChange={(event) => { setNewUserInfo({...newUserInfo, bio: event.currentTarget.value}); }}
      onKeyDown={(event) => { if (event.key === "Enter") { 
        const lines = event.currentTarget.value.split('\n');
          if (lines.length >= 7) {
            event.preventDefault(); 
          }
      }}}

    ></textarea>
  )
}

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