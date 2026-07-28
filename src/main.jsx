import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@heroui/react/styles'
import './index.css'
import App from './App.jsx'
import { registerSW } from "virtual:pwa-register"

window.__espeDeferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.__espeDeferredPrompt = e;
});

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    window.__espePwaUpdateAvailable = true;
    window.dispatchEvent(new CustomEvent('espe:pwa-update'));
  },
  onOfflineReady() {
    window.dispatchEvent(new CustomEvent('espe:pwa-offline-ready'));
  }
})

window.__espePwaUpdate = () => updateSW(true);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
