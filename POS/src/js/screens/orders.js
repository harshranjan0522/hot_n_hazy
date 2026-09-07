/**
 * All orders for the current 12-hour window: download as CSV, mail the summary,
 * or clear the log. The window rolls over on its own — see rollShiftIfDue() —
 * so the list always shows one trading session, never a growing pile.
 *
 * The list is paged. A busy day is ~1000 orders, and rendering them all put
 * 24k nodes on the screen — 84ms on a desktop, several times that on the phone
 * this actually runs on. Cards are appended a page at a time instead, so the
 * cost of opening this screen no longer depends on how well the day went. The
 * stats, the CSV and the mail report still cover every order.
 */

/** Cards per page. 40 fills a couple of screens without the stall. */
const PAGE = 40

import { el, money } from '../ui.js'
import { shop, ordersTotal, clearOrders, rollShiftIfDue, shiftEndsAt } from '../store.js'
import { SHOP } from '../data.js'
import { confirmDialog } from '../components/dialog.js'

const CSV_COLUMNS = [
  'Order No',
  'Date',
  'Time',
  'Customer',
  'Type',
  'Cashier',
  'Payment',
  'Section',
  'Item',
  'Size',
  'Qty',
  'Unit Price',
  'Line Total',
  'Order Total',
]

/** RFC 4180 quoting — a customer named O'Brien, Jr. must not shift columns. */
function csvCell(value) {
  const text = value == null ? '' : String(value)
  return /[",\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text
}

function ordersToCsv(orders) {
  const rows = [CSV_COLUMNS]
  for (const order of orders) {
    const at = new Date(order.at)
    const date = at.toLocaleDateString('en-IN')
    const time = at.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    for (const line of order.lines) {
      rows.push([
        order.orderNo,
        date,
        time,
        order.customer,
        order.orderType,
        order.cashier,
        order.payment,
        line.catLabel,
        line.name,
        line.sizeLabel,
        line.qty,
        line.unit,
        line.total,
        order.total,
      ])
    }
  }
  return rows.map((row) => row.map(csvCell).join(',')).join('\r\n')
}

function downloadCsv(orders) {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const name =
    'hot-n-hazy-orders-' +
    now.getFullYear() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    '-' +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    '.csv'
  // The BOM is what makes Excel open rupee symbols and names as UTF-8.
  const blob = new Blob(['﻿' + ordersToCsv(orders)], {
    type: 'text/csv;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = el('a', { href: url, download: name })
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function mailBody(orders) {
  const lines = [
    SHOP.name + ' — orders report',
    'Window opened: ' + new Date(shop.shiftStartedAt).toLocaleString('en-IN'),
    'Generated: ' + new Date().toLocaleString('en-IN'),
    'Orders: ' + orders.length + '   Sales: ' + money(ordersTotal()),
    '',
  ]
  for (const order of orders) {
    const at = new Date(order.at).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })
    lines.push(
      [order.orderNo, at, order.customer, order.orderType, order.payment, money(order.total)].join(
        ' | ',
      ),
    )
    for (const line of order.lines) {
      lines.push(
        '    ' +
          line.qty +
          '× ' +
          line.name +
          (line.sizeLabel !== '—' ? ' (' + line.sizeLabel + ')' : '') +
          '  ' +
          money(line.total),
      )
    }
  }
  return lines.join('\n')
}

function mailOrders(orders) {
  const subject = SHOP.name + ' — orders ' + new Date().toLocaleDateString('en-IN')
  let body = mailBody(orders)
  // mailto: bodies get truncated by the OS well before this, so cut it here
  // with a note rather than letting the mail client silently chop it.
  const LIMIT = 1600
  if (body.length > LIMIT) {
    body = body.slice(0, LIMIT) + '\n\n… trimmed. Attach the CSV download for the full list.'
  }
  const to = (shop.reportEmail || '').trim()
  const href =
    'mailto:' +
    encodeURIComponent(to) +
    '?subject=' +
    encodeURIComponent(subject) +
    '&body=' +
    encodeURIComponent(body)
  // An anchor click hands the mailto to the OS handler; assigning
  // location.href gets swallowed by some browsers when no handler is set up.
  const link = el('a', { href })
  document.body.append(link)
  link.click()
  link.remove()
  return href
}

export default function ordersScreen(ctx) {
  rollShiftIfDue()
  const orders = shop.orders
  const ends = new Date(shiftEndsAt())

  const orderCard = (order) =>
    el(
      'article.ordercard',
      null,
      el(
        'div.ordercard__top',
        null,
        // The amount is its own column so a long customer name can wrap
        // underneath without shoving the total onto a line of its own.
        el(
          'div.ordercard__who',
          null,
          el('strong.ordercard__no', null, order.orderNo),
          el('span.ordercard__name', null, order.customer),
          el('span.tagpill', null, order.orderType),
        ),
        el('span.ordercard__amt', null, money(order.total)),
      ),
      el(
        'div.ordercard__mid',
        null,
        el(
          'span',
          null,
          new Date(order.at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        ),
        el('span', null, 'by ' + order.cashier),
        el('span.ordercard__pay', null, order.payment),
      ),
      el(
        'ul.ordercard__lines',
        null,
        order.lines.map((line) =>
          el(
            'li',
            null,
            el('span.ordercard__q', null, line.qty + '×'),
            line.name,
            line.sizeLabel !== '—' ? el('em', null, ' ' + line.sizeLabel) : null,
            el('span.ordercard__lt', null, money(line.total)),
          ),
        ),
      ),
    )

  /* --- paging ----------------------------------------------------------- */

  const list = el('div.orders__list')
  const more = el('div.orders__more')
  let shown = 0

  /** Appends the next page in place — no full re-render, so it stays cheap. */
  const showMore = () => {
    const next = orders.slice(shown, shown + PAGE)
    list.append(...next.map(orderCard))
    shown += next.length
    paintMore()
  }

  const paintMore = () => {
    const left = orders.length - shown
    if (left > 0) {
      more.replaceChildren(
        el('span.orders__shown', null, 'Showing ' + shown + ' of ' + orders.length),
        el(
          'button.btn.btn--ghost',
          { onclick: showMore },
          'Load ' + Math.min(PAGE, left) + ' more',
        ),
      )
    } else if (orders.length > PAGE) {
      more.replaceChildren(
        el('span.orders__shown', null, 'All ' + orders.length + ' orders shown'),
      )
    } else {
      more.replaceChildren()
    }
  }

  if (orders.length) showMore()

  const screen = el(
    'div.orders',
    null,
    el(
      'div.orders__bar',
      null,
      el(
        'div.orders__stats',
        null,
        stat(String(orders.length), orders.length === 1 ? 'order' : 'orders'),
        stat(money(ordersTotal()), 'sales'),
        stat(
          ends.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          'log clears at',
        ),
      ),
      el(
        'div.orders__actions',
        null,
        el(
          'button.btn.btn--ghost',
          { onclick: () => downloadCsv(orders), disabled: !orders.length },
          'Download CSV',
        ),
        el(
          'button.btn.btn--ghost',
          { onclick: () => mailOrders(orders), disabled: !orders.length },
          'Mail details',
        ),
        el(
          'button.btn.btn--danger',
          {
            disabled: !orders.length,
            onclick: async () => {
              const go = await confirmDialog({
                title: 'Clear the order log?',
                message:
                  'All ' +
                  orders.length +
                  ' orders in this window are removed and a fresh 12-hour window starts. Download the CSV first if you need it — this cannot be undone.',
                confirm: 'Clear log',
                cancel: 'Keep it',
                danger: true,
              })
              if (go) {
                clearOrders()
                ctx.refresh()
              }
            },
          },
          'Clear log',
        ),
      ),
    ),
    orders.length ? list : el(
      'p.orders__empty',
      null,
      'No orders in this window yet. The log clears itself every 12 hours.',
    ),
    orders.length ? more : null,
    el(
      'div.navbar',
      null,
      el('button.btn.btn--ghost.btn--lg', { onclick: () => ctx.go('order') }, '← Back to counter'),
    ),
  )

  screen.chrome = {
    title: 'All orders',
    subtitle: 'Since ' + new Date(shop.shiftStartedAt).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
  return screen
}

function stat(value, label) {
  return el('div.stat', null, el('strong.stat__value', null, value), el('span.stat__label', null, label))
}
