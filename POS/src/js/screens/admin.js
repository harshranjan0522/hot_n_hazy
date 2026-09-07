/**
 * Admin window — everything editable in one place: prices, item names,
 * add/delete items, the people who can log in, and the report email.
 *
 * Edits commit on change (blur or Enter) and write straight through to
 * localStorage. Deliberately no re-render on keystroke: that would steal focus
 * mid-typing. Adds and deletes do re-render, because the list shape changed.
 */

import { el, money } from '../ui.js'
import {
  shop,
  saveShop,
  groupsInCategory,
  groupNames,
  itemsInCategory,
  updateItem,
  addItem,
  deleteItem,
  addUser,
  updateUser,
  deleteUser,
  resetMenuToDefaults,
} from '../store.js'
import { CATEGORIES } from '../data.js'

/** Blank ("no half plate") is a meaningful value, so it is not coerced to 0. */
function readPrice(input, { allowBlank }) {
  const raw = input.value.trim()
  if (!raw) return allowBlank ? null : NaN
  const n = Number(raw)
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : NaN
}

export default function adminScreen(ctx) {
  const itemRow = (item) => {
    const name = el('input.adm__name', {
      type: 'text',
      value: item.name,
      onchange: () => {
        const next = name.value.trim()
        if (!next) {
          name.value = item.name // an unnamed item is not orderable
          return
        }
        updateItem(item.id, { name: next })
      },
    })

    const half = el('input.adm__price', {
      type: 'number',
      min: '0',
      step: '5',
      placeholder: '—',
      value: item.half == null ? '' : item.half,
      onchange: () => {
        const next = readPrice(half, { allowBlank: true })
        if (Number.isNaN(next)) {
          half.value = item.half == null ? '' : item.half
          return
        }
        updateItem(item.id, { half: next })
      },
    })

    const full = el('input.adm__price', {
      type: 'number',
      min: '0',
      step: '5',
      value: item.full,
      onchange: () => {
        const next = readPrice(full, { allowBlank: false })
        if (Number.isNaN(next)) {
          full.value = item.full
          return
        }
        updateItem(item.id, { full: next })
      },
    })

    const addon = item.addon
      ? el('input.adm__price', {
          type: 'number',
          min: '0',
          step: '5',
          value: item.addon.price,
          onchange: () => {
            const next = readPrice(addon, { allowBlank: false })
            if (Number.isNaN(next)) {
              addon.value = item.addon.price
              return
            }
            updateItem(item.id, { addon: { ...item.addon, price: next } })
          },
        })
      : null

    return el(
      'div.adm__row',
      null,
      name,
      el('label.adm__cell', null, el('span', null, 'Half'), half),
      el('label.adm__cell', null, el('span', null, 'Full'), full),
      addon && el('label.adm__cell', null, el('span', null, '+ ' + item.addon.name.replace(/^Add /i, '')), addon),
      el(
        'button.adm__del',
        {
          'aria-label': 'Delete ' + item.name,
          onclick: () => {
            if (window.confirm('Delete "' + item.name + '" from the menu?')) {
              deleteItem(item.id)
              ctx.refresh()
            }
          },
        },
        '🗑',
      ),
    )
  }

  /** Adding an item: name, which sub-group it joins, and its prices. */
  const addRow = (cat) => {
    const listId = 'groups-' + cat.id
    const name = el('input.adm__name', { type: 'text', placeholder: 'New item name' })
    const group = el('input.adm__group-input', {
      type: 'text',
      placeholder: 'Group (optional)',
      list: listId,
    })
    const half = el('input.adm__price', { type: 'number', min: '0', step: '5', placeholder: '—' })
    const full = el('input.adm__price', { type: 'number', min: '0', step: '5', placeholder: '0' })

    const submit = () => {
      const label = name.value.trim()
      const fullPrice = readPrice(full, { allowBlank: false })
      if (!label || Number.isNaN(fullPrice)) {
        window.alert('Give the item a name and a full price.')
        return
      }
      const halfPrice = readPrice(half, { allowBlank: true })
      addItem({
        name: label,
        cat: cat.id,
        group: group.value.trim(),
        half: Number.isNaN(halfPrice) ? null : halfPrice,
        full: fullPrice,
      })
      ctx.refresh()
    }

    return el(
      'div.adm__row.adm__row--add',
      null,
      name,
      group,
      el(
        'datalist',
        { id: listId },
        groupNames(cat.id).map((g) => el('option', { value: g })),
      ),
      el('label.adm__cell', null, el('span', null, 'Half'), half),
      el('label.adm__cell', null, el('span', null, 'Full'), full),
      el('button.adm__add', { onclick: submit }, '+ Add'),
    )
  }

  const catBlock = (cat) => {
    const items = itemsInCategory(cat.id)
    return el(
      'section.adm__block',
      null,
      el(
        'div.adm__blockhead',
        null,
        el('h2', null, cat.label),
        el(
          'span.adm__count',
          null,
          items.length + (items.length === 1 ? ' item' : ' items'),
        ),
      ),
      el('p.adm__hint', null, 'Leave Half blank for anything sold as a single size.'),
      groupsInCategory(cat.id).map((g) =>
        el(
          'div.adm__group',
          null,
          g.label ? el('h3.adm__grouplabel', null, g.label) : null,
          g.items.map(itemRow),
        ),
      ),
      addRow(cat),
    )
  }

  /* --- users ------------------------------------------------------------ */

  const userRow = (user) => {
    const name = el('input.adm__name', {
      type: 'text',
      value: user.name,
      onchange: () => {
        const next = name.value.trim()
        if (!next) {
          name.value = user.name
          return
        }
        updateUser(user.id, { name: next })
      },
    })

    const pin = el('input.adm__pin', {
      type: 'text',
      inputmode: 'numeric',
      maxLength: 4,
      value: user.pin,
      onchange: () => {
        const next = pin.value.trim()
        if (!/^[0-9]{4}$/.test(next)) {
          pin.value = user.pin
          window.alert('A PIN has to be exactly 4 digits.')
          return
        }
        updateUser(user.id, { pin: next })
      },
    })

    return el(
      'div.adm__row',
      null,
      name,
      el('label.adm__cell', null, el('span', null, 'PIN'), pin),
      el(
        'button.adm__del',
        {
          'aria-label': 'Remove ' + user.name,
          onclick: () => {
            if (!window.confirm('Remove ' + user.name + ' from the counter?')) return
            if (!deleteUser(user.id)) {
              window.alert('At least one person has to be able to log in.')
              return
            }
            ctx.refresh()
          },
        },
        '🗑',
      ),
    )
  }

  const addUserRow = () => {
    const name = el('input.adm__name', { type: 'text', placeholder: 'New user name' })
    const pin = el('input.adm__pin', {
      type: 'text',
      inputmode: 'numeric',
      maxLength: 4,
      placeholder: '0000',
    })
    const submit = () => {
      const label = name.value.trim()
      const code = pin.value.trim()
      if (!label || !/^[0-9]{4}$/.test(code)) {
        window.alert('Enter a name and a 4-digit PIN.')
        return
      }
      addUser({ name: label, pin: code })
      ctx.refresh()
    }
    return el(
      'div.adm__row.adm__row--add',
      null,
      name,
      el('label.adm__cell', null, el('span', null, 'PIN'), pin),
      el('button.adm__add', { onclick: submit }, '+ Add'),
    )
  }

  /* --- settings --------------------------------------------------------- */

  const email = el('input.adm__name', {
    type: 'email',
    placeholder: 'owner@example.com',
    value: shop.reportEmail || '',
    onchange: () => {
      shop.reportEmail = email.value.trim()
      saveShop()
    },
  })

  const screen = el(
    'div.adm',
    null,
    el(
      'p.adm__lead',
      null,
      'Everything below is live — changes hit the counter as soon as you leave the box.',
    ),
    CATEGORIES.map(catBlock),
    el(
      'section.adm__block',
      null,
      el('div.adm__blockhead', null, el('h2', null, 'Who can log in')),
      shop.users.map(userRow),
      addUserRow(),
    ),
    el(
      'section.adm__block',
      null,
      el('div.adm__blockhead', null, el('h2', null, 'Reports')),
      el(
        'p.adm__hint',
        null,
        'Where "Mail details" on the All orders screen sends the shift report.',
      ),
      el('div.adm__row', null, el('label.adm__cell.adm__cell--wide', null, el('span', null, 'Email'), email)),
      el(
        'div.adm__row',
        null,
        el(
          'button.btn.btn--ghost',
          { onclick: () => ctx.go('orders') },
          'Open all orders',
        ),
      ),
    ),
    el(
      'section.adm__block',
      null,
      el('div.adm__blockhead', null, el('h2', null, 'Danger zone')),
      el(
        'p.adm__hint',
        null,
        'Next order number is ',
        el('strong', null, '#hazy' + String(shop.nextOrderNo).padStart(4, '0')),
        ' · menu value ',
        el('strong', null, money(shop.items.reduce((s, i) => s + i.full, 0))),
        '.',
      ),
      el(
        'div.adm__row',
        null,
        el(
          'button.btn.btn--danger',
          {
            onclick: () => {
              if (window.confirm('Throw away every menu edit and restore the original list?')) {
                resetMenuToDefaults()
                ctx.refresh()
              }
            },
          },
          'Reset menu to defaults',
        ),
      ),
    ),
    el(
      'div.navbar',
      null,
      el('button.btn.btn--go.btn--lg', { onclick: () => ctx.go('order') }, 'Switch to user view →'),
    ),
  )

  screen.chrome = { title: 'Admin window', subtitle: 'Menu, prices & users' }
  return screen
}
