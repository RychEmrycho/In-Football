const CACHE_NAME = "in-football";
var urlToCache = [
    "/",
    "/manifest.json",
    "/img/icon/icon.png",
    "/img/icon/icon_512x.png",
    "/nav.html",
    "/index.html",
    "/pages/detail.html",
    "/pages/home.html",
    "/pages/scoreboard.html",
    "/css/materialize.min.css",
    "/css/style.css",
    "/js/materialize.min.js",
    "/js/nav.js",
    "/js/api.js",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://fonts.googleapis.com/css?family=Montserrat"
];

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(urlToCache);
        })
    )
})

self.addEventListener("fetch", function(event) {
    var base_url = "https://api.football-data.org/v2/";

    if (event.request.url.indexOf(base_url) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function (cache) {
                return fetch(event.request).then(function (response) {
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            // caches.match(event.request, { cacheName : CACHE_NAME })
            // .then(function(response) {
            //     if (response) {
            //         console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
            //         return response;
            //     }
    
            //     console.log("ServiceWorker: Memuat aset dari server", event.request.url);
            //     return fetch(event.request);
            // })
            caches.match(event.request, { ignoreSearch: true}).then(function (response) {
                return response || fetch (event.request);
            })
        )
    
    }
})

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName != CACHE_NAME) {
                        console.log("Serviceworker: cache " + cacheName + " dihapus!");
                        return caches.delete(cacheName);
                    }
                })
            )
        })
    )
})