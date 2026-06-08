const CACHE_NAME = 'basira-qr-v8'; // v8: zero-tolerance security + nav bar fix + phishing labels
const STATIC_ASSETS = [
  './',
  './index.html',
  './app.html',
  './css/style.css',
  './js/i18n.js',
  './js/storage.js',
  './js/virustotal.js',
  './js/scanner.js',
  './js/theme.js',
  './js/app.js',
  './js/pwa-install.js',
  './js/jsqr.min.js',   // self-hosted — no CDN dependency
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// Install: cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
              .then(() => self.skipWaiting())
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

// Fetch: cache-first for static, pass-through for all API calls
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never cache: VirusTotal API or the Cloudflare Worker proxy
  if (url.hostname.includes('virustotal.com') ||
      url.hostname.includes('workers.dev')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first strategy for all static assets
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
        // Fallback to app shell for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./app.html') || caches.match('./index.html');
        }
      });
    })
  );
});
