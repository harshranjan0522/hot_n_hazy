/** Customer name + the order number this order will carry. Back / Proceed. */

import { el, money } from '../ui.js'
import { session, saveSession, reserveOrderNo, formatOrderNo, cartCount, cartTotal } from '../store.js'

export default function customerScreen(ctx) {
  const orderNo = reserveOrderNo()

  const input = el('input.field__input', {
    type: 'text',
    value: session.customer,
    placeholder: 'Customer name',
    autocomplete: 'off',
    autocapitalize: 'words',
    spellcheck: false,
    maxLength: 40,
    oninput: (e) => {
      session.customer = e.target.value
      saveSession()
      error.hidden = true
    },
    onkeydown: (e) => {
      if (e.key === 'Enter') proceed()
    },
  })

  const error = el('p.field__error', { hidden: true }, 'Enter a name for the order.')

  const proceed = () => {
    const name = input.value.trim()
    if (!name) {
      error.hidden = false
      input.focus()
      return
    }
    session.customer = name
    saveSession()
    ctx.go('ordertype')
  }

  const screen = el(
    'section.pane',
    null,
    el(
      'div.pane__card',
      null,
      el('div.orderno', null, el('span.orderno__label', null, 'Order'), el('strong.orderno__value', null, formatOrderNo(orderNo))),
      el(
        'label.field',
        null,
        el('span.field__label', null, "Customer's name"),
        input,
      ),
      error,
      el(
        'p.pane__note',
        null,
        cartCount(),
        cartCount() === 1 ? ' item' : ' items',
        ' · ',
        money(cartTotal()),
      ),
    ),
    el(
      'div.navbar',
      null,
      el('button.btn.btn--ghost.btn--lg', { onclick: () => ctx.go('order') }, '← Back'),
      el('button.btn.btn--go.btn--lg', { onclick: proceed }, 'Proceed →'),
    ),
  )

  screen.chrome = { title: 'Customer', subtitle: formatOrderNo(orderNo) }
  setTimeout(() => input.focus(), 0)
  return screen
}
