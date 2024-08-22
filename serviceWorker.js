const assets = [
    '/',
    '/index.html',
    '/assets/favicon.ico',
    '/scripts/alea.js',
    '/scripts/autre.js',
    '/scripts/binom.js',
    '/scripts/combi.js',
    '/scripts/equipes.js',
    '/scripts/normal.js',
    '/scripts/poker.js',
    '/scripts/storage.js',
    '/scripts/tarot.js',
    '/scripts/tirages.js',
    '/styles/boutons.css',
    '/styles/champs.css',
    '/styles/details.css',
    '/styles/style.css'
];

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open('v1').then(cache => {
            cache.addAll(assets);
        })
    );
});

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request);
        })
    );
});