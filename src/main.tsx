import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode> // Strict mode runs twice in dev for debugging purposes
    <App />
  // </React.StrictMode>,
)
