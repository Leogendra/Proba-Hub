const CACHE_NAME = "v2";

const assets = [
    "/",
    "/index.html",
    "/assets/favicon.ico",
    "/scripts/alea.js",
    "/scripts/autre.js",
    "/scripts/binom.js",
    "/scripts/combi.js",
    "/scripts/equipes.js",
    "/scripts/normal.js",
    "/scripts/poker.js",
    "/scripts/storage.js",
    "/scripts/tarot.js",
    "/scripts/collision.js",
    "/scripts/tirages.js",
    "/styles/boutons.css",
    "/styles/champs.css",
    "/styles/details.css",
    "/styles/style.css"
];


self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(assets))
    );
    self.skipWaiting();
});


self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});


self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});