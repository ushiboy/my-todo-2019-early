import '@babel/polyfill';
const CACHE_NAME = 'my-todo-cache-v1';
const urlsToCache = ['/', '/app.bundle.css', '/app.bundle.js'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      const request = event.request.clone();
      return fetch(request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const cacheResponse = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, cacheResponse);
        });
        return response;
      });
    })
  );
});
