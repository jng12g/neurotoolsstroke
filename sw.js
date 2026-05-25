const CACHE_NAME = 'neurotools-cache-v1';

const urlsToCache = [
  // --- ARCHIVOS RAÍZ ---
  '/',
  '/index.html',
  '/manifest.json',
  '/icono-app.png', // Asegúrate de que este archivo exista en tu raíz

  // --- CEFALEA ---
  '/cefalea/calendario.html',
  '/cefalea/hit6.html',
  '/cefalea/index.html',
  '/cefalea/midas.html',
  '/cefalea/parks.html',

  // --- COGNITIVO ---
  '/cognitivo/FAB.html',
  '/cognitivo/gds.html',
  '/cognitivo/index.html',
  '/cognitivo/mmse.html',
  '/cognitivo/mrs.html',
  '/cognitivo/tam.html',
  '/cognitivo/testreloj.html',
  '/cognitivo/icono.png',

  // --- EPILEPSIA ---
  '/epilepsia/calculadorawithdrawal.html',
  '/epilepsia/index.html',

  // --- INFECCIONES ---
  '/infecciones/index.html',
  '/infecciones/meningitiscomunidad.html',

  // --- PARKINSON ---
  '/parkinson/index.html',
  '/parkinson/updrs.html',

  // --- TOXINA ---
  '/toxina/distonia.html',
  '/toxina/espasmo.html',
  '/toxina/index.html',
  '/toxina/cara.png',

  // --- VASCULAR ---
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
  
  // Archivos extra dentro de vascular
  '/vascular/icono-app.png',
  '/vascular/leve.png',
  '/vascular/moderado.png',
  '/vascular/severo1.png',
  '/vascular/severo2.png',
  '/vascular/manifest.json'
];

// 1. Evento de Instalación: Guarda los archivos en la caché inicial
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caché abierta');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Evento Fetch: Intercepta las peticiones (Estrategia: Red primero, Caché como respaldo)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // Si la red falla (offline), busca en la caché
        return caches.match(event.request);
      })
  );
});

// 3. Evento Activate: Limpia cachés antiguas si actualizas el CACHE_NAME
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
