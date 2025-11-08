// Service Worker for Firra's Portfolio
// Version 1.0.0

const CACHE_NAME = 'firra-portfolio-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/js/main.js',
    '/js/script.js',
    '/js/modules/core.js',
    '/js/modules/carousel.js',
    '/js/modules/events.js',
    '/js/modules/modal.js',
    '/js/modules/imageOptimizer.js',
    '/js/data/events.js',
    '/js/data/mentoring.js',
    '/styles/style.css',
    '/assets/firra.png',
    '/assets/mentor-firra-1.jpeg',
    '/assets/mentor-firra-2.jpeg',
    '/assets/mentor-firra-3.jpeg',
    '/assets/mentor-firra-4.jpeg',
    '/assets/mentor-firra-5.jpeg',
    '/assets/web-firra-1.jpeg',
    '/assets/web-firra-2.jpeg',
    '/assets/web-firra-3.jpeg',
    '/assets/favicon.svg',
    // External resources
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache.map(url => {
                    // Handle relative URLs properly
                    return new Request(url, { mode: 'no-cors' });
                })).catch((error) => {
                    console.warn('Service Worker: Some files failed to cache', error);
                    // Cache essential files only if full caching fails
                    return cache.addAll([
                        '/',
                        '/index.html',
                        '/js/main.js',
                        '/styles/style.css'
                    ]);
                });
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension requests and other non-HTTP requests
    if (!event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version if available
                if (response) {
                    return response;
                }

                // Otherwise fetch from network
                return fetch(event.request.clone())
                    .then((response) => {
                        // Check if response is valid
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Add to cache for future use
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch((error) => {
                        // Serve offline fallback for navigation requests
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                        
                        // For images, return a placeholder
                        if (event.request.destination === 'image') {
                            return new Response(
                                '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">Image Offline</text></svg>',
                                { headers: { 'Content-Type': 'image/svg+xml' } }
                            );
                        }
                        
                        throw error;
                    });
            })
    );
});

// Background sync for future features
self.addEventListener('sync', (event) => {
    if (event.tag === 'contact-form') {
        event.waitUntil(
            // Handle offline form submissions
            handleContactFormSync()
        );
    }
});

// Handle contact form background sync
function handleContactFormSync() {
    return new Promise((resolve) => {
        // This would handle queued contact form submissions
        resolve();
    });
}

// Push notification handling (for future features)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New update from Firra\'s Portfolio',
        icon: '/assets/favicon.svg',
        badge: '/assets/favicon.svg',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View Portfolio',
                icon: '/assets/favicon.svg'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/favicon.svg'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Firra\'s Portfolio', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling for communication with main app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.source.postMessage({ version: CACHE_NAME });
    }
});

// Error handling
self.addEventListener('error', (event) => {
    console.error('Service Worker: Error occurred', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker: Unhandled rejection', event.reason);
});