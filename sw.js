const CACHE_NAME = "piano-app-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./vexflow-debug.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  // 새 서비스워커를 설치하자마자 대기(skip waiting) 없이 즉시 적용 준비
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    // 기존 캐시 삭제
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)));

    // ✅ 활성화되자마자 열린 탭/앱에 바로 적용
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
