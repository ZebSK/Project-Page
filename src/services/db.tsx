// External Libraries
import { 
  setDoc, addDoc, // Database write operations
  getDoc, getDocs, serverTimestamp, // Database read operations
  doc, collection, // Document and collection references
  query, orderBy, limit, where, // Query operations
  onSnapshot, Unsubscribe, // Real-time listeners
  QueryDocumentSnapshot, FieldValue, CollectionReference // Firestore types
} from "firebase/firestore"; 

import { Dispatch, SetStateAction } from 'react';

// Internal Modules
import { db, auth } from '../services/firebase';
import { MessageBlock } from "../components/message-screen";
import { createDefaultProfilePic } from "../utils/user-profiles";
import { getProfilePic } from "./storage";
import { UserInfo } from "../App";

/** 
 * @file This module contains everything that requires accessing Firebase Firestore 
 * @module DB
 */ 

// Temp code until rooms set up
export const roomRef = doc(db, 'rooms', 'main');
setDoc(roomRef, { name: "main" }, { merge: true });
export const messagesRef = collection(db, "rooms", "main", "messages")
export const usersRef = collection(db, "rooms", "main", "users")



// MESSAGES

/**
 * Adds a message to the database
 * @param messagesRef - The ref to the messages collection for the chat the message is being sent to
 * @param messageContents - The contents of the message
 */
export function sendMessage(messagesRef: CollectionReference, messageContents: string) {
  // Check if logged in
  if (!auth.currentUser) { return; }

  // Get additional message information
  const { uid, displayName } = auth.currentUser
  const time = serverTimestamp()

  // Add doc to database with random message id
  addDoc(messagesRef, {
    text: messageContents,
    createdAt: time,
    uid: uid,
    userDisplayName: displayName
  });
}

/**
 * Loads the most recent 25 messages
 * @param messagesRef - The ref to the message chat to load messages from
 * @returns The docs for the past 25 messages
 */
export async function loadPastMessages(messagesRef: CollectionReference): Promise<QueryDocumentSnapshot[]> {
  const q = query(messagesRef, orderBy("createdAt", "desc"), limit(25));
  const querysnapshot = await getDocs(q);
  const pastMessages = querysnapshot.docs;
  return ( pastMessages );
}

/**
 * Function adding a listener to the database for new messages in chat
 * @param messagesRef - The ref to the message chat to listen to
 * @param startTime - The server time to start listening to messages (to prevent loading past messages)
 * @param messageBlocks - The current messages on screen
 * @param setMessageBlocks - The setter for messageBlocks
 * @param addMessageToBlocks - Function adding new message to blocks
 * @returns Function to add listener and unsubscribe from it
 */
export function subscribeToMessages (messagesRef: CollectionReference, startTime: FieldValue | null, messageBlocks: MessageBlock[], setMessageBlocks: Dispatch<SetStateAction<MessageBlock[]>>,
  addMessageToBlocks: (messageBlocks: MessageBlock[], setMessageBlocks: Dispatch<SetStateAction<MessageBlock[]>>, textValue: string, uid: string, displayName: string) => void) : Unsubscribe {
    // Start listening from set time, or all messages if not set (no previous messages)
    const q = startTime? query(messagesRef, where('createdAt', '>', startTime)) : query(messagesRef); 

    return (
      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          // Listens for new messages sent and adds them to messageBlocks
          if (change.type === "added") {
            const data = change.doc.data()
            addMessageToBlocks(messageBlocks, setMessageBlocks, data.text, data.uid, data.userDisplayName)
          }
        });
      })
    );
  };




// USERS

/**
 * Add user to database if new, or retrieve current info about user if not
 * @param setUserInfo - The setter for info about the user
 */
export async function handleSignIn (setUserInfo: Dispatch<SetStateAction<UserInfo | null>>) {
  if (!auth.currentUser) { return; }
  const uid = auth.currentUser.uid;

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  
  // If user already in database, retrieve user data
  if (userSnap.exists()) {
    let userData = userSnap.data() as UserInfo;

    // Get profile pic
    if (userData.profilePic === "default") {
      const defaultProfilePic = createDefaultProfilePic(userData.displayName, userData.colour)
      userData = {...userData, profilePic: defaultProfilePic}
    } else {
      const profilePicURL = await getProfilePic(userData.profilePic)
      userData = {...userData, profilePic: profilePicURL}
    }
    setUserInfo(userData)
  } else {
    // If user not in database, add to database with default settings
    let displayName = auth.currentUser.displayName

    // Determine user colour
    const letters = "0123456789ABCDEF";
    var colour = "#";
    for (let i = 0; i < 6; i++) { colour += letters[Math.floor(Math.random() * 16)]; }
    const defaultProfilePic = createDefaultProfilePic(displayName, colour)

    setDoc(doc(db, "users", uid), {
      uid: auth.currentUser.uid,
      displayName: displayName,
      profilePic: "default",
      colour: colour
    });

    // Set user info to defaults
    if (!displayName) {displayName = "Anonymous"}
    const userInfo: UserInfo = {
      uid: uid,
      displayName: displayName,
      profilePic: defaultProfilePic,
      colour: colour,
      pronouns: null,
      bio: null
    };
    setUserInfo(userInfo);
  }
}