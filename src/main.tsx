import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Header from './layout/header.tsx'
import Footer from './layout/footer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="appShell">
      <Header/> 
        <App />
      <Footer />
    </div>
  </StrictMode>,
)
