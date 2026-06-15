/* ============================================================
   sw.js — Service Worker
   - Précache de l'app shell (fonctionne hors-ligne)
   - Cache-first pour les fichiers statiques
   - Network-only pour /api/ (l'IA a besoin du réseau)
   ============================================================ */

const CACHE = 'journal-sante-v2';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/app.js',
  './js/store.js',
  './js/db.js',
  './js/charts.js',
  './js/ai.js',
  './js/backup.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // L'analyse IA nécessite le réseau : on ne met jamais en cache.
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(fetch(e.request).catch(() =>
      new Response(JSON.stringify({ error: 'Hors-ligne : analyse IA indisponible.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } })));
    return;
  }

  if (e.request.method !== 'GET') return;

  // Cache-first, puis réseau (et on met à jour le cache au passage).
  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    }).catch(() =>
      e.request.mode === 'navigate' ? caches.match('./index.html') : undefined)
  );
});
