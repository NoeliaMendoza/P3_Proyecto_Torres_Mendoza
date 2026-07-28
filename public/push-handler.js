self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data?.json() || {};
  } catch (_error) {
    data = { body: event.data?.text() };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'ESPEConnect', {
      body: data.body || 'Tienes una nueva notificación.',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      data: { url: data.url || '/dashboard' },
      tag: data.tag || 'especonnect',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const targetUrl = new URL(event.notification.data?.url || '/dashboard', self.location.origin).href;
      const openClient = clients.find((client) => client.url === targetUrl);
      return openClient ? openClient.focus() : self.clients.openWindow(targetUrl);
    })
  );
});
