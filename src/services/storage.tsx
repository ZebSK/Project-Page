// External Libraries
import { ref, uploadString } from "firebase/storage";

// Internal Modules
import { storage } from "./firebase";


/** 
 * @file This module contains everything that requires accessing Firebase Storage 
 * @module Storage
 */ 



export function saveProfilePic(uid: string, profilePicURL: string) {
    const profilePicRef = ref(storage, "profilePictures/" + uid + ".png");
    console.log(profilePicURL)
    uploadString(profilePicRef, profilePicURL, "data_url")
}