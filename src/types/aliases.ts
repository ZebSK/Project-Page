/**
 * @file aliases.ts
 * 
 * @description
 * This file contains any type aliases used.
 * These aliases definine complex or reusable types with a shorter, more descriptive name.
 */ 

// External Module Types
import { Dispatch, SetStateAction } from "react"
import { QueryDocumentSnapshot } from "firebase/firestore"

// Internal Interface Types
import { MessageRooms, UserData, UserDictionary, UserListeners, UserSettings } from "./interfaces"
import { MessageGroup } from "./interfaces"



// ALIASES

// useState Setters
export type SetStateBoolean = Dispatch<SetStateAction<boolean>>
export type SetStateString = Dispatch<SetStateAction<string>>

export type SetStateUserData = Dispatch<SetStateAction<UserData>>
export type SetStateUserDataNull = Dispatch<SetStateAction<UserData | null>>
export type SetStateUserDict = Dispatch<SetStateAction<UserDictionary>>
export type setStateUserSettings = Dispatch<SetStateAction<UserSettings>>
export type setStateUserListeners = Dispatch<SetStateAction<UserListeners>>

export type SetStateMsgBlockList = Dispatch<SetStateAction<MessageGroup[]>>
export type SetStateMsgRooms = Dispatch<SetStateAction<MessageRooms>>

// useRef Objects
export type DivRefObject = React.RefObject<HTMLDivElement>
export type TextAreaRefObject = React.RefObject<HTMLTextAreaElement>
export type ButtonRefObject = React.RefObject<HTMLButtonElement>

// Firebase Types
export type DocsSnapshot = Promise<QueryDocumentSnapshot[]>

// React Events
export type ReactButtonClick = React.MouseEvent<HTMLButtonElement>
export type ReactInputChange = React.ChangeEvent<HTMLInputElement>