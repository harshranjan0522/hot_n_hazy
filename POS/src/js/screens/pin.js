/** 4-digit PIN pad. Submits itself on the fourth digit — no extra tap. */

import { el } from '../ui.js'
import { shop, login } from '../store.js'

export default function pinScreen(ctx, params) {
  const user = shop.users.find((u) => u.id === params.userId)
  if (!user) return el('div', null, el('button', { onclick: () => ctx.go('login') }, 'Back'))

  let entry = ''
  const dots = el('div.pin__dots')
  const error = el('p.pin__error', { hidden: true }, 'Wrong PIN. Try again.')

  const paint = () => {
    dots.replaceChildren(
      ...[0, 1, 2, 3].map((i) =>
        el('span.pin__dot' + (i < entry.length ? '.is-on' : '')),
      ),
    )
  }

  const submit = () => {
    if (entry === user.pin) {
      login(user.id)
      ctx.go('order')
      return
    }
    error.hidden = false
    dots.classList.add('is-wrong')
    setTimeout(() => {
      entry = ''
      paint()
      dots.classList.remove('is-wrong')
    }, 400)
  }

  const push = (digit) => {
    if (entry.length >= 4) return
    error.hidden = true
    entry += digit
    paint()
    if (entry.length === 4) setTimeout(submit, 120)
  }

  const back = () => {
    entry = entry.slice(0, -1)
    error.hidden = true
    paint()
  }

  const onKey = (e) => {
    if (/^[0-9]$/.test(e.key)) push(e.key)
    else if (e.key === 'Backspace') back()
    else if (e.key === 'Escape') ctx.go('login')
  }
  document.addEventListener('keydown', onKey)

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

  const screen = el(
    'section.pin',
    null,
    el('h2.pin__ask', null, 'Hi ', el('strong', null, user.name), ' — enter your PIN'),
    dots,
    error,
    el(
      'div.pin__pad',
      null,
      keys.map((k) => el('button.key', { onclick: () => push(k) }, k)),
      el('button.key.key--soft', { onclick: () => ctx.go('login') }, 'Not me'),
      el('button.key', { onclick: () => push('0') }, '0'),
      el('button.key.key--soft', { onclick: back, 'aria-label': 'Delete' }, '⌫'),
    ),
  )

  // The router owns cleanup: it calls this before swapping the screen out.
  screen.onTeardown = () => document.removeEventListener('keydown', onKey)

  paint()
  return screen
}
