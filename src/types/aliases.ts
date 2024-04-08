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
import { UserData, UserDictionary } from "./interfaces"
import { MessageBlock } from "./interfaces"



// ALIASES

// useState Setters
export type SetStateBoolean = Dispatch<SetStateAction<boolean>>
export type SetStateString = Dispatch<SetStateAction<string>>

export type SetStateUserData = Dispatch<SetStateAction<UserData>>
export type SetStateUserDataNull = Dispatch<SetStateAction<UserData | null>>
export type SetStateUserDict = Dispatch<SetStateAction<UserDictionary>>

export type SetStateMsgBlockList = Dispatch<SetStateAction<MessageBlock[]>>

// useRef Objects
export type DivRefObject = React.RefObject<HTMLDivElement>
export type TextAreaRefObject = React.RefObject<HTMLTextAreaElement>

// Firebase Types
export type DocsSnapshot = Promise<QueryDocumentSnapshot[]>

// React Events
export type ReactButtonClick = React.MouseEvent<HTMLButtonElement>
export type ReactInputChange = React.ChangeEvent<HTMLInputElement>