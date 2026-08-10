const CACHE_NAME = 'reto-habitos-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './DML.jpeg' 
];

// 1. Instalación del Service Worker (Guarda los archivos en caché)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Archivos cacheados correctamente');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// 2. Activación (Limpia cachés antiguos si haces actualizaciones)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Limpiando caché antiguo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Estrategia de Fetch (Red primero, si falla usa la Caché)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
