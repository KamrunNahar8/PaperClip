const CACHE_NAME = 'diu-pdf-box-v3.9';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './analyze.html',
    './converter.html',
    './about.html',
    './how-it-works.html',
    './css/style.css',
    './js/navigation.js',
    './js/faculty_data.js',
    './js/app.js',
    './js/converter.js',
    './Logos/DIU PDF BOX(Dark).png',
    './Logos/Logo-DIU.png'
];

/**
 * Install Event: Fast-Install of the critical app shell.
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Install: Caching shell');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

/**
 * Activate Event: HARD PURGE of all old caches to ensure fresh start.
 */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    // Delete EVERYTHING that isn't the current v3.9 cache
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Hard Purge: Deleting old cache', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

/**
 * Fetch Event: Network-First logic for navigation to ensure freshness.
 */
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    
    const url = new URL(event.request.url);
    const isExternal = url.origin !== self.location.origin;

    // 1. Navigation (HTML Pages): 3s Network-First (more generous for slow Wi-Fi)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            timeoutFetch(3000, event.request)
                .then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                })
                .catch(() => caches.match(event.request) || caches.match('./index.html'))
        );
        return;
    }

    // 2. static assets: Stale-While-Revalidate (Instant Speed)
    if (!isExternal && (url.pathname.endsWith('.css') || url.pathname.endsWith('.js') || url.pathname.includes('/Logos/'))) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
                return cachedResponse || fetchPromise;
            })
        );
        return;
    }

    // 3. Default: Cache with Network Fallback
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

/**
 * Helper: Timeout fetch to prevent hanging on poor connections
 */
function timeoutFetch(ms, request) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Network timeout'));
        }, ms);

        fetch(request).then(
            (response) => {
                clearTimeout(timeout);
                resolve(response);
            },
            (err) => {
                clearTimeout(timeout);
                reject(err);
            }
        );
    });
}
