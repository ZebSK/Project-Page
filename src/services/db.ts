/** 
 * @file db.ts
 * 
 * @description
 * This file contains everything that requires accessing Firebase Firestore 
 * 
 * @exports getMessagesRef - Gets the collection reference to the messages in a room from the db
 * @exports sendMessage - Adds a message to the database
 * @exports loadPastMessages - Loads the most recent 25 messages
 * @exports subscribeToMessages - Function adding a listener to the database for new messages in chat
 * 
 * @exports handleSignIn - Add user to database if new, or retrieve current info about user if not
 * @exports updatedUserInfo - Updates user info in database 
 * @exports subscribeToUserInfo - Function adding a listener to the database for changes in user data
 */ 


// External Libraries
import { 
  setDoc, addDoc, // Database write operations
  getDoc, getDocs, updateDoc, serverTimestamp, // Database read operations
  doc, collection, // Document and collection references
  query, orderBy, limit, where, // Query operations
  onSnapshot, Unsubscribe, // Real-time listeners
  FieldValue, CollectionReference, // Firestore types
  documentId
} from "firebase/firestore"; 

// Internal Modules
import { db, auth } from './firebase';
import { createDefaultProfilePic } from "../utils/profile-pictures";
import { getProfilePic, saveProfilePic } from "./storage";

import { Message, MessageGroup, UserData, UserListeners, UserSettings } from "../types/interfaces";
import { DocsSnapshot, SetStateUserDict, SetStateUserDataNull, setStateUserSettings, setStateUserListeners, SetStateMsgRooms } from "../types/aliases";



// MESSAGES

/**
 * Gets the collection reference to the messages in a room from the db
 * @param roomID - The id of the message room
 * @returns The reference to the message room in the database
 */
export function getMessagesRef(roomID: string): CollectionReference {
  return collection(db, "rooms", roomID, "messages")
}

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
export async function loadPastMessages(messagesRef: CollectionReference): DocsSnapshot {
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
export function subscribeToMessages (messagesRef: CollectionReference, startTime: FieldValue | null, messageBlocks: MessageGroup[], setMessageRooms: SetStateMsgRooms, roomID: string,
  addMessageToBlocks: (messageBlocks: MessageGroup[], setMessageRooms: SetStateMsgRooms, message: Message, uid: string, roomID: string) => void) : Unsubscribe {
    // Start listening from set time, or all messages if not set (no previous messages)
    const q = startTime? query(messagesRef, where('createdAt', '>', startTime)) : query(messagesRef); 

    return (
      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          // Listens for new messages sent and adds them to messageBlocks
          if (change.type === "added") {
            const data = change.doc.data()
            const messageID = change.doc.id
            const uid = data.uid
            const message: Message = {
              messageID: messageID,
              content: data.text,
              reacts: data.reacts
            }
            addMessageToBlocks(messageBlocks, setMessageRooms, message, uid, roomID)
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
export async function handleSignIn (setUserInfo: SetStateUserDataNull, setUserSettings: setStateUserSettings, setUserListeners: setStateUserListeners) {
  if (!auth.currentUser) { return; }
  const uid = auth.currentUser.uid;

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  const settingsRef = doc(db, "settings", uid);
  const settingsSnap = await getDoc(settingsRef)
  
  // If user already in database, retrieve user data
  if (userSnap.exists()) {
    let userData = userSnap.data() as UserData;
    let settingsData = settingsSnap.data() as UserSettings;
    let listenersData = settingsSnap.data() as UserListeners;

    // Get profile pic
    if (!userData.profilePic) {
      const defaultProfilePic = createDefaultProfilePic(userData.displayName, userData.colour)
      userData = {...userData, profilePic: defaultProfilePic}
    } else {
      const profilePicURL = await getProfilePic(userData.profilePic)
      userData = {...userData, profilePic: profilePicURL}
    }

    setUserInfo(userData)
    setUserSettings(settingsData)
    setUserListeners(listenersData)

  } else {
    // If user not in database, add to database with default settings
    let displayName = auth.currentUser.displayName

    // Determine user colour
    const letters = "0123456789ABCDEF";
    var colour = "#";
    for (let i = 0; i < 6; i++) { colour += letters[Math.floor(Math.random() * 16)]; }
    const defaultProfilePic = createDefaultProfilePic(displayName, colour)

    // Default settings
    const defaultSettings: UserSettings = {
      darkMode: false
    }

    const defaultListeners: UserListeners = {
      roomIDs: ["main", "second"]
    }

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

    setDoc(doc(db, "settings", uid), {...defaultSettings, ...defaultListeners})

    // Set user info to defaults
    if (!displayName) {displayName = "Anonymous"}
    const userInfo: UserData = {
      uid: uid,
      displayName: displayName,
      defaultProfilePic: true,
      profilePic: defaultProfilePic,
      colour: colour,
      pronouns: null,
      bio: null
    };

    setUserInfo(userInfo);
    setUserSettings(defaultSettings);
    setUserListeners(defaultListeners)
  }
}

/**
 * Updates user info in database 
 * @param newUserInfo - The new information to store in the database
 * @param userInfo - The previous user information
 */
export function updateUserInfo(newUserInfo: UserData, userInfo: UserData | null) {
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
 * Updates user settings in database 
 * @param newUserSettings - The new settings to store in the database
 */
export function updateUserSettings(newUserSettings: UserSettings) {7
  if (!auth.currentUser) { return }
  const uid = auth.currentUser.uid;

  // Updates user settings in db
  updateDoc(doc(db, "settings", uid), {
    darkMode: newUserSettings.darkMode
  })
}

/**
 * Function adding a listener to the database for changes in user data
 * @param currentUserUID - Ther user ID of the user
 * @param setOtherUserInfo - The setter to change stored info of other users
 * @returns Function to add listener and unsubscribe from it
 */
export function subscribeToUserInfo (currentUserUID: string, setOtherUserInfo: SetStateUserDict) : Unsubscribe {
  // Query all users except current one (change to all users friended later)
  const q = query(collection(db, "users"), where(documentId(), "!=", currentUserUID));

  return (
    onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          let userData = change.doc.data() as UserData;

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
