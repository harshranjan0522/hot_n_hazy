/** The hamburger menu: logout, switch user, admin window / back to user view. */

import { el, lockScroll } from '../ui.js'
import { logout, currentUser, cartCount } from '../store.js'

export function openDrawer(ctx) {
  const onAdmin = document.body.dataset.screen === 'admin'
  let overlay

  const close = () => {
    overlay.remove()
    lockScroll(false)
    document.removeEventListener('keydown', onKey)
  }
  const onKey = (e) => {
    if (e.key === 'Escape') close()
  }

  const item = (label, hint, onClick, cls) =>
    el(
      'button.drawer__item' + (cls ? '.' + cls : ''),
      { onclick: () => { close(); onClick() } },
      el('span.drawer__label', null, label),
      hint && el('span.drawer__hint', null, hint),
    )

  const confirmIfCart = (message, action) => {
    if (cartCount() > 0 && !window.confirm(message)) return
    action()
  }

  overlay = el(
    'div.drawer',
    { onclick: (e) => { if (e.target === overlay) close() } },
    el(
      'aside.drawer__panel',
      null,
      el(
        'div.drawer__head',
        null,
        el('span.drawer__who', null, currentUser()?.name || 'Counter'),
        el('button.drawer__close', { onclick: close, 'aria-label': 'Close menu' }, '×'),
      ),
      el(
        'div.drawer__items',
        null,
        item('All orders', 'This shift, CSV & mail', () => ctx.go('orders')),
        onAdmin
          ? item('Switch to user view', 'Back to taking orders', () => ctx.go('order'))
          : item('Admin window', 'Prices, items, users', () => ctx.go('admin')),
        // Switching users and logging out clear the same state — the wording is
        // the only difference. logout() persists it; clearing session.userId by
        // hand did not, so a reload signed the previous person straight back in.
        item('Switch user', 'Hand the counter over', () =>
          confirmIfCart('This order is not finished. Discard it and switch user?', () => {
            logout()
            ctx.go('login')
          }),
        ),
        item(
          'Logout',
          'Close the counter',
          () =>
            confirmIfCart('This order is not finished. Discard it and log out?', () => {
              logout()
              ctx.go('login')
            }),
          'drawer__item--warn',
        ),
      ),
    ),
  )

  document.body.append(overlay)
  lockScroll(true)
  document.addEventListener('keydown', onKey)
  overlay.querySelector('.drawer__item')?.focus()
}
