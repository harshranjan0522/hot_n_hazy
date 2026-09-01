import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'
import './styles/hero.css'
import './styles/sections.css'
import './styles/dish.css'
import './styles/cursor.css'
// Must stay last — see the header in touch.css.
import './styles/touch.css'

const container = document.getElementById('root')
if (!container) throw new Error('Missing #root element in index.html')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
