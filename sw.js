/**
 * SERVICE WORKER
 */

let staticCacheName = "restaurants-static-v2";
let restaurantsCache = "restaurants-visited";

// ADD STATIC CACHE
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll([
        "/",
        "index.html",
        "restaurant.html",
        "js/dbhelper.js",
        "js/main.js",
        "js/restaurant_info.js",
        "css/styles.css",
        "data/restaurants.json",
        "img/1.jpg",
        "img/2.jpg",
        "img/3.jpg",
        "img/4.jpg",
        "img/5.jpg",
        "img/6.jpg",
        "img/7.jpg",
        "img/8.jpg",
        "img/9.jpg",
        "img/10.jpg"
      ]);
    })
  );
});

// DELETE OLD CACHE IF CACHE NAME DOES NOT MATCH WITH EXISTING ONES
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            return (
              cacheName.startsWith("restaurants-") &&
              cacheName != staticCacheName &&
              cacheName != restaurantsCache
            );
          })
          .map(cacheName => {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

/**
 * RETURN CACHED RESPONSE IF THERE IS ONE AND
 * ADD ALL FILES WHICH DO NOT BELONG TO THE STATIC CACHE TO A NEW CACHE
 * https://googlechrome.github.io/samples/service-worker/basic/
 */

self.addEventListener("fetch", event => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(response => {
        if (response) {
          return response;
        }
        return caches.open(restaurantsCache).then(cache => {
          return fetch(event.request).then(response => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});