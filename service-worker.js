const CACHE = 'folium-v2';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('folium-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
 if (e.request.method !== 'GET') return;
 if (e.request.mode === 'navigate') {
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const copy=r.clone(); e.waitUntil(caches.open(CACHE).then(c=>c.put('./index.html',copy))); } return r; }).catch(()=>caches.match('./index.html'))); return;
 }
 e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
  if (r.ok || r.type === 'opaque') { const copy=r.clone(); e.waitUntil(caches.open(CACHE).then(c=>c.put(e.request,copy))); } return r;
 })));
});
