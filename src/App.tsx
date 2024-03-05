// External libraries
import {useAuthState } from 'react-firebase-hooks/auth'

// Internal modules
import MessageScreen from './components/message-screen.tsx'
import SignInScreen from './components/sign-in-screen.tsx';

import { auth } from './services/firebase.tsx';


/**
 * Main parent component for the app
 * @returns The App Component
 */
function App(): JSX.Element {
  // Check if signed in
  const [user] = useAuthState(auth);
    
  return (
    <div className='App'>
      {
        user ? 
        <MessageScreen/> 
        : 
        <SignInScreen/>
      }
    </div>
  );
}

export default App;