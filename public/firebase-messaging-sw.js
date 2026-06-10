/* eslint-disable no-undef */
/**
 * Firebase Cloud Messaging service worker (background push).
 *
 * Receives data-only FCM messages and renders exactly one notification, then
 * routes clicks to the deep link carried in the message. The public Firebase
 * config is passed via the registration query string (a SW can't read Vite env
 * vars). If config is absent the SW installs but stays inert.
 */
importScripts('https://www.gstatic.com/firebasejs/12.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.14.0/firebase-messaging-compat.js');

const params = new URL(self.location).searchParams;
const firebaseConfig = {
  apiKey: params.get('apiKey'),
  authDomain: params.get('authDomain'),
  projectId: params.get('projectId'),
  messagingSenderId: params.get('messagingSenderId'),
  appId: params.get('appId'),
};

// Activate this SW immediately on update so token refreshes don't lag a version.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const data = payload.data || {};
    const title = data.title || 'Notification';
    const options = {
      body: data.body || '',
      icon: '/vite.svg',
      badge: '/vite.svg',
      // Same entity collapses into one notification instead of stacking.
      tag: data.entityId || data.notificationId || undefined,
      renotify: Boolean(data.entityId || data.notificationId),
      data: { link: data.link || '/dashboard', ...data },
    };
    return self.registration.showNotification(title, options);
  });
}

// Focus an existing tab (and navigate it) or open a new one on click.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const link = (event.notification.data && event.notification.data.link) || '/dashboard';
  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of allClients) {
        // Reuse a same-origin tab if one is open.
        if ('focus' in client) {
          try {
            if ('navigate' in client) await client.navigate(link);
          } catch (_e) {
            /* cross-origin navigate can throw; fall back to focus */
          }
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(link);
    })(),
  );
});
