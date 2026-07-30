import api from '../api/axios';

const decodeVapidKey = (value) => {
  const padding = '='.repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
};

const ensurePushServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Este navegador no admite Service Workers.');
  }
  const current = await navigator.serviceWorker.getRegistration('/');
  if (current) return current;
  return navigator.serviceWorker.register('/push-handler.js', { scope: '/' });
};

export const getPushSubscription = async () => {
  const registration = await ensurePushServiceWorker();
  return registration.pushManager.getSubscription();
};

export const subscribeToPush = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Este navegador no admite notificaciones push.');
  }
  if (Notification.permission === 'denied') {
    throw new Error('Permiso denegado permanentemente. Actívalo manualmente en la configuración del navegador (🔒 junto a la URL).');
  }
  if (Notification.permission !== 'granted') {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      const error = new Error('Permiso de notificaciones denegado.');
      error.code = 'NOTIFICATION_PERMISSION_DENIED';
      throw error;
    }
  }
  const { data } = await api.get('/push/public-key');
  const registration = await ensurePushServiceWorker();
  const currentSubscription = await registration.pushManager.getSubscription();
  if (currentSubscription) {
    await api.post('/push/subscribe', currentSubscription.toJSON());
    return currentSubscription;
  }
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: decodeVapidKey(data.publicKey),
  });
  await api.post('/push/subscribe', subscription.toJSON());
  return subscription;
};

export const unsubscribeFromPush = async () => {
  const subscription = await getPushSubscription();
  if (!subscription) return;
  await api.delete('/push/subscribe', { data: { endpoint: subscription.endpoint } });
  await subscription.unsubscribe();
};

export const sendTestPush = () => api.post('/push/test');

export const getNotificationPermission = () =>
  typeof Notification === 'undefined' ? 'unsupported' : Notification.permission;
