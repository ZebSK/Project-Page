// External libraries
import { useState, useRef, useEffect } from 'react';
import { Dispatch, SetStateAction } from 'react';

// Internal modules and styles
import { scrollToBottom } from '../utils/scrolling';
import '../styles/message-screen.css';

/** 
 * @file This module contains everything located on the central message screen of the app
 * @module MessageScreen
 */ 



// INTERFACE DEFINITIONS

/**
 * MessageBlock interface describing the structure of a Message Block
 */
interface MessageBlock {
    isYours: boolean;
    messageContents: string[]; // Contains a list of strings for each message
  }
  


// REACT COMPONENTS

/**
 * The parent component holding the entire message screen
 * @component
 * @returns The MessageScreen component
 */
function MessageScreen(): JSX.Element {
    // useRefs for reference objects that persist across re-renders
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const inputBoxRef = useRef<HTMLTextAreaElement>(null);

    // useStates for determining state variables
    const [messageBlocks, setMessageBlocks] = useState<MessageBlock[]>([
        {
          isYours: true,
          messageContents: ["Hello"],
        },
        {
          isYours: false,
          messageContents: ["How's it going?", "Bozo..."],
        },
        {
          isYours: true,
          messageContents: ["I hate you>:("],
        },
      ]);
    const [inputBoxValue, setInputBoxValue] = useState("");
    const [scrollButtonVisible, setScrollButtonVisible] = useState(false);
    const [scrollButtonHeight, setScrollButtonHeight] = useState("0px");

    // useEffects that run every time the dependencies change
    useEffect(() => { showScrollButton(messageContainerRef, setScrollButtonVisible) }, []);
    useEffect(() => { scrollOnNewMessage(messageContainerRef) }, [messageBlocks]);
    useEffect(() => { handleInputBoxExpand(messageContainerRef, inputBoxRef, setScrollButtonHeight) }, []);
    useEffect(() => { determineScrollButtonHeight(inputBoxRef, setScrollButtonHeight) }, []);

    // The JSX Element
    return (
        // Map function to create multiple MessageBlock components and assign messageContents to them
        <div className='messageScreen'>
            <div className='messageContainer' ref={messageContainerRef}>
                {messageBlocks.map((messageBlock, index) => (
                    <MessageBlock key={index} isYours={messageBlock.isYours} messageContents={messageBlock.messageContents} />
                ))}
            </div>
        {scrollButtonVisible && 
        <button 
            className = "scrollButton"
            onClick={() => scrollToBottom(messageContainerRef, true)}
            style = {{bottom: scrollButtonHeight}} 
            > ▼ </button>}
        <InputBox inputBoxValue={inputBoxValue} setInputBoxValue={setInputBoxValue} inputBoxRef={inputBoxRef}
        messageBlocks={messageBlocks} setMessageBlocks={setMessageBlocks}/>
        </div>
    )
}

export default MessageScreen

/**
 * InputBox component to enter and send messages
 * @param handleEnter - A function determining what happens when you press enter
 * @param inputBoxValue - The value of the text currently inside the input box
 * @param setInputBoxValue - The setter for the input box value
 * @returns The InputBox component
 */
function InputBox({ inputBoxValue, setInputBoxValue, inputBoxRef, messageBlocks, setMessageBlocks } : {
    inputBoxValue: string; setInputBoxValue: Dispatch<SetStateAction<string>>; inputBoxRef: React.RefObject<HTMLTextAreaElement>;
    messageBlocks: MessageBlock[]; setMessageBlocks: Dispatch<SetStateAction<MessageBlock[]>> }): JSX.Element {
        // Allows adjustment of height to fit around the text entered
        const [inputBoxHeight, setInputBoxHeight] = useState<string> ("");
        useEffect(() => {
            fitInputBoxToText(inputBoxRef, setInputBoxHeight);
          }, [inputBoxValue]);
        
        return (
            <div>
            <textarea
                className="inputBox"
                placeholder="..." // text shown in box when empty
                value={ inputBoxValue }
                style={{ height: inputBoxHeight }}
                ref = {inputBoxRef}

                // Handles response to any typing in the box
                onChange={(event) => { setInputBoxValue(event.currentTarget.value); }}

                // Handles sending of messages if enter is pressed without shift being held down
                onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                    handleEnter(messageBlocks, setMessageBlocks, event.currentTarget.value, setInputBoxValue)
                    event.preventDefault(); // prevents addition of a new line to textarea when sending message
                    }
                }}
                ></textarea>
            </div>
        );
    }

/**
 * MessageBlock component holding all messages in a block (same owner)
 * @param isYours - Indicates whether the message block belongs to the current user
 * @param messageContents - An array containing the contents of the messages
 * @returns The MessageBlock component
 */
function MessageBlock({ isYours, messageContents }: { isYours: boolean; messageContents: string[] }): JSX.Element {
    return (
        // Second map function to map each message in the block
        <div className='messageBlock'>
            {messageContents.map((message, index) => (
            <Message key={index} isYours={isYours} messageContent={message} />
            ))}
        </div>
    );
}

/**
 * Message component holding each individual message
 * @param isYours - Indicates whether the message block belongs to the current user
 * @param messageContent - The content of the message
 * @returns The Message component
 */
function Message({ isYours, messageContent }: { isYours: boolean; messageContent: string }): JSX.Element {
    const isYoursIndicator: string = isYours? "right": "left"  // convert isYours boolean to string
    return(
        <div className = {"messageBubble" + " " + isYoursIndicator}>
            {messageContent}
        </div>
    );
}



// FUNCTIONS

/**
 * Function for the useEffect determining whether the scroll button is visible
 * @param messageContainerRef The messageContainer component
 * @param setScrollButtonVisible The setter for the scroll button visibility
 */
function showScrollButton (messageContainerRef: React.RefObject<HTMLDivElement>, setScrollButtonVisible: Dispatch<SetStateAction<boolean>>) {
    const container = messageContainerRef.current;
    if (!container) { return; }

    /**
     * Determines whether the scroll button is visible every time the user scrolls 
     */
    function handleScrollEvent () {
        const container = messageContainerRef.current;
        if (!container) { return; }
        const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
        setScrollButtonVisible(!isAtBottom); // Show button if not at bottom
    }   
    
    // Adds an event listener to call handleScrollEvent every time the user scrolls
    container.addEventListener('scroll', handleScrollEvent);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
        if (container) {
          container.removeEventListener('scroll', handleScrollEvent);
        }
      };
}

/**
 * Function for the useEffect determining whether to scroll down on receiving a new message
 * @param messageContainerRef The messageContainer component
 */
function scrollOnNewMessage (messageContainerRef: React.RefObject<HTMLDivElement>) {
    const container = messageContainerRef.current;
    if (!container) { return; }

    // Finds the last message bubble if there is one
    const lastMessageBlock = container.lastElementChild as HTMLElement;
    if (lastMessageBlock) {
    const lastMessageBubble = lastMessageBlock.lastElementChild as HTMLElement;
        if (lastMessageBubble) {

            // If last message from user, scroll to bottom
            if (lastMessageBubble.className.split(" ")[1] === "right") {
            scrollToBottom(messageContainerRef);
            }

            // If the distance from the bottom is the height of the last message, scroll to bottom
            const lastMessageStyles = getComputedStyle(lastMessageBubble);
            const lastMessageHeight = lastMessageBubble.offsetHeight + parseInt(lastMessageStyles.marginBottom); 
            if( container.scrollHeight - container.scrollTop - lastMessageHeight <= container.clientHeight) {
            scrollToBottom(messageContainerRef);
            }
        }
    }
}

/**
 * Function for the useEffect scrolling down when the input box expands and setting the scroll button height
 * @param messageContainerRef - The messageContainer component 
 * @param inputBoxRef - The inputBox component
 * @param setScrollButtonHeight - The setter to determine the height of the scroll button
 * @returns 
 */
function handleInputBoxExpand (messageContainerRef: React.RefObject<HTMLDivElement>, inputBoxRef: React.RefObject<HTMLTextAreaElement>,
    setScrollButtonHeight: Dispatch<SetStateAction<string>>) {
        const container = messageContainerRef.current;
        const inputBoxElement = inputBoxRef.current;
        if (!container || !inputBoxElement) { return; }

        // Gets input box font size and bottom margin of message bubbles
        const inputBoxStyles = getComputedStyle(inputBoxElement);
        const fontSize = parseInt(inputBoxStyles.fontSize);
        let marginHeight = 0;
        const bubbleElement = document.querySelector('.messageBubble');
        if (bubbleElement) {
          const bubbleStyles = getComputedStyle(bubbleElement);
          marginHeight = parseInt(bubbleStyles.marginBottom);
        }

        /**
         * Determines whether the messages scroll or scroll button moves when text is entered into the input box
         */
        function inputBoxExpand () {
            setTimeout(() => { // timeout of 10ms so event listener for input box to expand happens first
                // If distance to bottom <= font size, scroll to bottom
                if (container && (container.scrollHeight - container.scrollTop - fontSize - marginHeight <= container.clientHeight)) {
                    scrollToBottom(messageContainerRef);
                }

                // Sets the scroll button height depending on size of input box
                determineScrollButtonHeight(inputBoxRef, setScrollButtonHeight)    
            }, 10);
        }

        // Event listener for every time input box value changes
        inputBoxElement.addEventListener('input', inputBoxExpand)
        
        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            if (container) {
            inputBoxElement.removeEventListener('input', inputBoxExpand);
            }
        };
    }

/**
 * Function determining height of scroll button from size of input box
 * @param inputBoxRef - The inputBox component
 * @param setScrollButtonHeight - The setter to determine the height of the scroll button
 */
function determineScrollButtonHeight(inputBoxRef: React.RefObject<HTMLTextAreaElement>, setScrollButtonHeight: Dispatch<SetStateAction<string>>) {
    const inputBoxElement = inputBoxRef.current;
    if (!inputBoxElement) { return "0px"; } 
    const inputBoxStyles = getComputedStyle(inputBoxElement);
    const { height, marginTop, marginBottom, paddingTop, paddingBottom, borderWidth } = inputBoxStyles;
    const buttonHeight = (
        parseInt(height) + // input box height
        parseInt(marginTop) + parseInt(marginBottom) + // margins
        parseInt(paddingTop) + parseInt(paddingBottom) + // padding
        2 * parseInt(borderWidth) + 5 // border and additional space
    );
    setScrollButtonHeight(buttonHeight + "px");
}

/**
 * Function handling result of pressing enter in input box
 * @param messageBlocks - The current messageBlocks
 * @param setMessageBlocks - The setter to update messageBlocks
 * @param textValue - The new message to be added
 */
function handleEnter(messageBlocks: MessageBlock[], setMessageBlocks: Dispatch<SetStateAction<MessageBlock[]>>, textValue: string,
    setInputBoxValue: Dispatch<SetStateAction<string>>) {
        if (messageBlocks) {}
        const appendToRecentBlock = (messageBlocks: MessageBlock[], textValue: string) => {
            let finalBlock: MessageBlock = { ...messageBlocks[messageBlocks.length - 1] }
            finalBlock.messageContents = [...messageBlocks[messageBlocks.length - 1].messageContents, textValue]

            return [
                ...messageBlocks.slice(0, -1),  // Keep all items except last the same
                finalBlock
            ]
        }
        const appendNewBlock = (messageBlocks: MessageBlock[], textValue: string) => [
            ...messageBlocks,
            {
                isYours: true,
                messageContents: [textValue],
            }
        ]
            
        setMessageBlocks(prevBlocks => {
            if (prevBlocks.length > 0 && prevBlocks[prevBlocks.length - 1].isYours) {
                return appendToRecentBlock(prevBlocks, textValue);
            } else {
                return appendNewBlock(prevBlocks, textValue);
            }
        });
        setInputBoxValue("");
    }

/**
 * Function determining the height of input box to fit around the text entered
 * @param inputBoxRef - The inputBox component
 * @param setInputBoxHeight - The setter to determine the height of the input box
 */
function fitInputBoxToText(inputBoxRef: React.RefObject<HTMLTextAreaElement>, setInputBoxHeight: Dispatch<SetStateAction<string>>) {
    const inputBoxElement = inputBoxRef.current
    if (!inputBoxElement) { return; }

    const inputBoxStyles = getComputedStyle(inputBoxElement)
    const padding = parseInt(inputBoxStyles.paddingTop) + parseInt(inputBoxStyles.paddingBottom);
    const minHeight = inputBoxStyles.minHeight

    setInputBoxHeight(minHeight); // sets height to minimum so if text has decreased textarea will not remain at previous size
    inputBoxElement.style.height = minHeight; // forces recalculation of scroll height
    setInputBoxHeight(inputBoxElement.scrollHeight - padding + 'px' ); // sets height to the size of the text
}