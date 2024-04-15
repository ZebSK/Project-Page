/**
 * @file messages-context.tsx
 * 
 * @description
 * This file contains everything related to the useContext object for messages
 * 
 * @exports MessagesProvider - The provider for information about messages throughout the component tree
 * @exports useMessages - A hook to retrieve the current context value of UsersContext
 */

// External Libraries
import { createContext, useContext, useEffect, useState } from "react";

// Internal Modules
import { Message, MessageGroup, MessageRoom, MessageRooms, MessagesContext } from "../types/interfaces";
import { SetStateMsgRooms } from "../types/aliases";
import { FieldValue } from "firebase/firestore";
import { getMessagesRef, loadPastMessages, subscribeToMessages } from "../services/db";
import { useUsers } from "./users-context";



// MESSAGE CONTEXT

// Creates and defines the structure of the MessageContext object
const MessageContext = createContext<MessagesContext>({} as MessagesContext);

/**
 * The provider for information about messages throughout the component tree
 * @param children - The child elements wrapped by the provider.
 * @returns The JSX element representing the provider with its children.
 */
export const MessagesProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
  // User information state variable
  const [messageRooms, setMessageRooms] = useState<MessageRooms>({})
  const [currRoomID, setCurrRoomID] = useState("main")
  const { userAuth, currUserListeners } = useUsers()

 // Listen to messages hook
  useEffect(() => { 
    if (userAuth) {
      const unsubList: Promise<() => void>[]  = []

      currUserListeners.roomIDs.forEach(function (roomID) {
        const roomInfo: MessageRoom = {messagesRef: getMessagesRef(roomID), messageBlocks: []}
        setMessageRooms(prevRooms => ({...prevRooms, [roomID]: roomInfo}));

        // Handles listenToMessages being async by fetching unsub in an async function
        const listener = async () => { return await listenToMessages(roomID, setMessageRooms, roomInfo); }
        unsubList.push( listener() )
      })

      // Cleanup on userAuth change
      return () => { 
        unsubList.forEach(function (unsub) {
          unsub.then((unsubFunction) => {
            if (typeof unsubFunction === 'function') { unsubFunction(); }
          })
        })
      }
    }
  }, [userAuth, currUserListeners.roomIDs] )

  return (
    <MessageContext.Provider value = {{ messageRooms, setMessageRooms, currRoomID, setCurrRoomID }}>
      { children }
    </MessageContext.Provider>
  )
}

/**
 * A hook to retrieve the current context value of UsersContext
 * @returns The hook to retrieve user information
 */
export const useMessages = () => useContext(MessageContext)



// FUNCTIONS

/**
 * Function which loads the last 25 messages sent and listens for any more sent
 * @param messageBlocks - The messages currently on screen
 * @param setMessageBlocks - The setter to set messageBlocks 
 * @param messageContainerRef - The ref for the message container holding the messages
 */
async function listenToMessages(roomID: string, setMessageRooms: SetStateMsgRooms, roomInfo: MessageRoom) {
  let startListening: FieldValue | null = null
  let messageBlocks = roomInfo.messageBlocks

  if ( messageBlocks.length === 0 ) { // Checks if messages already loaded
    // Load past 25 messages onto screen
    const pastMessages = await loadPastMessages( roomInfo.messagesRef )

    // Add messages in reverse order from least recent to most
    for (let i = pastMessages.length - 1; i >= 0; i--) {
      const data = pastMessages[i].data();
      const messageID = pastMessages[i].id
      const uid = data.uid

      const message: Message = {
        messageID: messageID,
        content: data.text,
        reacts: data.reacts
      }

      addMessageToBlocks(messageBlocks, setMessageRooms, message, uid, roomID)

      if ( i === 0 ) { 
        startListening = data.createdAt; // Start listening from time of last message sent
      }
    }
  }
  // Set listener which loads any new messages and adds them to messageBlocks
  const unsubscribe = subscribeToMessages(roomInfo.messagesRef, startListening, messageBlocks, setMessageRooms, roomID, addMessageToBlocks)
  window.addEventListener('beforeunload', unsubscribe)
  // Cleanup function to remove the event listener when the component unmounts
  return () => {
    unsubscribe()
    window.removeEventListener('beforeunload', unsubscribe)
  }

}

/**
 * Function handling adding of messages to MessageBlocks
 * @param messageBlocks - The current messageBlocks
 * @param setMessageBlocks - The setter to update messageBlocks
 * @param textValue - The new message to be added
 * @param uid - The user id who sent the message
 */
export function addMessageToBlocks(messageBlocks: MessageGroup[], setMessageRooms: SetStateMsgRooms, message: Message, uid: string, roomID: string) {
  if (messageBlocks) { }
  const appendToRecentBlock = (messageBlocks: MessageGroup[], message: Message): MessageGroup[] => {
    let finalBlock: MessageGroup = { ...messageBlocks[messageBlocks.length - 1] }
    finalBlock.messages = [...messageBlocks[messageBlocks.length - 1].messages, message]

    return [
      ...messageBlocks.slice(0, -1),  // Keep all items except last the same
      finalBlock
    ]
  }
  const appendNewBlock = (messageBlocks: MessageGroup[], message: Message, uid: string): MessageGroup[] => [
    ...messageBlocks,
    {
      uid: uid,
      messages: [message],
    }
  ]
        
  setMessageRooms(prevRooms => {
    const prevBlocks = prevRooms[roomID].messageBlocks
    let newBlocks = []
    if (prevBlocks.length > 0 && prevBlocks[prevBlocks.length - 1].uid === uid) {
      newBlocks = appendToRecentBlock(prevBlocks, message);
    } else {
      newBlocks = appendNewBlock(prevBlocks, message, uid);
    }
    return {...prevRooms, [roomID]: {...prevRooms[roomID], messageBlocks: newBlocks}}
  });
}

export function updateMessageInfo(setMessageRooms: SetStateMsgRooms, message: Message, roomID: string) {
  setMessageRooms(prevRooms => {
    const updatedMessageRooms = {...prevRooms}
    const room = updatedMessageRooms[roomID];
    for (const messageBlock of room.messageBlocks) {
      const msg: Message | undefined = messageBlock.messages.find(msg => msg.messageID === message.messageID);
      if (msg) {
        msg.reacts = message.reacts
      }
    } 
    return updatedMessageRooms
  })
}