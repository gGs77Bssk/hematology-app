// 血液内科 総合学習ツール Service Worker
const CACHE_NAME = 'hematology-tool-v2';
const ASSETS = [
  './',
  './血液内科_学習ツール_v2.html',
  './manifest.json'
];

// インストール時にコアファイルをキャッシュ
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ネットワーク優先、失敗時はキャッシュから返す
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        if (resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return resp;
      })
      .catch(() => caches.match(e.request).then(r => r || new Response('オフラインです', { status: 503 })))
  );
});
