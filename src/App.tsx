import { useState, useRef, useEffect} from 'react';

//  Main parent component
function App() {
  // Define synthesised messages with isYours property !!
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

  return(
  <div className='App'>
    {MessageScreen({messageBlocks})}
  </div>
  );
}
export default App;

// MessageScreen component holding all the messages
interface MessageBlock {
  isYours: boolean;
  messageContents: string[];
}
function MessageScreen({ messageBlocks }: { messageBlocks: MessageBlock[] }) {
  return(
    // Map function to create multiple MessageBlock components and assign messageContents to them
    <div className='messageScreen'>
      {messageBlocks.map((messageBlock, index) => (
        <MessageBlock key={index} isYours={messageBlock.isYours} messageContents={messageBlock.messageContents} />
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
    <div className = {"message" + " " + isYoursIndicator}>
      {messageContent}
    </div>
  )
}

function handleEnter(textValue: string) {
  setMessageBlocks(prevBlocks => [
    ...prevBlocks,
    {
      isYours: true,
      messageContents: [textValue],
    }
  ]);
  console.log('hello')
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
