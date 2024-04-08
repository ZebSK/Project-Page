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
import { MessageBlock, MessagesContext } from "../types/interfaces";
import { SetStateMsgBlockList } from "../types/aliases";
import { FieldValue } from "firebase/firestore";
import { loadPastMessages, messagesRef, subscribeToMessages } from "../services/db";



// MESSAGE CONTEXT

// Creates and defines the structure of the MessageContext object
const MessageContext = createContext<MessagesContext>({} as MessagesContext);

/**
 * The provider for information about messages throughout the component tree
 * @param children - The child elements wrapped by the provider.
 * @returns The JSX element representing the provider with its children.
 */
export const MessagesProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
  // User information state variables
  const [messageBlocks, setMessageBlocks] = useState<MessageBlock[]>([])

  useEffect(() => { listenToMessages(messageBlocks, setMessageBlocks) }, [] )

  return (
    <MessageContext.Provider value = {{ messageBlocks, setMessageBlocks }}>
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
async function listenToMessages(messageBlocks: MessageBlock[], setMessageBlocks: SetStateMsgBlockList) {
  let startListening: FieldValue | null = null
  if ( messageBlocks.length === 0 ) { // Checks if messages already loaded
    // Load past 25 messages onto screen
    const pastMessages = await loadPastMessages( messagesRef )

    // Add messages in reverse order from least recent to most
    for (let i = pastMessages.length - 1; i >= 0; i--) {
      const data = pastMessages[i].data();
      const textValue = data.text;
      const uid = data.uid;

      addMessageToBlocks(messageBlocks, setMessageBlocks, textValue, uid)

      if ( i === 0 ) { 
        startListening = data.createdAt; // Start listening from time of last message sent
      }
    }
  }
  // Set listener which loads any new messages and adds them to messageBlocks
  const unsubscribe = subscribeToMessages(messagesRef, startListening, messageBlocks, setMessageBlocks, addMessageToBlocks)

  // Cleanup function to remove the event listener when the component unmounts
  return () => {
    unsubscribe()
  }

}

/**
 * Function handling adding of messages to MessageBlocks
 * @param messageBlocks - The current messageBlocks
 * @param setMessageBlocks - The setter to update messageBlocks
 * @param textValue - The new message to be added
 * @param uid - The user id who sent the message
 */
export function addMessageToBlocks(messageBlocks: MessageBlock[], setMessageBlocks: SetStateMsgBlockList, textValue: string, uid: string) {
  if (messageBlocks) { }
  const appendToRecentBlock = (messageBlocks: MessageBlock[], textValue: string) => {
    let finalBlock: MessageBlock = { ...messageBlocks[messageBlocks.length - 1] }
    finalBlock.messageContents = [...messageBlocks[messageBlocks.length - 1].messageContents, textValue]

    return [
      ...messageBlocks.slice(0, -1),  // Keep all items except last the same
      finalBlock
    ]
  }
  const appendNewBlock = (messageBlocks: MessageBlock[], textValue: string, uid: string) => [
    ...messageBlocks,
    {
      uid: uid,
      messageContents: [textValue],
    }
  ]
        
  setMessageBlocks(prevBlocks => {
    if (prevBlocks.length > 0 && prevBlocks[prevBlocks.length - 1].uid === uid) {
      return appendToRecentBlock(prevBlocks, textValue);
    } else {
      return appendNewBlock(prevBlocks, textValue, uid);
    }
  });
}
