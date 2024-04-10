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
import { useUsers } from '../../contexts/users-context';
import './messages-side-bar.css';
 



// REACT COMPONENTS

/**
 * The parent component holding the entire side bar
 * @component
 * @returns The MessagesSideBar component
 */
function MessagesSideBar(): JSX.Element {
  const { currUserListeners } = useUsers()

  // The JSX Element
  return (
    // Map function to create multiple MessageBlock components and assign messageContents to them
    <div className="messagesSideBar">
      {currUserListeners.roomIDs}
    </div>
  )
}

export default MessagesSideBar
