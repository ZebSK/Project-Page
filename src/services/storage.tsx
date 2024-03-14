// External Libraries
import { ref, uploadString, getDownloadURL } from "firebase/storage";

// Internal Modules
import { storage } from "./firebase";


/** 
 * @file This module contains everything that requires accessing Firebase Storage 
 * @module Storage
 */ 


/**
 * Saves profile picture to database
 * @param uid - The unique id for the user
 * @param profilePicURL - The profile picture stored as a URL
 */
export function saveProfilePic(uid: string, profilePicURL: string) {
  const profilePicRef = ref(storage, "profilePictures/" + uid + ".png");
  uploadString(profilePicRef, profilePicURL, "data_url")
}

/**
 * Gets the profile pic from stoarage
 * @param location - The location of the profile pic in storage
 * @returns The download URL
 */
export async function getProfilePic(location: string): Promise<string> {
  return await getDownloadURL(ref(storage, location));
}