import MessageScreen from './components/message-screen.tsx'


/**
 * Main parent component for the app
 * @returns The App Component
 */
function App(): JSX.Element {
    return (
    <div className='App'>
      <MessageScreen/>
    </div>
  );
}

export default App;