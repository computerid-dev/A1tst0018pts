/* ==========================================================
   sw.js — EchoNote Service Worker (satu-satunya, scope "/")
   Versi Vercel: path Netlify Functions diganti /api/*
   ========================================================== */

const CACHE_NAME = "echonote-shell-v2";

const SHELL_FILES = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/images/icons/icon-192.png",
  "/images/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(SHELL_FILES).catch((err) => {
        console.warn("SW: sebagian shell gagal di-cache", err);
      })
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  /* Video: jangan pernah dicache lewat Service Worker */
  if (url.pathname.includes("/video/") || url.pathname.endsWith(".mp4")) {
    return;
  }

  /* API dinamis (Vercel Functions) -> Network First */
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(
        () =>
          new Response(JSON.stringify({ error: "offline" }), {
            headers: { "Content-Type": "application/json" },
            status: 503
          })
      )
    );
    return;
  }

  /* Navigasi halaman (SPA) -> Network First + fallback offline.html */
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/offline.html")))
    );
    return;
  }

  /* Sisanya (JS/CSS/gambar shell) -> Cache First */
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(request, clone));
        return res;
      });
    })
  );
});
