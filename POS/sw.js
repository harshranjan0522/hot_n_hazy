/**
 * Service worker — the reason the POS keeps taking orders when the cart's
 * hotspot drops out.
 *
 * Cache-first for the whole app shell: the counter never needs a fresher copy
 * mid-shift, and a network round trip it cannot make must not block a sale.
 * A new version lands by bumping CACHE — the old cache is dropped on activate.
 */

const CACHE = 'hnh-pos-v4'

const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png',
  './src/css/base.css',
  './src/css/screens.css',
  './src/css/print.css',
  './src/js/main.js',
  './src/js/app.js',
  './src/js/data.js',
  './src/js/store.js',
  './src/js/ui.js',
  './src/js/receipt.js',
  './src/js/components/cartsheet.js',
  './src/js/components/dialog.js',
  './src/js/components/drawer.js',
  './src/js/components/itemmodal.js',
  './src/js/screens/admin.js',
  './src/js/screens/customer.js',
  './src/js/screens/done.js',
  './src/js/screens/login.js',
  './src/js/screens/order.js',
  './src/js/screens/orders.js',
  './src/js/screens/ordertype.js',
  './src/js/screens/payment.js',
  './src/js/screens/pin.js',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // addAll is all-or-nothing; one bad path would leave the till
      // uninstallable, so each file is added on its own.
      .then((cache) => Promise.all(SHELL.map((url) => cache.add(url).catch(() => {}))))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) return hit
      return fetch(request)
        .then((response) => {
          // Cache what we fetch so an icon or font seen once stays available.
          if (response.ok && new URL(request.url).origin === self.location.origin) {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() =>
          // Offline and uncached: a navigation still has to land somewhere.
          request.mode === 'navigate' ? caches.match('./index.html') : Response.error(),
        )
    }),
  )
})
