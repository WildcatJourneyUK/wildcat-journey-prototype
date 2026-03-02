import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.tsx'
import Header from './layout/header.tsx'
import Footer from './layout/footer.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <div className="appShell">
        <Header/> 
          <App />
        <Footer />
      </div>
    </BrowserRouter>
  </StrictMode>,
)
