/**
 * Screen router and app shell.
 *
 * Flow:  login -> pin -> order -> customer -> ordertype -> payment -> (print)
 * The hamburger (logout / switch user / admin) rides on every screen after the
 * PIN, including the admin window.
 */

import { el, clear } from './ui.js'
import { session, currentUser, logout, rollShiftIfDue } from './store.js'
import { SHOP } from './data.js'
import { openDrawer } from './components/drawer.js'

import loginScreen from './screens/login.js'
import pinScreen from './screens/pin.js'
import orderScreen from './screens/order.js'
import customerScreen from './screens/customer.js'
import orderTypeScreen from './screens/ordertype.js'
import paymentScreen from './screens/payment.js'
import doneScreen from './screens/done.js'
import ordersScreen from './screens/orders.js'
import adminScreen from './screens/admin.js'

const SCREENS = {
  login: loginScreen,
  pin: pinScreen,
  order: orderScreen,
  customer: customerScreen,
  ordertype: orderTypeScreen,
  payment: paymentScreen,
  done: doneScreen,
  orders: ordersScreen,
  admin: adminScreen,
}

/** Screens shown before anyone is signed in get no shell chrome. */
const BARE = new Set(['login', 'pin'])

let route = { name: 'login', params: {} }
let root = null
/** Set by a screen that binds document-level listeners; called on navigation. */
let teardown = null

/**
 * The till always opens at the door — on launch, and again whenever it comes
 * back from the background — so whoever picks the phone up has to enter a PIN.
 *
 * RELOCK_AFTER_MS is the grace period before a background app is locked. 0
 * means always. Raise it (30_000, say) if the counter needs to hop to another
 * app mid-order — checking a UPI payment — without being signed out.
 */
const RELOCK_AFTER_MS = 0
let hiddenAt = null

function relock() {
  // Already at the door; re-rendering would only wipe a half-typed PIN.
  if (BARE.has(route.name)) return
  logout()
  go('login')
}

function onVisibilityChange() {
  if (document.hidden) {
    hiddenAt = Date.now()
    return
  }
  if (hiddenAt == null) return
  const away = Date.now() - hiddenAt
  hiddenAt = null
  if (away >= RELOCK_AFTER_MS) relock()
}

export function go(name, params = {}) {
  route = { name, params }
  render()
}

/** Re-runs the current screen — used after any state change. */
export function refresh() {
  render()
}

const ctx = { go, refresh }

function topbar(title, subtitle) {
  const user = currentUser()
  return el(
    'header.topbar',
    null,
    el(
      'button.hamburger',
      { onclick: () => openDrawer(ctx), 'aria-label': 'Menu', title: 'Menu' },
      el('span.hamburger__bars'),
    ),
    el(
      'div.topbar__title',
      null,
      el('span.topbar__name', null, title),
      subtitle && el('span.topbar__sub', null, subtitle),
    ),
    user && el('div.topbar__user', null, el('span.topbar__dot'), user.name),
  )
}

function render() {
  const build = SCREENS[route.name] || SCREENS.login
  teardown?.()
  teardown = null

  const screen = build(ctx, route.params)
  teardown = screen.onTeardown || null
  document.body.dataset.screen = route.name
  clear(root)

  if (BARE.has(route.name)) {
    root.append(el('div.shell.shell--bare', null, screen))
    return
  }

  const chrome = screen.chrome || {}
  root.append(
    el(
      'div.shell',
      null,
      topbar(chrome.title || SHOP.name, chrome.subtitle),
      el('main.shell__body', null, screen),
    ),
  )
}

export function boot(mountPoint) {
  root = mountPoint
  // A machine left on overnight starts the next shift with an empty log.
  rollShiftIfDue()

  document.addEventListener('visibilitychange', onVisibilityChange)
  // Android's WebView is the case visibilitychange cannot be relied on for:
  // reopening a backgrounded activity does not reload the page. MainActivity
  // calls this from onResume() as a guarantee.
  window.HazyPOS = { relock }

  // Always the login screen, never a restored session.
  logout()
  go('login')
}

export { session }
