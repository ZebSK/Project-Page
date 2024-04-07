/**
 * index.tsx
 * 
 * Entry point for rendering the main React application.
 * This file mounts the <App /> component into the HTML element with the id 'root'
 * and provides context providers to the application.
 */

// External Libraries
import ReactDOM from 'react-dom/client'

// Main App
import App from './App.tsx'

// Contexts
import { UsersProvider } from './contexts/users-context.tsx'

// Styles
import './styles/index.css'



// CONTEXT PROVIDERS

/**
 * A component that wraps the children with all context providers
 * @param children - The child elements
 * @returns The JSX element with context providers wrapping the children.
 */
const ContextProviders = ({ children }: { children: JSX.Element }) => (
  <UsersProvider>
    {children}
  </UsersProvider>
);



// ROOT ELEMENT

/**
 * Mounts the <App /> component into the HTML element with the id 'root'
 * using ReactDOM's Concurrent Mode API.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <ContextProviders>
    <App />
  </ContextProviders>
)

