const CACHE_NAME = 'paebiru-v3';
const urlsToCache = [
  './',
  './index.html',
  './assets/styles.css',
  './assets/js/app.js',
  './assets/js/chapter-renderer.js',
  './assets/js/config.js',
  './assets/js/epub-loader.js',
  './assets/js/home-renderer.js',
  './assets/js/navigation-controller.js',
  './assets/js/state-manager.js',
  './assets/js/toc-manager.js',
  './assets/js/ui-controller.js',
  './assets/Paebiru_XXI.epub',
  './assets/CRIO_livro.epub',
  './assets/Tekoha_XXI.epub',
  './manifest.json',
  './assets/images/icon-192.png',
  './assets/images/icon-512.png'
];

// Instala o service worker e faz cache dos recursos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Ativa o service worker e limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepta requests e serve do cache quando possível
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retorna a resposta do cache
        if (response) {
          return response;
        }

        // Clone o request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Verifica se é uma resposta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone a resposta
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});
