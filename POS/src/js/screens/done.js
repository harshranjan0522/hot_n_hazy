/** Confirmation after the slips have gone to the printer. */

import { el, money } from '../ui.js'
import { printReceipts } from '../receipt.js'

export default function doneScreen(ctx, params) {
  const { order, slips } = params
  if (!order) {
    ctx.go('order')
    return el('div')
  }

  const screen = el(
    'section.pane',
    null,
    el(
      'div.pane__card.pane__card--done',
      null,
      el('div.done__tick', null, '✓'),
      el('h2.done__title', null, 'Order placed'),
      el(
        'p.done__meta',
        null,
        order.orderNo,
        ' · ',
        order.customer,
        ' · ',
        order.orderType,
      ),
      el('p.done__total', null, money(order.total), ' · ', order.payment),
      el(
        'p.done__note',
        null,
        'Sent to the printer: 1 customer copy + ',
        slips.length,
        slips.length === 1 ? ' kitchen slip.' : ' kitchen slips.',
      ),
    ),
    el(
      'div.navbar',
      null,
      el(
        'button.btn.btn--ghost.btn--lg',
        { onclick: () => printReceipts(order, slips) },
        'Print again',
      ),
      el('button.btn.btn--go.btn--lg', { onclick: () => ctx.go('order') }, 'New order →'),
    ),
  )

  screen.chrome = { title: 'Done', subtitle: order.orderNo }
  return screen
}
