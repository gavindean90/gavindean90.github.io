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
    '/music/windy.m4a',
    '/music/T-Rex_T-Rex.m4a',
    '/music/Walking_on_the_C.m4a',
    '/music/Won_2_1.m4a',
    '/music/Lead_with_Your_Hips.wav',
    '/music/Midnight_Attitude.wav',
    '/music/Full_Capacity.wav',
    '/music/Deep_Sleep.wav',
    '/music/Level_9.wav',
    '/music/windy.wav',
    '/music/T-Rex_T-Rex.wav',
    '/music/Walking_on_the_C.wav',
    '/music/Won_2_1.wav',
    // Add other assets and audio files here as needed
];

self.addEventListener('install', (event) => {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return Promise.all(
                    urlsToCache.map(url => 
                        cache.add(url)
                            .then(() => console.log(`Successfully cached ${url}`))
                            .catch(error => console.error(`Failed to cache ${url}:`, error))
                    )
                );
            })
    );
});

self.addEventListener('fetch', (event) => {
    console.log(`Fetching ${event.request.url}`);
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log(`Cache hit for ${event.request.url}`);
                    return response;
                }
                console.log(`Cache miss for ${event.request.url}`);
                
                const fetchRequest = event.request.clone();
                return fetch(fetchRequest).then(
                    (response) => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            console.error(`Failed to fetch or invalid response for ${event.request.url}`);
                            return response;
                        }

                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                                console.log(`Cached response for ${event.request.url}`);
                            })
                            .catch(error => console.error(`Failed to cache ${event.request.url}:`, error));

                        return response;
                    }
                ).catch(error => console.error(`Network error for ${event.request.url}:`, error));
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

