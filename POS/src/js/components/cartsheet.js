/**
 * Cart review sheet. The order screen only needs the green Proceed button, but
 * a wrong tap has to be fixable before the customer pays — so tapping the
 * totals chip opens this.
 */

import { el, money, lockScroll } from '../ui.js'
import { cartLines, cartTotal, setLineQty, removeLine, clearCart } from '../store.js'

export function openCartSheet(onChange) {
  let overlay
  const body = el('div.sheet__body')

  const close = () => {
    overlay.remove()
    lockScroll(false)
    document.removeEventListener('keydown', onKey)
    onChange()
  }
  const onKey = (e) => {
    if (e.key === 'Escape') close()
  }

  const paint = () => {
    const lines = cartLines()
    if (!lines.length) {
      close()
      return
    }
    body.replaceChildren(
      ...lines.map((line) =>
        el(
          'div.cartline',
          null,
          el(
            'div.cartline__what',
            null,
            el('span.cartline__name', null, line.name),
            el(
              'span.cartline__meta',
              null,
              line.sizeLabel !== '—' ? line.sizeLabel + ' · ' : '',
              money(line.unit),
              ' each',
            ),
          ),
          el(
            'div.stepper.stepper--sm',
            null,
            el(
              'button.stepper__btn',
              { onclick: () => { setLineQty(line.key, line.qty - 1); paint() }, 'aria-label': 'Less' },
              '−',
            ),
            el('span.stepper__value', null, String(line.qty)),
            el(
              'button.stepper__btn',
              { onclick: () => { setLineQty(line.key, line.qty + 1); paint() }, 'aria-label': 'More' },
              '+',
            ),
          ),
          el('span.cartline__total', null, money(line.total)),
          el(
            'button.cartline__x',
            { onclick: () => { removeLine(line.key); paint() }, 'aria-label': 'Remove ' + line.name },
            '×',
          ),
        ),
      ),
      el('div.sheet__foot', null, el('span', null, 'Total'), el('strong', null, money(cartTotal()))),
    )
  }

  overlay = el(
    'div.sheet',
    { onclick: (e) => { if (e.target === overlay) close() } },
    el(
      'div.sheet__card',
      { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Cart' },
      el(
        'div.sheet__head',
        null,
        el('h3', null, 'This order'),
        el(
          'button.btn.btn--ghost.btn--sm',
          {
            onclick: () => {
              if (window.confirm('Clear every item from this order?')) {
                clearCart()
                close()
              }
            },
          },
          'Clear all',
        ),
        el('button.sheet__close', { onclick: close, 'aria-label': 'Close' }, '×'),
      ),
      body,
    ),
  )

  paint()
  document.body.append(overlay)
  lockScroll(true)
  document.addEventListener('keydown', onKey)
}
