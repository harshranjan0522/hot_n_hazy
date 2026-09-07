/**
 * Item popup: half/full → any add-on → quantity → Done/Cancel.
 * Items with one size only (drinks, burgers, combos) skip the size step; the
 * add-on row shows up only for items that actually have one (cheese on the two
 * burgers).
 */

import { el, money, lockScroll } from '../ui.js'
import { addToCart, priceFor, fullName } from '../store.js'

export function openItemModal(item, onAdded) {
  const hasSizes = item.half != null
  let size = hasSizes ? 'half' : 'full'
  let addon = false
  let qty = 1

  const sizeRow = el('div.modal__sizes')
  const addonRow = item.addon ? el('div.modal__addon') : null
  const qtyValue = el('span.stepper__value', null, '1')
  const lineTotal = el('strong.modal__total')
  let overlay

  const close = () => {
    overlay.remove()
    lockScroll(false)
    document.removeEventListener('keydown', onKey)
  }

  const sizeButton = (value, label, price) =>
    el(
      'button.sizebtn' + (size === value ? '.is-on' : ''),
      {
        onclick: () => {
          size = value
          paint()
        },
      },
      el('span.sizebtn__label', null, label),
      el('span.sizebtn__price', null, money(price)),
    )

  const paint = () => {
    if (hasSizes) {
      sizeRow.replaceChildren(
        sizeButton('half', 'Half', item.half),
        sizeButton('full', 'Full', item.full),
      )
    }
    if (addonRow) {
      addonRow.replaceChildren(
        el(
          'button.addonbtn' + (addon ? '.is-on' : ''),
          {
            onclick: () => {
              addon = !addon
              paint()
            },
            'aria-pressed': addon ? 'true' : 'false',
          },
          el('span.addonbtn__box', null, addon ? '✓' : ''),
          el('span.addonbtn__label', null, item.addon.name),
          el('span.addonbtn__price', null, '+' + money(item.addon.price)),
        ),
      )
    }
    qtyValue.textContent = String(qty)
    lineTotal.textContent = money(priceFor(item, size, addon) * qty)
  }

  const step = (by) => {
    qty = Math.min(99, Math.max(1, qty + by))
    paint()
  }

  const done = () => {
    addToCart(item.id, hasSizes ? size : 'full', qty, addon)
    close()
    onAdded()
  }

  const onKey = (e) => {
    if (e.key === 'Escape') close()
    else if (e.key === 'Enter') done()
    else if (e.key === 'ArrowUp' || e.key === '+') step(1)
    else if (e.key === 'ArrowDown' || e.key === '-') step(-1)
  }

  overlay = el(
    'div.modal',
    { onclick: (e) => { if (e.target === overlay) close() } },
    el(
      'div.modal__card',
      { role: 'dialog', 'aria-modal': 'true', 'aria-label': fullName(item) },
      el('h3.modal__name', null, fullName(item)),
      item.note ? el('p.modal__note', null, item.note) : null,
      hasSizes
        ? el('p.modal__step', null, 'Half or full?')
        : el('p.modal__step', null, money(item.full) + ' each'),
      hasSizes && sizeRow,
      addonRow && el('p.modal__step', null, 'Anything extra?'),
      addonRow,
      el('p.modal__step', null, 'How many?'),
      el(
        'div.stepper',
        null,
        el('button.stepper__btn', { onclick: () => step(-1), 'aria-label': 'Less' }, '−'),
        qtyValue,
        el('button.stepper__btn', { onclick: () => step(1), 'aria-label': 'More' }, '+'),
      ),
      el('p.modal__sum', null, 'Line total ', lineTotal),
      el(
        'div.modal__actions',
        null,
        el('button.btn.btn--ghost', { onclick: close }, 'Cancel'),
        el('button.btn.btn--go', { onclick: done }, 'Done'),
      ),
    ),
  )

  paint()
  document.body.append(overlay)
  lockScroll(true)
  document.addEventListener('keydown', onKey)
  overlay.querySelector('.sizebtn, .addonbtn, .stepper__btn')?.focus()
}
