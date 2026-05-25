const CACHE_NAME = 'neurotools-cache-v5'; // Actualizado a v5

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icono-app.png',
  '/cefalea/calendario.html',
  '/cefalea/hit6.html',
  '/cefalea/index.html',
  '/cefalea/midas.html',
  '/cefalea/parks.html',
  '/cognitivo/FAB.html',
  '/cognitivo/gds.html',
  '/cognitivo/index.html',
  '/cognitivo/mmse.html',
  '/cognitivo/mrs.html',
  '/cognitivo/tam.html',
  '/cognitivo/testreloj.html',
  '/cognitivo/icono.png',
  '/epilepsia/calculadorawithdrawal.html',
  '/epilepsia/index.html',
  '/infecciones/index.html',
  '/infecciones/meningitiscomunidad.html',
  '/parkinson/index.html',
  '/parkinson/updrs.html',
  '/toxina/distonia.html',
  '/toxina/espasmo.html',
  '/toxina/index.html',
  '/toxina/cara.png',
  '/vascular/CHA₂DS₂-VA.html',
  '/vascular/abcd2.html',
  '/vascular/boston.html',
  '/vascular/calculadora.html',
  '/vascular/calculadora_hipolipemiantes.html',
  '/vascular/index.html',
  '/vascular/inicioanticoagulacion.html',
  '/vascular/mrs.html',
  '/vascular/nihss.html',
  '/vascular/trombolisis_contraindicaciones.html',
  '/vascular/icono-app.png',
  '/vascular/leve.png',
  '/vascular/moderado.png',
  '/vascular/severo1.png',
  '/vascular/severo2.png'
  // Eliminado '/vascular/manifest.json' de aquí
];

// 1. Instalación: Fuerza al nuevo Service Worker a activarse inmediatamente
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    }).then(() => self.skipWaiting()) // Salta la espera
  );
});

// 2. Activación: Toma el control de las páginas inmediatamente
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
    }).then(() => self.clients.claim()) // Reclama el control de los clientes
  );
});

// 3. Peticiones: Red primero. Si tiene éxito, actualiza la caché dinámicamente.
self.addEventListener('fetch', event => {
  // Evitar interceptar peticiones de extensiones o externas que puedan fallar
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si la respuesta es correcta, guardamos la copia actualizada en la caché
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red (offline), sirve lo que haya en la caché
        return caches.match(event.request);
      })
  );
});
