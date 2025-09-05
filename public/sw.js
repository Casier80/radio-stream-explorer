const CACHE_NAME = 'radio-player-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  // Solo cachear requests GET que no sean a APIs externas
  if (event.request.method === 'GET' && !event.request.url.includes('radio-browser.info')) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Si está en cache, devuelvelo
          if (response) {
            return response;
          }
          // Si no, busca en la red
          return fetch(event.request);
        }
      )
    );
  }
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});