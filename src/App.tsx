import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Define synthesised messages with isYours property !!
const messages = [
  { messageContent: "Hello", isYours: true },
  { messageContent: "Hi there!", isYours: false },
  { messageContent: "How are you?", isYours: true },
];

//  Main parent component
function App() {
  return(
  <div className='App'>
    {MessageScreen()}
  </div>
  );
}
export default App;

// MessageScreen component holding all the messages
function MessageScreen() {
  return(
    <div className='messageScreen'>
      {messages.map((message) => (
        <Message isYours={message.isYours} messageContent={message.messageContent} />
      ))}
    </div>
  )
}

function Message({ isYours, messageContent }: { isYours: boolean; messageContent: string }) {
  const isYoursIndicator: string = isYours? "right": "left"

  return(
    <div className = {"message " + isYoursIndicator}>
      {Bubble(messageContent)}
    </div>
  )
}

function MessageBlock(isYours: boolean, messageContents: string[]) {
  return Message(isYours, "hi")
}

function Bubble(messageContent: string) {
  return (
    <div className = "message-bubble">
      {messageContent}
    </div>
  )
}