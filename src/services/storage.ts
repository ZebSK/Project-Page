/** 
 * @file storage.ts
 * 
 * @description
 * This module contains everything that requires accessing Firebase Storage
 * 
 * @exports saveProfilePic - Saves profile picture to storage
 * @exports getProfilePic - Gets the profile pic from storage
 */ 

// External Libraries
import { ref, uploadString, getDownloadURL } from "firebase/storage";

// Internal Modules
import { storage } from "./firebase";



/**
 * Saves profile picture to storage
 * @param uid - The unique id for the user
 * @param profilePicURL - The profile picture stored as a URL
 */
export function saveProfilePic(uid: string, profilePicURL: string) {
  const profilePicRef = ref(storage, "profilePictures/" + uid + ".png");
  uploadString(profilePicRef, profilePicURL, "data_url")
}

/**
 * Gets the profile pic from storage
 * @param location - The location of the profile pic in storage
 * @returns The download URL
 */
export async function getProfilePic(location: string): Promise<string> {
  return await getDownloadURL(ref(storage, location));
}