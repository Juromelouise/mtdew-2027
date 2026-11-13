// Offline play when the game is hosted: every file it needs is saved on the first visit.
// Network first, so a new upload shows up at once; the saved copy is used only when the network fails.
// Add any new asset to FILES, or it is only saved after it has been loaded once online.
// Needs https (or localhost). One missing file in FILES stops the whole install: check the console warning from index.html.
// ponytail: no timeout on the network try, so on connected-but-dead Wi-Fi the page waits out the browser's own timeout
// before the saved copy appears. If that bites, abort the fetch after ~3s (clear the timer once headers arrive).
const CACHE = 'dew-squadron';
const FILES = ['./', 'index.html', 'assets/Background-mtdew.png', 'assets/logo_mtdew.png', 'assets/bottom_bottle.png',
  'assets/fonts/press-start-2p.woff2', 'assets/fonts/black-ops-one.woff2'];

self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); });
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request)
    .then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true })));
});
