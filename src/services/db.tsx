// External Libraries
import { setDoc, addDoc, getDocs, QueryDocumentSnapshot } from "firebase/firestore"; 
import { doc, collection, CollectionReference } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { query, orderBy, limit, onSnapshot, Unsubscribe, where, FieldValue } from "firebase/firestore";
import { Dispatch, SetStateAction } from 'react';

// Internal Modules
import { db, auth } from '../services/firebase';
import { MessageBlock } from "../components/message-screen";

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
  const q = query(messagesRef, orderBy("createdAt", "desc"), limit(25));
  const querysnapshot = await getDocs(q);
  const pastMessages = querysnapshot.docs;
  return ( pastMessages );
}

export function subscribeToMessages (messagesRef: CollectionReference, startTime: FieldValue | null, messageBlocks: MessageBlock[], setMessageBlocks: Dispatch<SetStateAction<MessageBlock[]>>,
  addMessageToBlocks: (messageBlocks: MessageBlock[], setMessageBlocks: Dispatch<SetStateAction<MessageBlock[]>>, textValue: string, uid: string, displayName: string) => void) : Unsubscribe {
    const q = startTime? query(messagesRef, where('createdAt', '>', startTime)) : query(messagesRef); 
    return (
      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data()
            addMessageToBlocks(messageBlocks, setMessageBlocks, data.text, data.uid, data.userDisplayName)
            console.log(data)
          }
        });
      })
    );
  };