import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StoreProvider } from './state/store.tsx'
import { captureInstallPrompt, InstallProvider } from './lib/useInstallPrompt.ts'

captureInstallPrompt()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <InstallProvider>
        <App />
      </InstallProvider>
    </StoreProvider>
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js')
  })
}


