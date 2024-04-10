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
import { useMessages } from '../../contexts/messages-context';

import './messages-side-bar.css';
 



// REACT COMPONENTS

/**
 * The parent component holding the entire side bar
 * @component
 * @returns The MessagesSideBar component
 */
function MessagesSideBar(): JSX.Element {
  const { setCurrRoomID, messageRooms } = useMessages()

  // The JSX Element
  return (
    // Map function to create multiple MessageBlock components and assign messageContents to them
    <div className="messagesSideBar">
      {Object.keys(messageRooms).map( key => (
          <button key={key} onClick={() => setCurrRoomID(key)}>
            {key}
          </button>
        ))}
    </div>
  )
}

export default MessagesSideBar
