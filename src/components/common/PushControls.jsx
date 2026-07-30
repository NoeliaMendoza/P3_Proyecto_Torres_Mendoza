import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Chip, Spinner } from '@heroui/react';
import {
  HiBell,
  HiBellAlert,
  HiBellSlash,
  HiCheckCircle,
  HiCog6Tooth,
  HiPaperAirplane,
} from 'react-icons/hi2';
import { toast } from 'sonner';
import {
  getNotificationPermission,
  getPushSubscription,
  sendTestPush,
  subscribeToPush,
  unsubscribeFromPush,
} from '../../services/push.services';

const getBrowserHelp = () => {
  const browser = navigator.userAgent;
  if (/Edg/i.test(browser)) return 'En Edge: candado junto a la URL → Permisos del sitio → Notificaciones → Permitir.';
  if (/Chrome/i.test(browser)) return 'En Chrome: controles junto a la URL → Configuración del sitio → Notificaciones → Permitir.';
  if (/Firefox/i.test(browser)) return 'En Firefox: candado junto a la URL → Conexión segura → Más información → Permisos.';
  return 'Abre la configuración o permisos de este sitio y cambia Notificaciones a “Permitir”.';
};

export const PushControls = () => {
  const supported =
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window;
  const [permission, setPermission] = useState(() =>
    supported ? getNotificationPermission() : 'unsupported'
  );
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);

  const refreshState = useCallback(async () => {
    if (!supported) {
      setPermission('unsupported');
      setLoading(false);
      return;
    }

    setPermission(getNotificationPermission());
    try {
      const subscription = await getPushSubscription();
      setEnabled(Boolean(subscription));
    } catch {
      setEnabled(false);
    } finally {
      setLoading(false);
    }
  }, [supported]);

  useEffect(() => {
    refreshState();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refreshState();
    };
    window.addEventListener('focus', refreshState);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('focus', refreshState);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [refreshState]);

  const toggle = async () => {
    setLoading(true);
    try {
      if (enabled) {
        await unsubscribeFromPush();
        toast.success('Notificaciones push desactivadas.');
      } else {
        await subscribeToPush();
        toast.success('Notificaciones push activadas en este dispositivo.');
      }
      await refreshState();
    } catch (error) {
      setPermission(getNotificationPermission());
      toast.error(error.response?.data?.mensaje || error.message);
      setLoading(false);
    }
  };

  const test = async () => {
    setTesting(true);
    try {
      const { data } = await sendTestPush();
      if (data.sent > 0) toast.success('Notificación de prueba enviada.');
      else toast.warning('No se encontró una suscripción activa para este dispositivo.');
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'No se pudo enviar la notificación.');
    } finally {
      setTesting(false);
    }
  };

  if (!supported) {
    return (
      <div className="border-b border-[#D8EAE2] p-4">
        <Alert status="warning" className="border border-amber-200 bg-amber-50">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Push no disponible</Alert.Title>
            <Alert.Description>Este navegador o modo de navegación no admite notificaciones push.</Alert.Description>
          </Alert.Content>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 border-b border-[#D8EAE2] px-5 py-4 text-xs font-semibold text-[#52716B]">
        <Spinner size="sm" />
        Comprobando notificaciones…
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="space-y-3 border-b border-[#D8EAE2] bg-rose-50/50 p-4">
        <Alert status="danger" className="border border-rose-200 bg-white">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Notificaciones bloqueadas</Alert.Title>
            <Alert.Description>{getBrowserHelp()}</Alert.Description>
          </Alert.Content>
        </Alert>
        <Button
          size="sm"
          variant="bordered"
          onPress={refreshState}
          startContent={<HiCog6Tooth className="h-4 w-4" />}
          className="rounded-xl border-rose-200 bg-white font-bold text-rose-700"
        >
          Ya cambié el permiso
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 border-b border-[#D8EAE2] bg-[#F4FAF7]/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${
            enabled ? 'bg-[#DDF4E8] text-[#036666]' : 'bg-white text-[#52716B]'
          }`}>
            {enabled ? <HiBellAlert className="h-5 w-5" /> : <HiBellSlash className="h-5 w-5" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-extrabold text-[#123B38]">Notificaciones del dispositivo</p>
              <Chip
                size="sm"
                color={enabled ? 'success' : 'default'}
                variant="soft"
                className="h-5 text-[9px] font-bold"
              >
                {enabled ? 'Activas' : 'Inactivas'}
              </Chip>
            </div>
            <p className="mt-0.5 text-[11px] text-[#52716B]">
              {enabled
                ? 'Recibirás avisos aunque ESPEConnect esté cerrado.'
                : 'Actívalas para recibir cambios de reservas y novedades.'}
            </p>
          </div>
        </div>
        {enabled && <HiCheckCircle className="h-5 w-5 shrink-0 text-[#358F80]" />}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          color={enabled ? 'danger' : 'primary'}
          variant={enabled ? 'flat' : 'solid'}
          onPress={toggle}
          isLoading={loading}
          startContent={!loading && !enabled ? <HiBell className="h-4 w-4" /> : null}
          className="rounded-xl font-bold"
        >
          {enabled
            ? 'Desactivar'
            : permission === 'default'
              ? 'Permitir notificaciones'
              : 'Activar en este dispositivo'}
        </Button>
        {enabled && (
          <Button
            size="sm"
            variant="bordered"
            onPress={test}
            isLoading={testing}
            startContent={!testing ? <HiPaperAirplane className="h-4 w-4" /> : null}
            className="rounded-xl border-[#78C6A3] font-bold text-[#036666]"
          >
            Enviar prueba
          </Button>
        )}
      </div>
    </div>
  );
};
