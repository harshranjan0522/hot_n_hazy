/** Take away or dine in — either one goes straight to payment. */

import { el } from '../ui.js'
import { session, saveSession, formatOrderNo } from '../store.js'

export default function orderTypeScreen(ctx) {
  const pick = (type) => {
    session.orderType = type
    saveSession()
    ctx.go('payment')
  }

  const screen = el(
    'section.pane',
    null,
    el('h2.pane__ask', null, 'How is it going out?'),
    el(
      'div.choices',
      null,
      el(
        'button.choice',
        { onclick: () => pick('Take Away') },
        el('span.choice__icon', null, '🥡'),
        el('span.choice__label', null, 'Take Away'),
      ),
      el(
        'button.choice',
        { onclick: () => pick('Dine In') },
        el('span.choice__icon', null, '🍽️'),
        el('span.choice__label', null, 'Dine In'),
      ),
    ),
    el(
      'div.navbar',
      null,
      el('button.btn.btn--ghost.btn--lg', { onclick: () => ctx.go('customer') }, '← Back'),
    ),
  )

  screen.chrome = {
    title: session.customer || 'Order',
    subtitle: formatOrderNo(session.orderNo),
  }
  return screen
}
