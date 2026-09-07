import { boot } from './app.js'

boot(document.getElementById('app'))

/**
 * The service worker is what makes the till installable and able to run with
 * no signal. It is strictly an enhancement — anything without support, or a
 * page opened over file://, skips it and the app works the same.
 *
 * Not on localhost, though. The worker is cache-first, so during development
 * it keeps serving the previous copy of every file and edits appear to do
 * nothing until CACHE is bumped. Any worker left over from an earlier session
 * is torn down too, so a dev machine is always serving what is on disk.
 * Offline behaviour is therefore tested on the deployed URL, not locally.
 */
const isLocalhost = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  if (isLocalhost) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      for (const reg of regs) reg.unregister()
      // The caches outlive the registration and would still answer fetches.
      if ('caches' in window) caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)))
    })
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {
        /* no offline mode — not worth interrupting a shift over */
      })
    })
  }
}
