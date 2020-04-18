const FILES_TO_CACHE = [
	"/",
	"db.js",
	"/index.html",
	"/index.js",
	"/styles.css",
	"/manifest.webmanifest",
	"/favicon.ico",
	"/assets/images/icons/icon-72x72.png",
	"/assets/images/icons/icon-96x96.png",
	"/assets/images/icons/icon-128x128.png",
	"/assets/images/icons/icon-144x144.png",
	"/assets/images/icons/icon-152x152.png",
	"/assets/images/icons/icon-192x192.png",
	"/assets/images/icons/icon-384x384.png",
	"/assets/images/icons/icon-512x512.png",
];

const CACHE_NAME = "static-cache-v1",
	DATA_CACHE_NAME = "data-cache-v1";

self.addEventListener("install", function (event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(FILES_TO_CACHE);
		})
	);

	self.skipWaiting();
});

self.addEventListener("activate", function (event) {
	event.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(
				keyList.map((key) => {
					if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
						console.log("Rmoving old cache data", key);
						return caches.delete(key);
					}
				})
			);
		})
	);

	self.clients.claim();
});

self.addEventListener("fetch", function (event) {
	if (event.request.url.includes("/api")) {
		console.log("[Service Worker] Fetch (data)", event.request.url);

		event.respondWith(
			caches.open(DATA_CACHE_NAME).then((cache) => {
				return fetch(event.request)
					.then((response) => {
						if (response.status === 200) {
							cache.put(event.request.url, response.clone());
						}

						return response;
					})
					.catch((err) => {
						return cache.match(event.request);
					});
			})
		);

		return;
	}

	event.respondWith(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.match(event.request).then((response) => {
				return response || fetch(event.request);
			});
		})
	);
});
