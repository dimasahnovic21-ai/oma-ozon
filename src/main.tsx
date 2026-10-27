import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { runLayoutQA } from './qa.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (new URLSearchParams(location.search).get('qa') === '1') {
  setTimeout(runLayoutQA, 1800)
}
