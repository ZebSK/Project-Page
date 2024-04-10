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
import { useEffect, useState } from 'react';
import { useMessages } from '../../contexts/messages-context';

import './messages-side-bar.css';
import { useUsers } from '../../contexts/users-context';
 



// REACT COMPONENTS

/**
 * The parent component holding the entire side bar
 * @component
 * @returns The MessagesSideBar component
 */
function MessagesSideBar(): JSX.Element {
  // Get current information from contexts
  const { currRoomID, setCurrRoomID, messageRooms } = useMessages()
  const { otherUserInfo } = useUsers()

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
    </div>
  )
}

export default MessagesSideBar
