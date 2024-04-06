/**
 * aliases.ts
 * 
 * This file contains any type aliases used.
 * These aliases definine complex or reusable types with a shorter, more descriptive name.
 * 
 * Aliases:
 */ 

// External Module Types
import { Dispatch, SetStateAction } from "react"
import { QueryDocumentSnapshot } from "firebase/firestore"

// Internal Interface Types
import { UserInfo, UserDictionary } from "./interfaces"
import { MessageBlock } from "./interfaces"


// useState Setters
export type SetStateBoolean = Dispatch<SetStateAction<boolean>>

export type SetStateUserInfo = Dispatch<SetStateAction<UserInfo>>
export type SetStateUserInfoNull = Dispatch<SetStateAction<UserInfo | null>>
export type SetStateUserDict = Dispatch<SetStateAction<UserDictionary>>

export type SetStateMsgBlockList = Dispatch<SetStateAction<MessageBlock[]>>

// useRef Objects
export type DivRefObject = React.RefObject<HTMLDivElement>

// Firebase Types
export type DocsSnapshot = Promise<QueryDocumentSnapshot[]>

// React Events
export type ReactButtonClick = React.MouseEvent<HTMLButtonElement>