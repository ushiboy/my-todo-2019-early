import '@babel/polyfill';
const CACHE_NAME = 'my-todo-cache-v1';
const urlsToCache = [
  '/',
  '/app.bundle.css',
  '/app.bundle.js',
  '/fonts/fa-solid-900.woff2'
];

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
      } else {
        return fetch(event.request);
      }
    })
  );
});
