/**
 * Payment: order summary on the left, the two ways to pay on the right.
 * Either way ends the same — log the order, print one slip per category.
 */

import { el, money } from '../ui.js'
import {
  session,
  cartByCategory,
  cartTotal,
  formatOrderNo,
  recordOrder,
  resetOrder,
} from '../store.js'
import { printReceipts } from '../receipt.js'

export default function paymentScreen(ctx) {
  const groups = cartByCategory()
  if (!groups.length) {
    // Cart emptied from the sheet or admin — nothing to charge for.
    ctx.go('order')
    return el('div')
  }

  const finish = (payment) => {
    // Snapshot the slips before the cart is cleared out from under them.
    const slips = cartByCategory()
    const order = recordOrder({ payment })
    resetOrder()
    printReceipts(order, slips)
    ctx.go('done', { order, slips })
  }

  const methods = el('div.pay__methods')

  const showMethods = () => {
    methods.replaceChildren(
      el(
        'button.paybtn',
        { onclick: () => finish('Pay at counter') },
        el('span.paybtn__icon', null, '💵'),
        el('span.paybtn__label', null, 'Pay at counter'),
        el('span.paybtn__hint', null, 'Cash or card at the till'),
      ),
      el(
        'button.paybtn',
        { onclick: showUpi },
        el('span.paybtn__icon', null, '📱'),
        el('span.paybtn__label', null, 'UPI'),
        el('span.paybtn__hint', null, 'Show the QR to the customer'),
      ),
    )
  }

  const showUpi = () => {
    methods.replaceChildren(
      el(
        'div.qr',
        null,
        el('div.qr__box', null, el('span.qr__placeholder', null, 'QR')),
        el('p.qr__note', null, 'Payment gateway not wired up yet — drop the QR image in here.'),
        el('p.qr__amount', null, 'Amount due ', el('strong', null, money(cartTotal()))),
      ),
      el(
        'div.qr__actions',
        null,
        el('button.btn.btn--ghost.btn--lg', { onclick: showMethods }, '← Other method'),
        el('button.btn.btn--go.btn--lg', { onclick: () => finish('UPI') }, 'Payment received'),
      ),
    )
  }

  showMethods()

  const summary = el(
    'div.summary',
    null,
    el(
      'div.summary__head',
      null,
      el('h2.summary__name', null, session.customer || 'Guest'),
      el(
        'p.summary__meta',
        null,
        formatOrderNo(session.orderNo),
        ' · ',
        session.orderType || 'Take Away',
      ),
    ),
    el(
      'div.summary__groups',
      null,
      groups.map((group) =>
        el(
          'div.summary__group',
          null,
          el('h3.summary__cat', null, group.label),
          group.lines.map((line) =>
            el(
              'div.summary__line',
              null,
              el('span.summary__qty', null, line.qty + '×'),
              el(
                'span.summary__what',
                null,
                line.name,
                line.sizeLabel !== '—' ? el('em.summary__size', null, ' ' + line.sizeLabel) : null,
              ),
              el('span.summary__amt', null, money(line.total)),
            ),
          ),
          el(
            'div.summary__subtotal',
            null,
            el('span', null, 'Slip total'),
            el('span', null, money(group.total)),
          ),
        ),
      ),
    ),
    el(
      'div.summary__total',
      null,
      el('span', null, 'To pay'),
      el('strong', null, money(cartTotal())),
    ),
    el(
      'p.summary__slips',
      null,
      'Prints 1 customer copy + ',
      groups.length,
      groups.length === 1 ? ' kitchen slip' : ' kitchen slips',
      ' (one per section).',
    ),
  )

  const screen = el(
    'div.pay',
    null,
    el('div.pay__left', null, summary),
    el(
      'div.pay__right',
      null,
      el('h2.pay__ask', null, 'How are they paying?'),
      methods,
      el(
        'div.navbar.navbar--inline',
        null,
        el('button.btn.btn--ghost', { onclick: () => ctx.go('ordertype') }, '← Back'),
      ),
    ),
  )

  screen.chrome = { title: 'Payment', subtitle: formatOrderNo(session.orderNo) }
  return screen
}
