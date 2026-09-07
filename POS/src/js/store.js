/**
 * The whole POS state, split in two:
 *
 *   shop    — menu, users, order counter. Survives reloads and shift changes.
 *   session — who is logged in and what is in the cart right now. Also
 *             persisted, because a counter machine that loses a half-built
 *             order to an accidental refresh is worse than useless.
 *
 * Nothing here touches the DOM. Screens read state, call the mutators, and
 * re-render from the returned state.
 */

import { CATEGORIES, DEFAULT_ITEMS, DEFAULT_USERS } from './data.js'

/**
 * Bump these when the shipped menu itself changes, not when a price does — a
 * stored menu shadows DEFAULT_ITEMS, so a machine that has already run would
 * otherwise never see a corrected default. Day-to-day edits persist normally;
 * "Reset menu to defaults" in the admin window is the manual route back.
 */
const SHOP_KEY = 'hnh.pos.shop.v3'
const SESSION_KEY = 'hnh.pos.session.v3'

/**
 * Always hands back a fresh copy of the defaults. Returning `fallback` itself
 * would alias state onto the defaults object, and every later mutation would
 * quietly rewrite them — which made logout() an assignment of the live session
 * onto itself.
 */
function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return structuredClone(fallback)
    return { ...structuredClone(fallback), ...JSON.parse(raw) }
  } catch {
    // Private-mode browsers and cleared storage both land here; a fresh machine
    // is a valid outcome, not an error worth blocking the shift for.
    return structuredClone(fallback)
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — the shift still has to run */
  }
}

const shopDefaults = {
  items: DEFAULT_ITEMS.map((i) => ({ ...i })),
  users: DEFAULT_USERS.map((u) => ({ ...u })),
  /** Next number to hand out. Printed as #hazy0001. */
  nextOrderNo: 1,
  /** Completed orders for the current 12-hour window. See SHIFT_MS. */
  orders: [],
  /** Epoch ms the current window opened. Older than 12h and it rolls over. */
  shiftStartedAt: Date.now(),
  /** Where "Mail details" sends the shift report. Set in the admin window. */
  reportEmail: '',
}

const sessionDefaults = {
  userId: null,
  cart: [],
  customer: '',
  orderType: null, // 'Take Away' | 'Dine In'
  orderNo: null, // reserved when the customer screen opens
}

export const shop = read(SHOP_KEY, shopDefaults)
export const session = read(SESSION_KEY, sessionDefaults)

export function saveShop() {
  write(SHOP_KEY, shop)
}
export function saveSession() {
  write(SESSION_KEY, session)
}

/* --- lookups ------------------------------------------------------------ */

export function currentUser() {
  return shop.users.find((u) => u.id === session.userId) || null
}

export function itemById(id) {
  return shop.items.find((i) => i.id === id) || null
}

export function categoryLabel(catId) {
  return CATEGORIES.find((c) => c.id === catId)?.label || catId
}

export function itemsInCategory(catId) {
  return shop.items.filter((i) => i.cat === catId)
}

/**
 * Items of a category split into the board's sub-groups, in first-seen order.
 * Ungrouped items come back under a single group with no label.
 */
export function groupsInCategory(catId) {
  const groups = []
  for (const item of itemsInCategory(catId)) {
    const label = item.group || ''
    let group = groups.find((g) => g.label === label)
    if (!group) {
      group = { label, items: [] }
      groups.push(group)
    }
    group.items.push(item)
  }
  return groups
}

/** Existing group names in a category — offered when adding a new item. */
export function groupNames(catId) {
  return [...new Set(itemsInCategory(catId).map((i) => i.group).filter(Boolean))]
}

/**
 * The name a receipt, popup or CSV should show.
 *
 * A variant tile says only "Paneer", which is meaningless on paper — so it
 * gets its style prefixed ("Kurkure Momo · Paneer"). A group that is just a
 * shelf label does not: "Classic Fries" is already the whole name, and
 * "Fries · Classic Fries" would be noise. The test is whether the bare name is
 * unique on the menu.
 */
export function fullName(item) {
  if (!item.group) return item.name
  const ambiguous = shop.items.some((i) => i.id !== item.id && i.name === item.name)
  return ambiguous ? item.group + ' · ' + item.name : item.name
}

/* --- order number ------------------------------------------------------- */

export function formatOrderNo(n) {
  return '#hazy' + String(n).padStart(4, '0')
}

/**
 * Shows the number this order *will* get without burning it — the counter only
 * advances once the order is actually paid for, so an abandoned order does not
 * leave a hole in the day's numbering.
 */
export function reserveOrderNo() {
  if (session.orderNo == null) {
    session.orderNo = shop.nextOrderNo
    saveSession()
  }
  return session.orderNo
}

export function commitOrderNo() {
  shop.nextOrderNo = Math.max(shop.nextOrderNo, (session.orderNo ?? 0) + 1)
  saveShop()
}

/* --- cart --------------------------------------------------------------- */

/**
 * One line per item+size+add-on, so a half and a full plate — or a burger with
 * cheese and one without — stay separate lines.
 */
function lineKey(itemId, size, addon) {
  return itemId + ':' + size + (addon ? ':+' : '')
}

export function priceFor(item, size, addon = false) {
  const base = size === 'half' ? item.half : item.full
  return base + (addon && item.addon ? item.addon.price : 0)
}

export function addToCart(itemId, size, qty, addon = false) {
  const item = itemById(itemId)
  if (!item || qty < 1) return
  const withAddon = Boolean(addon && item.addon)
  const key = lineKey(itemId, size, withAddon)
  const existing = session.cart.find((l) => l.key === key)
  if (existing) {
    existing.qty += qty
  } else {
    session.cart.push({ key, itemId, size, qty, addon: withAddon })
  }
  saveSession()
}

export function setLineQty(key, qty) {
  const line = session.cart.find((l) => l.key === key)
  if (!line) return
  if (qty < 1) {
    session.cart = session.cart.filter((l) => l.key !== key)
  } else {
    line.qty = qty
  }
  saveSession()
}

export function removeLine(key) {
  session.cart = session.cart.filter((l) => l.key !== key)
  saveSession()
}

export function clearCart() {
  session.cart = []
  saveSession()
}

/** Cart lines resolved against the live menu, with per-line totals. */
export function cartLines() {
  return session.cart
    .map((line) => {
      const item = itemById(line.itemId)
      if (!item) return null // item deleted in admin mid-order
      const withAddon = Boolean(line.addon && item.addon)
      const unit = priceFor(item, line.size, withAddon)
      return {
        ...line,
        addon: withAddon,
        addonName: withAddon ? item.addon.name : '',
        name: fullName(item) + (withAddon ? ' + ' + item.addon.name.replace(/^Add /i, '') : ''),
        tileName: item.name,
        group: item.group || '',
        cat: item.cat,
        unit,
        total: unit * line.qty,
        // "Full" is only meaningful against a half — a mojito has neither.
        sizeLabel: item.half == null ? '—' : line.size === 'half' ? 'Half' : 'Full',
      }
    })
    .filter(Boolean)
}

export function cartTotal() {
  return cartLines().reduce((sum, l) => sum + l.total, 0)
}

export function cartCount() {
  return session.cart.reduce((sum, l) => sum + l.qty, 0)
}

/** How many of an item (any size) are in the cart — drives the tile badge. */
export function qtyOfItem(itemId) {
  return session.cart
    .filter((l) => l.itemId === itemId)
    .reduce((sum, l) => sum + l.qty, 0)
}

/** Cart grouped by category, in menu order — one printed receipt per group. */
export function cartByCategory() {
  const lines = cartLines()
  return CATEGORIES.map((cat) => ({
    id: cat.id,
    label: cat.label,
    lines: lines.filter((l) => l.cat === cat.id),
  }))
    .filter((g) => g.lines.length > 0)
    .map((g) => ({ ...g, total: g.lines.reduce((s, l) => s + l.total, 0) }))
}

/* --- session lifecycle -------------------------------------------------- */

export function login(userId) {
  session.userId = userId
  saveSession()
}

export function logout() {
  Object.assign(session, structuredClone(sessionDefaults))
  saveSession()
}

/** Wipes the order but keeps whoever is on the counter signed in. */
export function resetOrder() {
  session.cart = []
  session.customer = ''
  session.orderType = null
  session.orderNo = null
  saveSession()
}

/* --- admin mutators ----------------------------------------------------- */

let seq = Date.now()
function uid(prefix) {
  seq += 1
  return prefix + '-' + seq.toString(36)
}

export function updateItem(id, patch) {
  const item = itemById(id)
  if (!item) return
  Object.assign(item, patch)
  saveShop()
}

export function addItem({ name, cat, group, half, full }) {
  const item = { id: uid('x'), cat, group: group || undefined, name, half: half ?? null, full }
  shop.items.push(item)
  saveShop()
  return item
}

export function deleteItem(id) {
  shop.items = shop.items.filter((i) => i.id !== id)
  // Any cart line pointing at it goes too, so totals never drift.
  session.cart = session.cart.filter((l) => l.itemId !== id)
  saveShop()
  saveSession()
}

export function addUser({ name, pin }) {
  const user = { id: uid('u'), name, pin }
  shop.users.push(user)
  saveShop()
  return user
}

export function updateUser(id, patch) {
  const user = shop.users.find((u) => u.id === id)
  if (!user) return
  Object.assign(user, patch)
  saveShop()
}

export function deleteUser(id) {
  if (shop.users.length <= 1) return false // never lock everyone out
  shop.users = shop.users.filter((u) => u.id !== id)
  saveShop()
  if (session.userId === id) logout()
  return true
}

/* --- orders log --------------------------------------------------------- */

/** The log keeps one trading window. Anything older is yesterday's problem. */
export const SHIFT_MS = 12 * 60 * 60 * 1000

/**
 * Rolls the log over if the window has expired. Called on boot and whenever the
 * orders screen or a new order touches the log, so a machine left running
 * overnight still starts the next shift clean.
 */
export function rollShiftIfDue(now = Date.now()) {
  if (!shop.shiftStartedAt) shop.shiftStartedAt = now
  if (now - shop.shiftStartedAt < SHIFT_MS) return false
  // Skip forward in whole windows so the boundary stays predictable.
  const windows = Math.floor((now - shop.shiftStartedAt) / SHIFT_MS)
  shop.shiftStartedAt += windows * SHIFT_MS
  shop.orders = []
  saveShop()
  return true
}

export function shiftEndsAt() {
  return (shop.shiftStartedAt || Date.now()) + SHIFT_MS
}

/** Writes the finished order to the log and burns its order number. */
export function recordOrder({ payment }) {
  rollShiftIfDue()
  const order = {
    no: session.orderNo,
    orderNo: formatOrderNo(session.orderNo),
    customer: session.customer || 'Guest',
    orderType: session.orderType || 'Take Away',
    cashier: currentUser()?.name || '—',
    payment,
    at: new Date().toISOString(),
    lines: cartLines().map((l) => ({
      name: l.name,
      cat: l.cat,
      catLabel: categoryLabel(l.cat),
      size: l.size,
      sizeLabel: l.sizeLabel,
      qty: l.qty,
      unit: l.unit,
      total: l.total,
    })),
    total: cartTotal(),
  }
  shop.orders.unshift(order) // newest first — the list is read top-down
  commitOrderNo()
  saveShop()
  return order
}

export function clearOrders() {
  shop.orders = []
  shop.shiftStartedAt = Date.now()
  saveShop()
}

export function ordersTotal() {
  return shop.orders.reduce((sum, o) => sum + o.total, 0)
}

export function resetMenuToDefaults() {
  shop.items = DEFAULT_ITEMS.map((i) => ({ ...i }))
  session.cart = []
  saveShop()
  saveSession()
}
