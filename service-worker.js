const CACHE_NAME = 'finance-tracker-cache-v1';

// List of assets to cache for offline
const ASSETS_TO_CACHE = [
  './',
  './index.html',

  // External JS (local copies)
  './js/chart.min.js',
  './js/jspdf.umd.min.js',

  // Add other assets/images you use
  './2e308efd-1b28-4c93-b03c-015e98a25d7c-removebg-preview.png'
];

// Install event: cache assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate event: clean old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch event: serve cached assets if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request)
        .then((networkResponse) => {
          // Optionally cache new requests dynamically
          return networkResponse;
        })
        .catch(() => {
          // Fallback if offline and asset not cached
          if (event.request.destination === 'document') return caches.match('./index.html');
        });
    })
  );
});

