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

// Internal Interface Types
import { UserInfo, UserDictionary } from "./interfaces"


// useState Setters
export type SetStateBoolean = Dispatch<SetStateAction<boolean>>
export type SetStateUserInfo = Dispatch<SetStateAction<UserInfo>>
export type SetStateUserDict = Dispatch<SetStateAction<UserDictionary>>

// useRef Objects
export type DivRefObject = React.RefObject<HTMLDivElement>

// React Events
export type ReactButtonClick = React.MouseEvent<HTMLButtonElement>