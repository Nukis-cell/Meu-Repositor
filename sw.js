// sw.js
// Service Worker: cache do "app shell" para permitir uso offline.
//
// Estratégia: cache-first para os arquivos estáticos da aplicação,
// com atualização do cache em segundo plano (stale-while-revalidate
// simplificado). Suficiente para esta etapa; pode ser refinado depois.

const CACHE_VERSION = 'v10';
const CACHE_NAME = `meu-repositor-${CACHE_VERSION}`;

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/main.css',
  './css/layout.css',
  './css/components.css',
  './css/responsive.css',
  './js/app.js',
  './js/config/config.js',
  './js/db/database.js',
  './js/db/products.js',
  './js/db/barcodes.js',
  './js/db/replenishment.js',
  './js/db/expirations.js',
  './js/db/history.js',
  './js/db/backup.js',
  './js/pages/home.js',
  './js/pages/replenishment.js',
  './js/pages/expirations.js',
  './js/pages/products.js',
  './js/pages/settings.js',
  './js/components/barcode-scanner.js',
  './js/components/product-card.js',
  './js/components/expiration-card.js',
  './js/components/modal.js',
  './js/components/toast.js',
  './js/utils/dates.js',
  './js/utils/formatters.js',
  './js/utils/validation.js',
  './js/utils/storage.js',
  './js/utils/errorlog.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name.startsWith('meu-repositor-') && name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
