import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { processOfflineQueue } from '../../services/offlineQueue';

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

  if (!offline && !updateAvailable && !offlineReady) return null;

  return (
    <aside className="pwa-status" aria-live="polite">
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
