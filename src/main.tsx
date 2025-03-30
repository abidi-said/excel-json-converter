import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ExcelProvider } from './context/ExcelProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExcelProvider>
      <App />
    </ExcelProvider>
  </StrictMode>
)
