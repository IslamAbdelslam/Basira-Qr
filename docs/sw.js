const CACHE_NAME = 'basira-qr-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/i18n.js',
  './js/storage.js',
  './js/virustotal.js',
  './js/scanner.js',
  './js/theme.js',
  './js/app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js'
];

// Install: cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS.filter(url => !url.startsWith('http') || url.includes('jsqr')));
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for static, network-first for API
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Don't cache VirusTotal API calls
  if (url.hostname.includes('virustotal.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first strategy
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Fallback to index.html for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
