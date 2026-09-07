/**
 * The app's own confirm and alert, replacing window.confirm/window.alert.
 *
 * The native ones are wrong here on three counts: they are chrome-coloured
 * rather than the till's, they announce the host name ("harshranjan0522.
 * github.io says"), and inside a WebView or an installed app they look like
 * the browser has intruded on the counter. These are centred cards in the same
 * language as the item popup.
 *
 * Both return a Promise, so call sites read much like the originals:
 *
 *   if (await confirmDialog({ ... })) { ... }
 */

import { el, lockScroll } from '../ui.js'

/**
 * Sits above the cart sheet and the drawer, since a confirmation is usually
 * raised from one of them.
 */
function open({ title, message, buttons, dismiss }) {
  let overlay

  const close = (result) => {
    overlay.remove()
    lockScroll(false)
    document.removeEventListener('keydown', onKey)
    settle(result)
  }

  let settle
  const answered = new Promise((resolve) => {
    settle = resolve
  })

  const onKey = (e) => {
    if (e.key === 'Escape') close(dismiss)
    // Enter takes the last button, which is always the affirmative one.
    else if (e.key === 'Enter') close(buttons[buttons.length - 1].value)
  }

  overlay = el(
    'div.dialog',
    {
      // A stray tap outside must not confirm anything, so it dismisses.
      onclick: (e) => {
        if (e.target === overlay) close(dismiss)
      },
    },
    el(
      'div.dialog__card',
      { role: 'alertdialog', 'aria-modal': 'true', 'aria-label': title },
      el('h3.dialog__title', null, title),
      message ? el('p.dialog__message', null, message) : null,
      el(
        'div.dialog__actions' + (buttons.length === 1 ? '.dialog__actions--single' : ''),
        null,
        buttons.map((b) =>
          el('button.btn' + b.cls, { onclick: () => close(b.value) }, b.label),
        ),
      ),
    ),
  )

  document.body.append(overlay)
  lockScroll(true)
  document.addEventListener('keydown', onKey)
  // Focus the safe choice, so a stray Enter or tap cannot destroy an order.
  overlay.querySelector('.btn')?.focus()

  return answered
}

/**
 * @param danger marks the affirmative button as destructive (red, not green).
 */
export function confirmDialog({ title, message, confirm = 'Yes', cancel = 'Cancel', danger = false }) {
  return open({
    title,
    message,
    dismiss: false,
    buttons: [
      { label: cancel, value: false, cls: '.btn--ghost' },
      { label: confirm, value: true, cls: danger ? '.btn--danger' : '.btn--go' },
    ],
  })
}

export function alertDialog({ title, message, ok = 'Got it' }) {
  return open({
    title,
    message,
    dismiss: undefined,
    buttons: [{ label: ok, value: undefined, cls: '.btn--go' }],
  })
}
