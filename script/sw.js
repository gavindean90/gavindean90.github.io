// sw.js - Service Worker for caching the album player resources

const CACHE_NAME = 'base3-album-cache-v1';
const urlsToCache = [
    '/',
    '/images/Base3Logo.jpg',
    '/music/Lead_with_Your_Hips.m4a',
    '/music/Midnight_Attitude.m4a',
    '/music/Full_Capacity.m4a',
    '/music/Deep_Sleep.m4a',
    '/music/Level_9.m4a',
    '/music/Windy.m4a',
    '/music/T-Rex_T-Rex.m4a',
    '/music/Walking_on_the_C.m4a',
    '/music/Won_2_1.m4a',
    // Add other assets and audio files here as needed
];

self.addEventListener('install', (event) => {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return the response from the cache
                if (response) {
                    console.log("cache hit");
                    return response;
                }
                console.log("cache miss");
                // Clone the no request for fetch and cache
                const fetchRequest = event.request.clone();
                return fetch(fetchRequest).then(
                    (response) => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        // Clone the response for cache storage
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    }
                );
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

