import { boot } from './app.js'

boot(document.getElementById('app'))

/**
 * Registering the worker is what makes the till installable and lets it run
 * with no network. It is strictly an enhancement: file:// and any browser
 * without support just skip it, and the app works the same.
 */
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {
      /* no offline mode — not worth interrupting a shift over */
    })
  })
}
