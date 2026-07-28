import { useEffect, useState } from 'react';
import { Button, Card, CardContent } from '@heroui/react';
import { HiArrowDownTray, HiDevicePhoneMobile, HiXMark } from 'react-icons/hi2';
import { toast } from 'sonner';
import { processOfflineQueue } from '../../services/offlineQueue';

const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(
    () => window.sessionStorage.getItem('espe:pwa-install-dismissed') === 'true'
  );

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const handleInstalled = () => setDeferredPrompt(null);

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      toast.success('ESPEConnect se instaló correctamente.');
    }
  };

  const handleDismiss = () => {
    window.sessionStorage.setItem('espe:pwa-install-dismissed', 'true');
    setDismissed(true);
  };

  if (!deferredPrompt || dismissed) return null;

  return (
    <Card className="pwa-install-card" shadow="lg">
      <CardContent className="pwa-install-card__content">
        <div className="pwa-install-card__icon" aria-hidden="true">
          <HiDevicePhoneMobile />
        </div>

        <div className="pwa-install-card__copy">
          <strong>Instala ESPEConnect</strong>
          <span>Accede más rápido y úsala incluso sin conexión.</span>
        </div>

        <Button
          size="sm"
          color="primary"
          onPress={handleInstall}
          startContent={<HiArrowDownTray aria-hidden="true" />}
          className="pwa-install-card__action"
        >
          Instalar
        </Button>

        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={handleDismiss}
          aria-label="Cerrar sugerencia de instalación"
          className="pwa-install-card__close"
        >
          <HiXMark aria-hidden="true" />
        </Button>
      </CardContent>
    </Card>
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
