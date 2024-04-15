/** 
 * @file MessageBubble.tsx
 * 
 * @description
 * This module contains everything for displaying each individual message
 * 
 * @exports MessageBubble - The parent component holding the entire message
 */

// External Libraries
import { useEffect, useRef, useState } from "react";

// Types
import { Message, UserData } from "../../types/interfaces";

// Utils
import { outsideObjectClick } from "../../utils/mouse-events";
import { markdownLaTeXToHTML } from "../../utils/text-formatting";

// Images
import pixilEmoji from '../../assets/pixil-emoji.png';
import { defaultReactions } from "../../config/constants";
import { useMessages } from "../../contexts/messages-context";
import { useUsers } from "../../contexts/users-context";
import { addReact } from "../../services/db";



// PARENT MESSAGE BUBBLE COMPONENT

/**
 * Message component holding each individual message
 * @component
 * @param isYoursIndicator - Determines which side of the screen to display the message
 * @param message - The details of the message
 * @returns The Message component
 */
function MessageBubble({ isYoursIndicator, message }: { isYoursIndicator: string; message: Message }): JSX.Element {
  // useStates
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [showReactMenu, setShowReactMenu] = useState<boolean>(false)
  
  const reactMenuRef = useRef<HTMLDivElement>(null)
  const reactMenuButtonRef = useRef<HTMLButtonElement>(null)
  
  const { currRoomID } = useMessages()
  const { currUserInfo } = useUsers()

  useEffect(() => { outsideObjectClick(reactMenuRef, setShowReactMenu, reactMenuButtonRef) }, [])

  return(
    <div className="messageLine" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className={"message" + " " + isYoursIndicator}>
        {/* The Message Bubble */}
        {checkIfOnlyEmoji(message.content)?
          <span className={"messageBubble emojiBubble" + " " + isYoursIndicator}>{message.content}</span>  :
          <span className={"messageBubble" + " " + isYoursIndicator}>{markdownLaTeXToHTML(message.content)}</span>
        }
        {/* Add Reaction Button */}
        {isHovered &&
          <button 
            className={'addEmoji' + " " + isYoursIndicator}
            onClick={() => setShowReactMenu(!showReactMenu)}
            ref={reactMenuButtonRef}
          >
            <img className='addEmojiImage' src={pixilEmoji} alt="Add Emoji"/>
          </button> 
        }
        {showReactMenu &&
          <div className={'addEmojiMenu' + " " + isYoursIndicator} ref={reactMenuRef}>
            {defaultReactions.map((emoji, index) => (
              <button key={index} className='emojiOptionButton' 
              onClick={() => {addOrRemoveReact(message, emoji, currRoomID, currUserInfo); setShowReactMenu(false)}}
              >{emoji}</button>
            ))}
          </div>
        }
      </div>
    </div>
  );
}

export default MessageBubble



// COMPONENTS



// FUNCTIONS

/**
 * A function to check if a message contains only emojis
 * @param text - The contents of the message
 * @returns A boolean determining whether the message contains only emojis
 */
function checkIfOnlyEmoji(text:string): boolean {
  return /^[\p{Extended_Pictographic}]+$/u.test(text)
}

function addOrRemoveReact(message: Message, react: string, currRoomID: string, currUserInfo: UserData | null, remove: boolean = false) {
  if (!currUserInfo) { return }
  if (!message.reacts || !message.reacts[react] || !message.reacts[react].includes(currUserInfo.uid)) {
    addReact(message, react, currRoomID, currUserInfo.uid)
  } else if (remove) {
    console.log("")
  }
}