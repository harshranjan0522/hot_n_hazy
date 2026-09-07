/**
 * Home screen: the four sections stack vertically, and nothing scrolls
 * sideways — every section wraps to fit whatever width the counter screen has.
 *
 * A section the menu board splits into styles (Momos → Steam / Kurkure / …,
 * Bites → Burgers / Fries / Combos) becomes one row per style: the style name
 * on the left, its variants running across. That is how the board reads. A
 * section with no styles is a plain wrapping grid of tiles.
 */

import { el, money } from '../ui.js'
import { CATEGORIES } from '../data.js'
import { groupsInCategory, qtyOfItem, cartCount, cartTotal } from '../store.js'
import { openItemModal } from '../components/itemmodal.js'
import { openCartSheet } from '../components/cartsheet.js'

export default function orderScreen(ctx) {
  const tile = (item) => {
    const inCart = qtyOfItem(item.id)
    return el(
      'button.tile' + (inCart ? '.is-in' : ''),
      { onclick: () => openItemModal(item, ctx.refresh) },
      inCart ? el('span.tile__badge', null, String(inCart)) : null,
      el('span.tile__name', null, item.name),
      item.note ? el('span.tile__note', null, item.note) : null,
      el(
        'span.tile__price',
        null,
        item.half != null
          ? [
              el('span.tile__pair', null, el('em', null, 'H'), money(item.half)),
              el('span.tile__pair', null, el('em', null, 'F'), money(item.full)),
            ]
          : money(item.full),
      ),
    )
  }

  const row = (g) =>
    el(
      'div.row',
      null,
      el('h3.row__label', null, g.label),
      el('div.row__items', null, g.items.map(tile)),
    )

  const section = (cat) => {
    const groups = groupsInCategory(cat.id)
    const grouped = groups.some((g) => g.label)

    let body
    if (!groups.length) {
      body = el('p.cat__empty', null, 'Nothing here yet — add items in the admin window.')
    } else if (grouped) {
      body = el('div.cat__rows', null, groups.map(row))
    } else {
      body = el('div.cat__grid', null, groups[0].items.map(tile))
    }

    return el(
      'section.cat',
      null,
      el(
        'div.cat__head',
        null,
        el('h2.cat__label', null, cat.label),
        el('span.cat__kicker', null, cat.kicker),
      ),
      body,
    )
  }

  const count = cartCount()

  const screen = el(
    'div.order',
    null,
    el('div.order__cats', null, CATEGORIES.map(section)),
    count > 0
      ? el(
          'div.proceedbar',
          null,
          el(
            'button.cartchip',
            { onclick: () => openCartSheet(ctx.refresh) },
            el('span.cartchip__count', null, String(count)),
            count === 1 ? 'item' : 'items',
            el('span.cartchip__total', null, money(cartTotal())),
            el('span.cartchip__hint', null, 'tap to edit'),
          ),
          el('button.btn.btn--go.btn--lg', { onclick: () => ctx.go('customer') }, 'Proceed →'),
        )
      : null,
  )

  screen.chrome = { title: 'New order', subtitle: 'Tap an item to add it' }
  return screen
}
