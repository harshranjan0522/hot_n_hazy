/**
 * Item popup: how many of each size → any add-on → Done/Cancel.
 *
 * A half plate and a full plate are two separate lines on the bill, so each
 * size carries its own counter. It used to be one selector plus one quantity,
 * which meant reaching for Full after dialling in a Half silently turned that
 * half into a full instead of adding to it.
 *
 * Items with one size only (drinks, burgers, combos) get a single counter; the
 * add-on row shows up only for items that actually have one (cheese on the two
 * burgers).
 */

import { el, money, lockScroll } from '../ui.js'
import { addToCart, priceFor, fullName } from '../store.js'

export function openItemModal(item, onAdded) {
  const hasSizes = item.half != null
  const sizes = hasSizes ? ['half', 'full'] : ['full']
  /** One count per size. Half is the usual order, so it starts on 1. */
  const counts = hasSizes ? { half: 1, full: 0 } : { full: 1 }
  let addon = false
  /** The row the keyboard's +/− and arrows step. Follows the last tap. */
  let keySize = sizes[0]

  const lineTotal = el('strong.modal__total')
  const doneBtn = el('button.btn.btn--go', { onclick: () => done() }, 'Done')
  let overlay

  const close = () => {
    overlay.remove()
    lockScroll(false)
    document.removeEventListener('keydown', onKey)
  }

  const step = (size, by) => {
    counts[size] = Math.min(99, Math.max(0, counts[size] + by))
    keySize = size
    paint()
  }

  const totalQty = () => sizes.reduce((sum, s) => sum + counts[s], 0)
  const totalMoney = () =>
    sizes.reduce((sum, s) => sum + priceFor(item, s, addon) * counts[s], 0)

  /**
   * Rows are built once and only repainted in place — rebuilding them on every
   * tap would throw away the focus of the very button just pressed.
   */
  const stepperFor = (size, label) => {
    const value = el('span.stepper__value', null, String(counts[size]))
    return {
      value,
      node: el(
        'div.stepper' + (hasSizes ? '.stepper--row' : ''),
        null,
        el(
          'button.stepper__btn',
          { onclick: () => step(size, -1), 'aria-label': 'One less ' + label },
          '−',
        ),
        value,
        el(
          'button.stepper__btn',
          { onclick: () => step(size, 1), 'aria-label': 'One more ' + label },
          '+',
        ),
      ),
    }
  }

  const sizeRow = (size, label) => {
    const stepper = stepperFor(size, label)
    const node = el(
      'div.sizeline',
      null,
      el(
        'div.sizeline__what',
        null,
        el('span.sizeline__label', null, label),
        el('span.sizeline__price', null, money(priceFor(item, size)) + ' each'),
      ),
      stepper.node,
    )
    return {
      node,
      paint: () => {
        stepper.value.textContent = String(counts[size])
        node.classList.toggle('is-on', counts[size] > 0)
      },
    }
  }

  let rows
  if (hasSizes) {
    rows = [sizeRow('half', 'Half'), sizeRow('full', 'Full')]
  } else {
    const stepper = stepperFor('full', 'item')
    rows = [{ node: stepper.node, paint: () => { stepper.value.textContent = String(counts.full) } }]
  }

  let addonRow = null
  let paintAddon = () => {}
  if (item.addon) {
    const box = el('span.addonbtn__box')
    const button = el(
      'button.addonbtn',
      {
        onclick: () => {
          addon = !addon
          paint()
        },
      },
      box,
      el('span.addonbtn__label', null, item.addon.name),
      el('span.addonbtn__price', null, '+' + money(item.addon.price)),
    )
    addonRow = el('div.modal__addon', null, button)
    paintAddon = () => {
      button.classList.toggle('is-on', addon)
      button.setAttribute('aria-pressed', addon ? 'true' : 'false')
      box.textContent = addon ? '✓' : ''
    }
  }

  const paint = () => {
    for (const row of rows) row.paint()
    paintAddon()
    lineTotal.textContent = money(totalMoney())
    doneBtn.disabled = totalQty() === 0
  }

  const done = () => {
    if (totalQty() === 0) return
    for (const size of sizes) {
      if (counts[size] > 0) addToCart(item.id, size, counts[size], addon)
    }
    close()
    onAdded()
  }

  const onKey = (e) => {
    if (e.key === 'Escape') close()
    else if (e.key === 'Enter') done()
    else if (e.key === 'ArrowUp' || e.key === '+') step(keySize, 1)
    else if (e.key === 'ArrowDown' || e.key === '-') step(keySize, -1)
    else if (hasSizes && (e.key === 'h' || e.key === 'H')) step('half', 1)
    else if (hasSizes && (e.key === 'f' || e.key === 'F')) step('full', 1)
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
        ? el('p.modal__step', null, 'How many of each?')
        : el('p.modal__step', null, money(item.full) + ' each — how many?'),
      el('div.modal__sizes', null, rows.map((r) => r.node)),
      addonRow && el('p.modal__step', null, 'Anything extra?'),
      addonRow,
      el('p.modal__sum', null, 'Line total ', lineTotal),
      el(
        'div.modal__actions',
        null,
        el('button.btn.btn--ghost', { onclick: close }, 'Cancel'),
        doneBtn,
      ),
    ),
  )

  paint()
  document.body.append(overlay)
  lockScroll(true)
  document.addEventListener('keydown', onKey)
  overlay.querySelector('.stepper__btn')?.focus()
}
