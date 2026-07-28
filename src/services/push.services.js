import api from '../api/axios';

const decodeVapidKey = (value) => {
  const padding = '='.repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
};

export const getPushSubscription = async () => {
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
};

export const subscribeToPush = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Este navegador no admite notificaciones push.');
  }
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Permiso de notificaciones denegado.');
  const { data } = await api.get('/push/public-key');
  const registration = await navigator.serviceWorker.ready;
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
