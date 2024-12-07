  // Author(s): Geromy Cunningham
  // Purpose: This file is the main entry point for the application. It is the first file that is run when the application is started.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
