import { useState, useRef, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'

// Define refs
const messageScreenRef: React.RefObject<HTMLDivElement> = useRef(null);
const messageBlockRef: React.RefObject<HTMLDivElement> = useRef(null);


function App() {
  return(
  <div className='App'>
    {MessageScreen()}
    {InputBox()}
  </div>
  );
}
export default App;

function MessageScreen() {
  return(
    <div ref={messageScreenRef} className = "messageScreen">
      {MessageBlock(true)}
      {MessageBlock(false)}
    </div>
  )
}

function MessageBlock(isYours: boolean) {
  // State for messageBubbles? 
  const [messageBubbles, setMessageBubbles] = useState<React.ReactNode[]>([]);
  const addMessageBubble = (isYours: boolean, message: string) => {
    const newMessageBubble = MessageBubble(isYours, message);
    setMessageBubbles(prevBubbles => [...prevBubbles, newMessageBubble]);
  };

  addMessageBubble(isYours, "Hello, World!");

  return (
    <div ref={messageBlockRef}>
      {messageBubbles}
    </div>
  );
}

function MessageBubble(isYours: boolean, messageContent: string) {
  const isYoursIndicator: string = isYours? "right": "left"

  return (
    <>
      <div className = {"messageBubble" + " " + isYoursIndicator}>
        {messageContent}
      </div>
      <div style={{height: '5px'}}></div>
    </>
  )
}

function handleEnter(textValue: string) {
  if (messageBlockRef.current) {
  }
}

function InputBox() {
  return (
    <div>
      <input
        type="text" 
        className = "inputBox"
        placeholder = "..."
        onKeyDown ={(event) => {
          if (event.key === "Enter") {
            handleEnter(event.currentTarget.value);
          }
        }}
      />
    </div>
  )
}