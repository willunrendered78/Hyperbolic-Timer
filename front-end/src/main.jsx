import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { WorkoutsProvider } from './store/WorkoutsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <WorkoutsProvider>
        <App />
      </WorkoutsProvider>
    </BrowserRouter>
  </StrictMode>,
)
