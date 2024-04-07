/**
 * users-context.tsx
 * 
 * This file contains everything related to the useContext object for user information
 * This includes the current authentication state, user information, and the listeners to update these
 * 
 * Exports:
 * - UsersProvider:   The provider for information about users throughout the component tree
 * - useUsers:        A hook to retrieve the current context value of UsersContext
 */

// External Libraries
import { createContext, useContext, useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";

// Internal Modules
import { handleSignIn, subscribeToUserInfo } from "../services/db";
import { auth } from "../services/firebase";

import { UserData, UserDictionary, UsersContext } from "../types/interfaces";
import { SetStateUserDict } from "../types/aliases";



// USER CONTEXT

// Creates and defines the structure of the UsersContext object
const UserContext = createContext<UsersContext>({} as UsersContext);

/**
 * The provider for information about users throughout the component tree
 * @param children - The child elements wrapped by the provider.
 * @returns The JSX element representing the provider with its children.
 */
export const UsersProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
  // User information state variables
  const [userAuth] = useAuthState(auth); // Check if signed in
  const [currUserInfo, setCurrUserInfo] = useState<UserData | null>(null)
  const [otherUserInfo, setOtherUserInfo] = useState<UserDictionary>({})

  // useEffects that run on login/logout
  useEffect(() => { handleSignIn(setCurrUserInfo) }, [userAuth])
  useEffect(() => { listenToUserInfo(userAuth, setOtherUserInfo) }, [userAuth])

  return (
    <UserContext.Provider value = {{ userAuth, currUserInfo, setCurrUserInfo, otherUserInfo, setOtherUserInfo }}>
      { children }
    </UserContext.Provider>
  )
}

/**
 * A hook to retrieve the current context value of UsersContext
 * @returns The hook to retrieve user information
 */
export const useUsers = () => useContext(UserContext)




// FUNCTIONS

/**
 * Listener to record any updates to user info
 * @param userAuth - The authentication of the current user
 * @param setOtherUserInfo - The setter to update information about other users
 * @returns 
 */
function listenToUserInfo(userAuth: User | null | undefined, setOtherUserInfo: SetStateUserDict): () => void {
  if (userAuth) {
    // Add event listener on new user
    const unsubscribe = subscribeToUserInfo(userAuth.uid, setOtherUserInfo)

    // Remove event listener on changing user/disconnect
    return () => { unsubscribe() }
  }
  return () => { return }
}
