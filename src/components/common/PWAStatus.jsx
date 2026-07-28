import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { processOfflineQueue } from '../../services/offlineQueue';

const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  if (!deferredPrompt) return null;

  return (
    <button type="button" onClick={handleInstall} className="pwa-install-btn">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </button>
  );
};

export const PWAStatus = () => {
  const [offline, setOffline] = useState(() => !navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(
    () => Boolean(window.__espePwaUpdateAvailable)
  );
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setOffline(false);
      processOfflineQueue();
    };
    const handleOffline = () => setOffline(true);
    const handleUpdate = () => setUpdateAvailable(true);
    const handleOfflineReady = () => {
      setOfflineReady(true);
      window.setTimeout(() => setOfflineReady(false), 5000);
    };
    const handleSyncComplete = (event) =>
      toast.success(`${event.detail.processed} acción(es) offline sincronizadas.`);
    const handleSyncRejected = () =>
      toast.error('Una acción offline fue rechazada por el servidor.');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('espe:pwa-update', handleUpdate);
    window.addEventListener('espe:pwa-offline-ready', handleOfflineReady);
    window.addEventListener('espe:sync-complete', handleSyncComplete);
    window.addEventListener('espe:sync-rejected', handleSyncRejected);
    if (navigator.onLine) processOfflineQueue();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('espe:pwa-update', handleUpdate);
      window.removeEventListener('espe:pwa-offline-ready', handleOfflineReady);
      window.removeEventListener('espe:sync-complete', handleSyncComplete);
      window.removeEventListener('espe:sync-rejected', handleSyncRejected);
    };
  }, []);

  if (!offline && !updateAvailable && !offlineReady) return <PWAInstallButton />;

  return (
    <aside className="pwa-status" aria-live="polite">
      <PWAInstallButton />

      {offline && (
        <div className="pwa-status__message">
          Estás sin conexión. Puedes consultar la información guardada.
        </div>
      )}

      {offlineReady && !offline && (
        <div className="pwa-status__message pwa-status__message--success">
          ESPEConnect ya está disponible sin conexión.
        </div>
      )}

      {updateAvailable && (
        <div className="pwa-status__message pwa-status__message--update">
          <span>Hay una nueva versión disponible.</span>
          <button type="button" onClick={() => window.__espePwaUpdate?.()}>
            Actualizar
          </button>
        </div>
      )}
    </aside>
  );
};
