// Minimal service worker for Vitalis Pact.
// Strategy: network-first for API/HTML, cache-first for static assets.
// Handles install prompt + offline shell. No backend; no push from server.

const CACHE_NAME = 'vitalis-pact-v1';
const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Network-first for navigations; fall back to cached index for offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Stale-while-revalidate for static assets.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});

// Local notification on demand (called by client via postMessage).
self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'show-notification') {
    self.registration.showNotification(data.title || 'Vitalis Pact', {
      body: data.body || 'Time to train.',
      icon: '/icon.svg',
      badge: '/icon.svg',
      tag: 'vitalis-reminder',
      renotify: true,
    });
  }
});
