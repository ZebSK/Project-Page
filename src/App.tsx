import { useState, useRef, useEffect} from 'react';

//  Main parent component
function App() {
    return (
    <div className='App'>
      <MessageScreen/>
    </div>
  );
}

export default App;

// MessageScreen component holding all the messages
interface MessageBlock {
  isYours: boolean;
  messageContents: string[];
}
function MessageScreen() {
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

  const [inputValue, setInputValue] = useState("");
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Handling scrolling when new message is received
  useEffect(() => {
    const { current: container } = messageContainerRef;
    if (container) {

      // Finds the last message bubble if there is one
      const lastMessageBlock = container.lastElementChild as HTMLElement;
      if (lastMessageBlock) {
        const lastMessageBubble = lastMessageBlock.lastElementChild as HTMLElement;
        if (lastMessageBubble) {

          // If last message from user, scroll to bottom
          if (lastMessageBubble.className.split(" ")[1] === "right") {
            container.scrollTop = container.scrollHeight;
          }

          // If the distance from the bottom is the height of the last message, scroll to bottom
          const lastMessageStyles = getComputedStyle(lastMessageBubble);
          const lastMessageHeight = lastMessageBubble.offsetHeight + parseInt(lastMessageStyles.marginBottom); 
          if( container.scrollHeight - container.scrollTop - lastMessageHeight <= container.clientHeight) {
            container.scrollTop = container.scrollHeight;
          }
        }
      }
    }
  }, [messageBlocks]);

  // Handling scrolling when input box expands
  useEffect(() => {
    const inputBoxElements = document.getElementsByClassName("inputBox");
    if (inputBoxElements.length > 0) {
      const inputBoxElement = inputBoxElements[0];
      const { current: container } = messageContainerRef;
      // const styles = window.getComputedStyle(inputBoxElement);
      
      inputBoxElement.addEventListener('input', () => {
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      })
    }
  }, []);

  /**
   * Function to send messages on enter press. 
   * @param {string} textValue - The text to add to message screen.
   */
  function handleEnter(textValue: string) {
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
    setInputValue("");
  }

  return(
    // Map function to create multiple MessageBlock components and assign messageContents to them
    <div className='messageScreen'>
      <div className='messageContainer' ref={messageContainerRef}>
        {messageBlocks.map((messageBlock, index) => (
          <MessageBlock key={index} isYours={messageBlock.isYours} messageContents={messageBlock.messageContents} />
        ))}
      </div>
      <InputBox handleEnter={handleEnter} inputValue={inputValue} setInputValue={setInputValue}/>
    </div>
  )
}

// Message component holding the input box
function InputBox({ handleEnter, inputValue, setInputValue }: {
  handleEnter: (textValue: string) => void, inputValue: string, setInputValue: Function}) {
    // Allows the height of the input box and the values for min height and padding size to be accessed in HTML
    const [height, setHeight] = useState<string>("");
    const [minHeight, setMinHeight] = useState<string>("");
    const [padding, setPadding] = useState<number>(0);

    // Takes the padding and min height values from the CSS file
    useEffect(() => {
      const elements = document.getElementsByClassName("inputBox");
      if (elements.length > 0) {
        const element = elements[0]; // takes the first inputBox as class not id
        const styles = window.getComputedStyle(element); // gets all style info from CSS
        const padding = parseInt(styles.paddingTop) + parseInt(styles.paddingBottom);

        setPadding(padding);
        setMinHeight(styles.minHeight)
        setHeight(styles.minHeight)
      }
    }, []);

  return (
    <div>
      <textarea
        className="inputBox"
        placeholder="..." // text shown in box when empty
        value={ inputValue } 
        style={{ height: height }} 

        // Handles response to any typing in the box
        onChange={(event) => {
          setInputValue(event.currentTarget.value);

          setHeight(minHeight); // sets height to minimum so if text has decreased textarea will not remain at previous size
          event.currentTarget.style.height = minHeight; // forces recalculation of scroll height
          const { scrollHeight } = event.currentTarget;
          setHeight(scrollHeight - padding + 'px' ); // sets height to the size of the text
          event.currentTarget.style.height = scrollHeight - padding + 'px';
        }}

        // Handles sending of messages if enter is pressed without shift being held down
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            handleEnter(event.currentTarget.value);
            event.preventDefault(); // prevents addition of a new line to textarea when sending message
            setHeight(minHeight);
          }
        }}
      />
    </div>
  );
}

// MessageBlock component holding all messages in a block (same owner)
// Need to phrase the 'props' (properties) within curly brackets like this... not sure why, it's a React thing
function MessageBlock({ isYours, messageContents }: { isYours: boolean; messageContents: string[] }) {
  return (
    // Second map function to map each message in the block
    <div className='messageBlock'>
      {messageContents.map((message, index) => (
        <Message key={index} isYours={isYours} messageContent={message} />
      ))}
    </div>
  );
}

// Message component holding each individual message
function Message({ isYours, messageContent }: { isYours: boolean; messageContent: string }) {
  const isYoursIndicator: string = isYours? "right": "left"  // convert isYours boolean to string
  return(
    <div className = {"messageBubble" + " " + isYoursIndicator}>
      {messageContent}
    </div>
  )
}