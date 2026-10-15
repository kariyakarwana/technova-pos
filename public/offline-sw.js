/* The offline cache is limited to the POS workspace and its static assets.
 * API responses, authentication pages, and other private screens are never cached. */
const CACHE_NAME = "technova-pos-offline-v1";
const OFFLINE_ROUTES = new Set(["/pos", "/offline-sync"]);

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith("technova-pos-offline-") && name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

function isCacheablePage(response, pathname) {
  return (
    response.ok &&
    !response.redirected &&
    new URL(response.url).pathname === pathname &&
    (response.headers.get("content-type") || "").includes("text/html")
  );
}

async function preparePage(pathname) {
  const request = new Request(pathname, {
    credentials: "same-origin",
    headers: { accept: "text/html" },
    cache: "no-store",
  });
  const response = await fetch(request);
  if (!isCacheablePage(response, pathname)) return;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(pathname, response.clone());

  // A fetched HTML document does not download its scripts/styles automatically.
  const html = await response.text();
  const assetPaths = new Set();
  for (const match of html.matchAll(/(?:src|href)="(\/_next\/static\/[^"?]+(?:\?[^\"]*)?)"/g)) {
    assetPaths.add(match[1].replaceAll("&amp;", "&"));
  }
  await Promise.allSettled(
    [...assetPaths].map(async (path) => {
      const asset = await fetch(path, { credentials: "same-origin" });
      if (asset.ok) await cache.put(path, asset);
    }),
  );
}

self.addEventListener("message", (event) => {
  if (event.data?.type === "PREPARE_OFFLINE") {
    event.waitUntil(
      Promise.allSettled([...OFFLINE_ROUTES].map(preparePage)),
    );
  }
  if (event.data?.type === "CLEAR_OFFLINE_CACHE") {
    event.waitUntil(caches.delete(CACHE_NAME));
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
      })(),
    );
    return;
  }

  if (request.mode !== "navigate") return;
  if (!OFFLINE_ROUTES.has(url.pathname)) {
    event.respondWith(
      fetch(request).catch(() => new Response(
        '<!doctype html><html lang="en"><meta charset="utf-8"><title>Offline | TechNova</title><main><h1>You are offline</h1><p>This screen needs the server. POS and Offline Sync are available if they were prepared while connected on this device.</p><p><a href="/pos">Open POS</a> · <a href="/offline-sync">Open Offline Sync</a></p></main></html>',
        { status: 503, headers: { "content-type": "text/html; charset=utf-8" } },
      )),
    );
    return;
  }
  event.respondWith(
    (async () => {
      try {
        const response = await fetch(request);
        if (isCacheablePage(response, url.pathname)) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(url.pathname, response.clone());
        }
        return response;
      } catch {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(url.pathname);
        if (cached) return cached;
        return new Response("This page is not available offline yet. Connect once and open POS before going offline.", {
          status: 503,
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
      }
    })(),
  );
});
