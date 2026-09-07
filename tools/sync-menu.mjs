#!/usr/bin/env node
// Copies the counter's menu into the website so the two can never disagree.
//
// The till (POS/src/js/data.js) is transcribed from the boards on the cart
// itself, which makes it the only honest source for what is sold and what it
// costs. This script reads it and writes src/menu.data.ts — names, notes,
// groups and prices, nothing else. Staff and PINs live in the same module and
// are deliberately not copied, so they can never reach the public bundle.
//
// Run with: pnpm sync:menu   (also runs as part of pnpm build)
// Pass --check to fail instead of writing when the copy is stale.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { CATEGORIES, DEFAULT_ITEMS } from '../POS/src/js/data.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'src', 'menu.data.ts')

/** Single-quoted TS string literal, matching the style of the hand-written source. */
const str = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"

/** `undefined` and `''` both mean "the board doesn't say", and become null. */
const opt = (v) => (v == null || v === '' ? 'null' : str(v))

const category = (c) => `  { id: ${str(c.id)}, label: ${str(c.label)}, kicker: ${str(c.kicker)} },`

const item = (i) =>
  '  { ' +
  [
    `id: ${str(i.id)}`,
    `cat: ${str(i.cat)}`,
    `group: ${opt(i.group)}`,
    `name: ${str(i.name)}`,
    `note: ${opt(i.note)}`,
    `half: ${i.half == null ? 'null' : i.half}`,
    `full: ${i.full}`,
    `addon: ${i.addon ? `{ name: ${str(i.addon.name)}, price: ${i.addon.price} }` : 'null'}`,
  ].join(', ') +
  ' },'

const file = `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Copied from POS/src/js/data.js, the counter till's factory menu, which is
 * transcribed from the boards on the cart. Change the menu there and run
 * \`pnpm sync:menu\`; the website picks the change up on the next build.
 *
 * Voice — blurbs, artwork, tags — is not here. That lives in src/content.ts
 * and is keyed by the ids below.
 */

export type PosCategory = {
  id: string
  label: string
  kicker: string
}

export type PosItem = {
  id: string
  cat: string
  /** Sub-heading on the board ("Steam Momo", "Burgers"), or null. */
  group: string | null
  name: string
  note: string | null
  /** Half-plate price. null when the item is sold in one size only. */
  half: number | null
  full: number
  /** An extra the counter offers on this item, such as cheese on a burger. */
  addon: { name: string; price: number } | null
}

/** Board order — the order the sections stack on the till's home screen. */
export const posCategories: PosCategory[] = [
${CATEGORIES.map(category).join('\n')}
]

export const posItems: PosItem[] = [
${DEFAULT_ITEMS.map(item).join('\n')}
]
`

const check = process.argv.includes('--check')
const current = existsSync(out) ? readFileSync(out, 'utf8') : null

if (current === file) {
  console.log('sync-menu: src/menu.data.ts is up to date' + ` (${DEFAULT_ITEMS.length} items)`)
  process.exit(0)
}

if (check) {
  console.error('sync-menu: src/menu.data.ts is stale — run `pnpm sync:menu` and commit the result')
  process.exit(1)
}

writeFileSync(out, file)
console.log(`sync-menu: wrote src/menu.data.ts (${CATEGORIES.length} sections, ${DEFAULT_ITEMS.length} items)`)
