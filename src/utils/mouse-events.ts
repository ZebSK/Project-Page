/**
 * @file mouse-events.ts
 * 
 * @description
 * Utility functions for handling mouse listener events
 * 
 * @exports outsideObjectClick - Sets up a listener to hide an object if clicking outside of it
 */

import { ButtonRefObject, DivRefObject, SetStateBoolean } from "../types/aliases";


/**
 * Sets up a listener to hide an object if clicking outside of it
 * @param objectRef - Reference to the object
 * @param setObjectOpen - Setter to set whether object is hidden
 * @param buttonRef - Reference to a button that makes object appear
 */
export function outsideObjectClick(objectRef: DivRefObject, setObjectOpen: SetStateBoolean, buttonRef?: ButtonRefObject) {
  /**
   * Function to check if menu is open and close if click event not on menu
   * @param event - Mouse clicking event
   */
  function handleOutsideObjectCLick(event: MouseEvent) {
    if (objectRef.current && !objectRef.current.contains(event.target as Node)) {
      if (!buttonRef || !buttonRef.current || !buttonRef.current.contains(event.target as Node)) {
        setObjectOpen(false);
      }
    }
  }
  // Add event listener
  document.addEventListener("click", handleOutsideObjectCLick);

  // Remove event listener on disconnect
  return () => {
    document.removeEventListener("click", handleOutsideObjectCLick);
  }
}
