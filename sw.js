/* Service worker — cache pour usage hors-ligne (agences, visites) */
const CACHE = "simu-immo-v1";
const CORE = [
  "./",
  "./simulateur-immobilier.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-180.png"
];
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE).catch(()=>{})));
});
self.addEventListener("activate", e => { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(e.request, { ignoreSearch: true });
      const network = fetch(e.request).then(r => {
        if (r && r.status === 200 && (e.request.url.startsWith("http"))) cache.put(e.request, r.clone());
        return r;
      }).catch(() => cached);
      return cached || network;   // cache d'abord ; sinon réseau (et on met en cache pour la prochaine fois)
    })
  );
});
