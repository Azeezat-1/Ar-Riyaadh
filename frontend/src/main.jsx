import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import './components/blocks.css'
import './components/Header.css'
import './components/Footer.css'
import './components/Hero.css'
import './components/Timeline.css'
import './components/ContactForm.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)