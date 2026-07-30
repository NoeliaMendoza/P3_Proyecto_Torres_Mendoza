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

if (import.meta.env.PROD) {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      window.__espePwaUpdateAvailable = true;
      window.dispatchEvent(new CustomEvent('espe:pwa-update'));
    },
    onOfflineReady() {
      window.dispatchEvent(new CustomEvent('espe:pwa-offline-ready'));
    }
  });
  window.__espePwaUpdate = () => updateSW(true);
} else if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });
  if ('caches' in window) {
    caches.keys().then((keys) => {
      keys
        .filter((key) => key.startsWith('workbox-') || key.startsWith('espe-'))
        .forEach((key) => caches.delete(key));
    });
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
