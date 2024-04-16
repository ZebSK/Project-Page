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
import { addReact, removeReact } from "../../services/db";
import { DivRefObject } from "../../types/aliases";
import { scrollToBottom } from "../../utils/scrolling";



// PARENT MESSAGE BUBBLE COMPONENT

/**
 * Message component holding each individual message
 * @component
 * @param isYoursIndicator - Determines which side of the screen to display the message
 * @param message - The details of the message
 * @returns The Message component
 */
function MessageBubble({ isYoursIndicator, message, messageContainerRef }: { isYoursIndicator: string; message: Message; messageContainerRef: DivRefObject }): JSX.Element {
  // useStates
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [showReactMenu, setShowReactMenu] = useState<boolean>(false)
  const [reacts, setReacts] = useState<{ [emoji: string]: string[] | undefined }>();
  
  const reactMenuRef = useRef<HTMLDivElement>(null)
  const reactMenuButtonRef = useRef<HTMLButtonElement>(null)
  
  const { currRoomID } = useMessages()
  const { currUserInfo, otherUserInfo } = useUsers()

  useEffect(() => { setReacts(message.reacts); }, [message.reacts]);
  useEffect(() => { scrollOnReact(messageContainerRef, message.reacts) }, [message.reacts])
  useEffect(() => { outsideObjectClick(reactMenuRef, setShowReactMenu, reactMenuButtonRef) }, [])

  return(
    <div className="messageLine" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className={"message" + " " + isYoursIndicator}>
        {/* The Message Bubble */}
        {checkIfOnlyEmoji(message.content)?
          <span className={"messageBubble emojiBubble" + " " + isYoursIndicator}>{message.content}</span>  :
          <span className={"messageBubble" + " " + isYoursIndicator}>{markdownLaTeXToHTML(message.content)}</span>
        }
        {/* Reacts */}
        <div className={"reactsLine" + " " + isYoursIndicator}>
          {reacts && Object.entries(reacts).map(([emoji, userList]) => (
              <button
              key={emoji} 
              className="react"
              title={emoji + " reacted by " + userList?.map(uid => uid === currUserInfo?.uid? currUserInfo.displayName : otherUserInfo[uid]?.displayName).join(', ')}
              onClick={() => addOrRemoveReact(message, emoji, currRoomID, currUserInfo, true)}
              style={{backgroundColor: currUserInfo?.uid && userList?.includes(currUserInfo.uid)? "var(--object-colour-1)": "var(--default-background-colour)"}}
              >
                {emoji} {(userList?.length && userList.length > 1)? userList.length: ""}
              </button>
            ))
          }
        </div>

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

/**
 * A function to add or remove an emoji react on a message
 * @param message - The message to edit
 * @param react - The react to be changed
 * @param currRoomID - The ID of the message room containing the message
 * @param currUserInfo - Information about the current user
 * @param remove - Whether the emoji should be removed if it already exists
 */
function addOrRemoveReact(message: Message, react: string, currRoomID: string, currUserInfo: UserData | null, remove: boolean = false) {
  if (!currUserInfo) { return }
  if (!message.reacts || !message.reacts[react] || !message.reacts[react].includes(currUserInfo.uid)) {
    addReact(message, react, currRoomID, currUserInfo.uid)
  } else if (remove) {
    removeReact(message, react, currRoomID, currUserInfo.uid)
  }
}

function scrollOnReact(messageContainerRef: DivRefObject, reacts: { [emoji: string]: string[] } | undefined ) {
  if (reacts && Object.keys(reacts).length === 1 && Object.values(reacts)[0].length === 1) {
    setTimeout(() => {
      
      console.log("hbfvsj")
      const container = messageContainerRef.current;
      if (!container) { return; }
    
      console.log(container.scrollHeight - container.scrollTop - container.clientHeight)
    
      if( container.scrollHeight - container.scrollTop - 35 <= container.clientHeight) {
        scrollToBottom(messageContainerRef);
      }
    }, 1);
  }
}
  