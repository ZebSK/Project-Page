/**
 * @file interfaces.ts
 * 
 * @description
 * This file contains any interfaces used
 * These interfaces define the structure of data within the application
 * 
 * @exports UsersContext - Represents the structure of the useContext for user information
 * @exports MessagesContext - Represents the structure of the useContext for message information
 * 
 * @exports UserData - Represents the structure of information about the user
 * @exports UserDictionary - Represents a dictionary of user's unique identifiers and their corresponding information
 * @exports UserSettings - Represents the structure of information about the user's settings
 * @exports UserListeners - Contains the uids of docs/collections for the user to listen to in the db
 * 
 * @exports MessageRoom - Contains all information about one message room
 * @exports MessageRooms - Contains all message rooms
 * @exports MessageBlock - Represents the structure of information stored about a message
 */

// Internal Modules
import { User } from "firebase/auth";
import { SetStateMsgRooms, SetStateString, SetStateUserDataNull, SetStateUserDict, setStateUserListeners, setStateUserSettings } from "./aliases";
import { CollectionReference } from "firebase/firestore";



// CONTEXTS

/**
 * Interface representing the structure of the useContext for user information
 */
export interface UsersContext {
  userAuth: User | null | undefined;

  currUserInfo: UserData | null;
  setCurrUserInfo: SetStateUserDataNull;

  currUserSettings: UserSettings;
  setCurrUserSettings: setStateUserSettings;

  currUserListeners: UserListeners;
  setCurrUserListeners: setStateUserListeners;

  otherUserInfo: UserDictionary;
  setOtherUserInfo: SetStateUserDict;
}

/**
 * Interface representing the structure of the useContext for message information
 */
export interface MessagesContext {
  messageRooms: MessageRooms;
  setMessageRooms: SetStateMsgRooms;

  currRoomID: string;
  setCurrRoomID: SetStateString;
}



// USERS

/**
 * Interface representing the structure of information about the user
 */
export interface UserData {
  uid: string; // Unique identifier
  displayName: string; 

  defaultProfilePic: boolean; // Indicates whether user is using the default profile picture
  profilePic: string; // The URL for the user's profile picture
  colour: string; // The colour to be used for design elements for that user

  pronouns: string | null;
  bio: string | null;
}
  
/**
 * Interface representing a dictionary of user's unique identifiers and their corresponding information
 */
export interface UserDictionary {
  [uid: string]: UserData;
}

/**
 * Interface representing the structure of information about the user's settings
 */
export interface UserSettings {
  darkMode: boolean;
}

/**
 * Interface containing the uids of docs/collections for the user to listen to in the db
 */
export interface UserListeners {
  roomIDs: string[];
}



// MESSAGES

/**
 * Interface containing all information about one message room
 */
export interface MessageRoom {
  messagesRef: CollectionReference;
  messageBlocks: MessageBlock[];
}

/**
 * Interface containing all message rooms
 */
export interface MessageRooms {
  [roomID: string]: MessageRoom;
}

/**
 * Interface representing the structure of information stored about a group of messages
 */
export interface MessageBlock {
  uid: string;
  messages: Message[]; // Contains a list of strings for each message
}

/**
 * Interface representing the structure of information stored about a message
 */
export interface Message {
  messageID: string;
  content: string;
  reacts: { [emoji: string]: string[] } | undefined; // A dict of users that have reacted each emoji
}