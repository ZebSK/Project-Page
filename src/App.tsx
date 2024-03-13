// External libraries
import {useAuthState } from 'react-firebase-hooks/auth'
import { useEffect, useState } from 'react';
import { DocumentData } from '@firebase/firestore';

// Internal modules
import MessageScreen from './components/message-screen.tsx'
import SignInScreen from './components/sign-in-screen.tsx';

import { auth } from './services/firebase.tsx';

import { handleSignIn } from './services/db.tsx';


/**
 * Main parent component for the app
 * @returns The App Component
 */
function App(): JSX.Element {
  // useStates for determining state variables
  const [userAuth] = useAuthState(auth); // Check if signed in
  const [userInfo, setUserInfo] = useState<DocumentData>()

  // useEffects that run every time the dependencies change
  useEffect(() => { handleSignIn(setUserInfo) }, [userAuth])  

  return (
    <div className='App'>
      {
        !userAuth ? 
        <SignInScreen/> 
        : 
        <div className='appScreen'>

          <MessageScreen/>
        </div>
      }
    </div>
  );
}

export default App;

