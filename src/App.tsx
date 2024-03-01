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

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messageBlocks]);

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

function InputBox({ handleEnter, inputValue, setInputValue }: {
  handleEnter: (textValue: string) => void, inputValue: string, setInputValue: Function}) {
    const [height, setHeight] = useState<string>("");
    const [padding, setPadding] = useState<number>(0);

    useEffect(() => {
      const elements = document.getElementsByClassName("inputBox");
      if (elements.length > 0) {
        const element = elements[0];
        const styles = window.getComputedStyle(element);
        const padding = parseInt(styles.paddingTop) + parseInt(styles.paddingBottom);
        setPadding(padding);

        setHeight(styles.minHeight)
      }
    }, []);

  return (
    <div>
      <textarea
        className="inputBox"
        placeholder="..."
        value={inputValue}
        style={{ height: height }} 

        onChange={(event) => {
          setInputValue(event.currentTarget.value);
          const { scrollHeight } = event.currentTarget;
          if (scrollHeight > parseInt(height) + padding) {
            setHeight(scrollHeight - padding + 'px' )
          } else {
            setHeight("30px")
            event.currentTarget.style.height = "30px";
            const { scrollHeight } = event.currentTarget;
            setHeight(scrollHeight - padding + 'px' )
            event.currentTarget.style.height = scrollHeight - padding + 'px'
          };
        }}

        onKeyDown={(event) => {
          if (event.key === "Enter" && event.shiftKey) { 
            setInputValue(event.currentTarget.value + "\n");
          } else if (event.key === "Enter" && !event.shiftKey) {
            handleEnter(event.currentTarget.value);
            event.preventDefault();
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