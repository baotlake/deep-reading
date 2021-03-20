let CACHE_NAME = 'wrp-beta-dev';
let urlsToCache = [
  '/',
  '/completed'
];

// Install a service worker
this.addEventListener('install', event => {
  console.log('service-worker install', event)
  // 初始化缓存以及添加离线应用时所需的文件

  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
this.addEventListener('fetch', event => {
  // console.log('service-worker fetch', event)
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
      )
  );
});

// Update a service worker
this.addEventListener('activate', event => {
  let cacheWhitelist = ['your-app-name'];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});