// External Libraries
import { setDoc, addDoc, getDocs, QueryDocumentSnapshot } from "firebase/firestore"; 
import { doc, collection, CollectionReference } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { query, orderBy, limit } from "firebase/firestore";

// Internal Modules
import { db, auth } from '../services/firebase';

/** 
 * @file This module contains everything that requires accessing Firebase Firestore 
 * @module DB
 */ 

// Temp code until rooms set up
export const roomRef = doc(db, 'rooms', 'main');
setDoc(roomRef, { name: "main" }, { merge: true });
export const messagesRef = collection(db, "rooms", "main", "messages")
export const usersRef = collection(db, "rooms", "main", "users")

export function sendMessage(messagesRef: CollectionReference, messageContents: string) {
  if (!auth.currentUser) { return; }
  const { uid, displayName } = auth.currentUser
  const time = serverTimestamp()

  addDoc(messagesRef, {
    text: messageContents,
    createdAt: time,
    uid: uid,
    userDisplayName: displayName
  });
}

export async function loadPastMessages(messagesRef: CollectionReference): Promise<QueryDocumentSnapshot[]> {
  console.log("double calling")
  const q = query(messagesRef, orderBy("createdAt"), limit(25));
  const querysnapshot = await getDocs(q);
  const pastMessages = querysnapshot.docs;
  return ( pastMessages );
}