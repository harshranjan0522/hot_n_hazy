/**
 * Receipt printing. Every order prints:
 *
 *   1. one CUSTOMER COPY carrying the whole order — every section, every line,
 *      and the grand total;
 *   2. then one slip per section, because each station (momo pan, chiller,
 *      griddle) only needs its own lines.
 *
 * They go out as one print job, one slip per page. Sized for an 80 mm thermal
 * roll but prints fine on A4.
 */

import { el, money } from './ui.js'
import { SHOP } from './data.js'

function stamp(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function row(label, value) {
  return el('div.receipt__row', null, el('span', null, label), el('strong', null, value))
}

function head(order, station) {
  return [
    el(
      'div.receipt__head',
      null,
      el('h1.receipt__shop', null, SHOP.name),
      el('p.receipt__addr', null, SHOP.address),
      el('p.receipt__addr', null, SHOP.city),
    ),
    el('div.receipt__rule'),
    el('div.receipt__station', null, station),
    el('div.receipt__rule'),
    el(
      'div.receipt__meta',
      null,
      row('Name', order.customer),
      row('Order', order.orderNo),
      row('Type', order.orderType),
      row('Cashier', order.cashier),
      row('Payment', order.payment),
      row('Time', stamp(order.at)),
    ),
    el('div.receipt__rule'),
  ]
}

/**
 * One line item, as two rows:
 *
 *   Kurkure Momo · Paneer
 *   Momos · Full · 2 × ₹100              ₹200
 *
 * A 72 mm roll cannot hold five aligned columns without collapsing them into
 * each other, and item names here run long ("Chilli Momo · Cheese Corn").
 */
function itemRows(lines, { showSection } = {}) {
  return el(
    'div.receipt__lines',
    null,
    lines.map((line) => {
      const meta = [
        showSection ? line.catLabel : null,
        line.sizeLabel !== '—' ? line.sizeLabel : null,
        line.qty + ' × ' + money(line.unit),
      ].filter(Boolean)

      return el(
        'div.rline',
        null,
        el('div.rline__name', null, line.name),
        el(
          'div.rline__meta',
          null,
          el('span', null, meta.join(' · ')),
          el('strong', null, money(line.total)),
        ),
      )
    }),
  )
}

function foot(text) {
  return [
    el('div.receipt__rule'),
    el('p.receipt__foot', null, text),
    el('p.receipt__foot', null, 'Thank you — see you again!'),
  ]
}

/** The one the customer walks away with: the whole order on a single slip. */
function customerReceipt(order, slipCount) {
  const allLines = order.lines
  const qty = allLines.reduce((sum, l) => sum + l.qty, 0)

  return el(
    'div.receipt.receipt--customer',
    null,
    head(order, 'Customer Copy'),
    itemRows(allLines, { showSection: true }),
    el('div.receipt__rule'),
    el(
      'div.receipt__total',
      null,
      el('span', null, 'Total'),
      el('strong', null, money(order.total)),
    ),
    el(
      'div.receipt__grand',
      null,
      el('span', null, qty + (qty === 1 ? ' item' : ' items')),
      el('span', null, allLines.length + (allLines.length === 1 ? ' line' : ' lines')),
    ),
    foot('Customer copy · ' + slipCount + ' kitchen slip' + (slipCount === 1 ? '' : 's')),
  )
}

/** One station's slip: only that section's lines, and its own total. */
function stationReceipt(order, group, index, count) {
  return el(
    'div.receipt',
    null,
    head(order, group.label),
    itemRows(group.lines),
    el('div.receipt__rule'),
    el(
      'div.receipt__total',
      null,
      el('span', null, group.label + ' total'),
      el('strong', null, money(group.total)),
    ),
    order.total !== group.total
      ? el(
          'div.receipt__grand',
          null,
          el('span', null, 'Order total (all sections)'),
          el('span', null, money(order.total)),
        )
      : null,
    foot('Kitchen slip ' + index + ' of ' + count),
  )
}

/**
 * Renders the customer copy plus every station slip into the hidden print root
 * and opens the print dialog. `groups` comes from store.cartByCategory(),
 * captured before the cart is cleared.
 */
export function printReceipts(order, groups) {
  const root = document.getElementById('print-root')
  if (!root) return
  root.replaceChildren(
    customerReceipt(order, groups.length),
    ...groups.map((group, i) => stationReceipt(order, group, i + 1, groups.length)),
  )
  // Let the layout settle before handing the tree to the print engine.
  window.setTimeout(() => window.print(), 60)
}
