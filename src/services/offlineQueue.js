const DB_NAME = 'especonnect-offline';
const STORE_NAME = 'pending-requests';

const openDatabase = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, 1);
  request.onupgradeneeded = () => {
    if (!request.result.objectStoreNames.contains(STORE_NAME)) {
      request.result.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    }
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const runStoreRequest = async (mode, operation) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const request = operation(transaction.objectStore(STORE_NAME));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
};

export const queueRequest = ({ url, method = 'POST', data }) =>
  runStoreRequest('readwrite', (store) =>
    store.add({ url, method, data, createdAt: new Date().toISOString() }));

const getPendingRequests = () =>
  runStoreRequest('readonly', (store) => store.getAll());

const removeRequest = (id) =>
  runStoreRequest('readwrite', (store) => store.delete(id));

export const processOfflineQueue = async () => {
  if (!navigator.onLine) return;
  const token = localStorage.getItem('token');
  if (!token) return;
  const requests = await getPendingRequests();
  let processed = 0;

  for (const pending of requests) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}${pending.url}`, {
        method: pending.method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(pending.data),
      });
      if (response.ok) {
        await removeRequest(pending.id);
        processed += 1;
      } else if (response.status >= 400 && response.status < 500 && response.status !== 408) {
        await removeRequest(pending.id);
        window.dispatchEvent(new CustomEvent('espe:sync-rejected'));
      } else break;
    } catch (_error) {
      break;
    }
  }
  if (processed) {
    window.dispatchEvent(new CustomEvent('espe:sync-complete', { detail: { processed } }));
  }
};

export const isNetworkError = (error) => !error.response || error.code === 'ERR_NETWORK';
