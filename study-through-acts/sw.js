// Stale-while-revalidate: serve from cache instantly, refresh the cache in the background.
const CACHE = 'acts-plan-v1';

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', 'index.html']))));

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request);
    const net = fetch(e.request).then(r => { if (r.ok || r.type === 'opaque') c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
