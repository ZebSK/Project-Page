/** 
 * @file MessagesSideBar.tsx
 * 
 * @description
 * The side bar to the left of the messages that allows the user to switch between different chats
 * 
 * @exports MessagesSideBar - The parent component holding the entire side bar
 */

// External Libraries


// Internal Modules
import { useEffect, useRef, useState } from 'react';
import { useMessages } from '../../contexts/messages-context';

import './messages-side-bar.css';
import { useUsers } from '../../contexts/users-context';
import { DivRefObject, ReactButtonClick, SetStateBoolean } from '../../types/aliases';
import { handleLogout } from '../../services/auth';
import { UserData } from '../../types/interfaces';
 



// REACT COMPONENTS

/**
 * The parent component holding the entire side bar
 * @component
 * @returns The MessagesSideBar component
 */
function MessagesSideBar({setEditProfileOpen, setSettingsOpen} : {setEditProfileOpen: SetStateBoolean, setSettingsOpen: SetStateBoolean}): JSX.Element {
  
  // Reference objects that persist across re-renders
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Visible components state variables
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // useEffects that run on app starting
  useEffect(() => { outsideUserMenuClick(userMenuRef, setUserMenuOpen) }, [])

  // Get current information from contexts
  const { currRoomID, setCurrRoomID, messageRooms } = useMessages()
  const { otherUserInfo, currUserInfo } = useUsers()

  // useStates
  const [lastMessages, setLastMessages] = useState<{[roomID: string]: string}>({})

  // Determine the last message sent to each room
  useEffect(() => {
    Object.keys(messageRooms).forEach(function (roomID) {
      const messageBlocks = messageRooms[roomID].messageBlocks

      // Display message if no messages loaded
      if (messageBlocks.length === 0) {
        setLastMessages((prevLastMessages) => ({ ...prevLastMessages, [roomID]: "No Messages Loaded"}))
      } else {
        // Gets information about the last message sent
        const lastMessageBlocks = messageBlocks[messageBlocks.length - 1]
        const lastMessageContents = lastMessageBlocks.messageContents[lastMessageBlocks.messageContents.length - 1]
        const lastMessageUser = otherUserInfo[lastMessageBlocks.uid]? otherUserInfo[lastMessageBlocks.uid]?.displayName : "Me"
        const lastMessage = lastMessageUser + ": " + lastMessageContents
        setLastMessages((prevLastMessages) => ({ ...prevLastMessages, [roomID]: lastMessage}))
      }
    })
  }, [messageRooms, otherUserInfo])

  // The JSX Element
  return (
    // Map function to create multiple MessageBlock components and assign messageContents to them
    <div className="messagesSideBar">
      <div className='messageRooms'>
        {Object.keys(messageRooms).map( key => (
            <button key={key} onClick={() => setCurrRoomID(key)} className ={(currRoomID===key)? 'roomButton currentRoom' : 'roomButton'}>
              <div className='roomInfo'>{key}</div>
              <div className='roomInfo smallText'>{lastMessages[key]}</div>
            </button>
        ))}
      </div>

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
  )
}

export default MessagesSideBar


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