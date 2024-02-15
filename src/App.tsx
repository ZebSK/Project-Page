import React from 'react';
import './App.css';

function App() {
  return(
  <div className='App'>
    Hello World
    {MessageScreen()}
  </div>
  );
}
export default App;

function MessageScreen() {
  return(
    <>
      {MessageBlock(true)}
      {MessageBlock(false)}
    </>
  )
}

function MessageBlock(isYours: boolean) {
  return Message(isYours, "hi")
}

function Message(isYours: boolean, messageContent: string) {
  const isYoursIndicator: string = isYours? "right": "left"

  return(
    <div className = {"message " + isYoursIndicator}>
      {Bubble(messageContent)}
    </div>
  )
}

function Bubble(messageContent: string) {
  return (
    <div className = "message-bubble">
      {messageContent}
    </div>
  )
}