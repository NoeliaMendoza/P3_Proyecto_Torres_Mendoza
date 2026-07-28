import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  getPushSubscription,
  sendTestPush,
  subscribeToPush,
  unsubscribeFromPush,
} from '../../services/push.services';

export const PushControls = () => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const supported = 'serviceWorker' in navigator && 'PushManager' in window;

  useEffect(() => {
    if (supported) getPushSubscription().then((subscription) => setEnabled(Boolean(subscription)));
  }, [supported]);

  const toggle = async () => {
    setLoading(true);
    try {
      if (enabled) {
        await unsubscribeFromPush();
        setEnabled(false);
        toast.success('Notificaciones push desactivadas.');
      } else {
        await subscribeToPush();
        setEnabled(true);
        toast.success('Notificaciones push activadas.');
      }
    } catch (error) {
      toast.error(error.response?.data?.mensaje || error.message);
    } finally {
      setLoading(false);
    }
  };

  const test = async () => {
    try {
      const { data } = await sendTestPush();
      toast.success(data.mensaje);
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'No se pudo enviar la notificación.');
    }
  };

  if (!supported) {
    return <p className="text-xs text-slate-500">Este navegador no admite notificaciones push.</p>;
  }

  return (
    <div className="px-5 py-3 border-b border-slate-200 bg-white flex items-center gap-2">
      <button
        type="button"
        disabled={loading}
        onClick={toggle}
        className="px-3 py-2 rounded-full text-xs font-bold bg-emerald-700 text-white disabled:opacity-50"
      >
        {loading ? 'Procesando…' : enabled ? 'Desactivar push' : 'Activar push'}
      </button>
      {enabled && (
        <button
          type="button"
          onClick={test}
          className="px-3 py-2 rounded-full text-xs font-bold border border-emerald-700 text-emerald-700"
        >
          Enviar prueba
        </button>
      )}
    </div>
  );
};
