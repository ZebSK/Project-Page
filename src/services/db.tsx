// External Libraries
import { 
  setDoc, addDoc, // Database write operations
  getDoc, getDocs, updateDoc, serverTimestamp, // Database read operations
  doc, collection, // Document and collection references
  query, orderBy, limit, where, // Query operations
  onSnapshot, Unsubscribe, // Real-time listeners
  QueryDocumentSnapshot, FieldValue, CollectionReference // Firestore types
} from "firebase/firestore"; 

import { Dispatch, SetStateAction } from 'react';

// Internal Modules
import { db, auth } from './firebase';
import { MessageBlock, UserInfo, UserDictionary } from "../types/interfaces";
import { createDefaultProfilePic } from "../utils/user-profiles";
import { getProfilePic, saveProfilePic } from "./storage";


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
  const { uid } = auth.currentUser
  const time = serverTimestamp()

  // Add doc to database with random message id
  addDoc(messagesRef, {
    text: messageContents,
    createdAt: time,
    uid: uid
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
  addMessageToBlocks: (messageBlocks: MessageBlock[], setMessageBlocks: Dispatch<SetStateAction<MessageBlock[]>>, textValue: string, uid: string) => void) : Unsubscribe {
    // Start listening from set time, or all messages if not set (no previous messages)
    const q = startTime? query(messagesRef, where('createdAt', '>', startTime)) : query(messagesRef); 

    return (
      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          // Listens for new messages sent and adds them to messageBlocks
          if (change.type === "added") {
            const data = change.doc.data()
            addMessageToBlocks(messageBlocks, setMessageBlocks, data.text, data.uid)
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
    if (!userData.profilePic) {
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

    // Save user to database
    setDoc(doc(db, "users", uid), {
      uid: auth.currentUser.uid,
      displayName: displayName,
      defaultProfilePic: true,
      profilePic: null,
      colour: colour,
      pronouns: null,
      bio: null
    });

    // Set user info to defaults
    if (!displayName) {displayName = "Anonymous"}
    const userInfo: UserInfo = {
      uid: uid,
      displayName: displayName,
      defaultProfilePic: true,
      profilePic: defaultProfilePic,
      colour: colour,
      pronouns: null,
      bio: null
      
    };
    setUserInfo(userInfo);
  }
}

/**
 * Updates user info in database 
 * @param newUserInfo - The new information to store in the database
 * @param userInfo - The previous user information
 */
export function updateUserInfo(newUserInfo: UserInfo, userInfo: UserInfo | null) {
  // Sets path to profile pic in storage
  let profilePic: string | null = "profilePictures/" + newUserInfo.uid + ".png"
  if (newUserInfo.defaultProfilePic) { 
    // If no uploaded profile pic, stores null
    profilePic = null
  } else if (newUserInfo.profilePic != userInfo?.profilePic) {
    // Updates/adds profile pic to storage
    saveProfilePic(newUserInfo.uid, newUserInfo.profilePic)
  }

  // Updates user info in db
  updateDoc(doc(db, "users", newUserInfo.uid), {
    displayName: newUserInfo.displayName,
    defaultProfilePic: newUserInfo.defaultProfilePic,
    profilePic: profilePic,
    colour: newUserInfo.colour,
    pronouns: newUserInfo.pronouns,
    bio: newUserInfo.bio
  })
}

/**
 * Function adding a listener to the database for changes in user data
 * @param currentUserUID - Ther user ID of the user
 * @param setOtherUserInfo - The setter to change stored info of other users
 * @returns Function to add listener and unsubscribe from it
 */
export function subscribeToUserInfo (currentUserUID: string, setOtherUserInfo: Dispatch<SetStateAction<UserDictionary>>) : Unsubscribe {
  // Query all users except current one (change to all users friended later)
  const q = query(collection(db, "users"), where("uid", "!=", currentUserUID));

  return (
    onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          let userData = change.doc.data() as UserInfo;

          setOtherUserInfo((prevOtherUserInfo) => {
            // Store previously loaded user info
            const updatedUserInfo = {...prevOtherUserInfo};
            const existingUserData = prevOtherUserInfo[userData.uid]; 
  
            if (existingUserData && existingUserData.profilePic) {
              // Retain the previous profile picture
              userData.profilePic = existingUserData.profilePic;
            } else if (userData.defaultProfilePic) {
              // Generate a default profile picture if needed
              const defaultProfilePic = createDefaultProfilePic(userData.displayName, userData.colour);
              userData.profilePic = defaultProfilePic;
            }
  
            // Update user info
            updatedUserInfo[userData.uid] = userData;
            return updatedUserInfo;
          });
        }
      });
    })
  );
};
