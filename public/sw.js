const CACHE_PREFIX = `big-trip-cache`;
const CACHE_VER = `v13`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

const HTTP_STATUS_OK = 200;
const RES_SAFE_TYPE = `basic`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(caches.open(CACHE_NAME)
    .then((cache) => {
      return cache.addAll([
        `./`,
        `./index.html`,
        `./bundle.js`,
        `./css/style.css`,
        `./fonts/Montserrat-SemiBold.woff2`,
        `./fonts/Montserrat-Regular.woff2`,
        `./fonts/Montserrat-Medium.woff2`,
        `./fonts/Montserrat-ExtraBold.woff2`,
        `./fonts/Montserrat-Bold.woff2`,
        `./img/header-bg.png`,
        `./img/header-bg@2x.png`,
        `./img/logo.png`,
        `./img/icons/bus.png`,
        `./img/icons/check-in.png`,
        `./img/icons/drive.png`,
        `./img/icons/flight.png`,
        `./img/icons/restaurant.png`,
        `./img/icons/ship.png`,
        `./img/icons/sightseeing.png`,
        `./img/icons/taxi.png`,
        `./img/icons/train.png`,
        `./img/icons/transport.png`
      ]);
    }));
});

self.addEventListener(`activete`, (evt) => {
  evt.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.map((key) => {
      if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
        return caches.delete(key);
      }

      return null;
    }).filter((key) => key !== null))));
});

const fetchHandler = (evt) => {
  const {request} = evt;

  evt.respondWith(caches.match(request)
    .then((cacheResponse) => {
      if (cacheResponse) {
        return cacheResponse;
      }

      return fetch(request)
        .then((response) => {
          const {status, type} = response;
          if (!response || status !== HTTP_STATUS_OK || type !== RES_SAFE_TYPE) {
            return response;
          }

          const clonedResponse = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => cache.put(request, clonedResponse));

          return response;
        });
    }));
};

self.addEventListener(`fetch`, fetchHandler);
