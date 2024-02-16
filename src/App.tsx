import { useState, useRef, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

// Define synthesised messages with isYours property !!
const messageBlocks = [
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
];

//  Main parent component
function App() {
  return(
  <div className='App'>
    {MessageScreen()}
    {InputBox()}
  </div>
  );
}
export default App;

// MessageScreen component holding all the messages
function MessageScreen() {
  return(
    // Map function to create multiple MessageBlock components and assign messageContents to them
    <div className='messageScreen'>
      {messageBlocks.map((messageBlock) => (
        <MessageBlock isYours={messageBlock.isYours} messageContents={messageBlock.messageContents} />
      ))}
    </div>
  )
}

// MessageBlock component holding all messages in a block (same owner)
// Need to phrase the 'props' (properties) within curly brackets like this... not sure why, it's a React thing
function MessageBlock({ isYours, messageContents }: { isYours: boolean; messageContents: string[] }) {
  return (
    // Second map function to map each message in the block
    <div className='messageBlock'>
      {messageContents.map((message) => (
        <Message isYours={isYours} messageContent={message} />
      ))}
    </div>
  );
}

// Message component holding each individual message
function Message({ isYours, messageContent }: { isYours: boolean; messageContent: string }) {
  const isYoursIndicator: string = isYours? "right": "left"  // convert isYours boolean to string
  return(
    <div className = {"message" + " " + isYoursIndicator}>
      {messageContent}
    </div>
  )
}
