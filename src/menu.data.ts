/**
 * GENERATED FILE — do not edit by hand.
 *
 * Copied from POS/src/js/data.js, the counter till's factory menu, which is
 * transcribed from the boards on the cart. Change the menu there and run
 * `pnpm sync:menu`; the website picks the change up on the next build.
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
  { id: 'momos', label: 'Momos', kicker: 'Steamed to perfection' },
  { id: 'chillers', label: 'Chillers', kicker: 'Cool. Fresh. Flat ₹59.' },
  { id: 'bites', label: 'Burgers & Fries', kicker: 'Good food. Good mood.' },
  { id: 'basics', label: 'Basics', kicker: 'Cold drinks & water' },
]

export const posItems: PosItem[] = [
  { id: 'm-steam-veg', cat: 'momos', group: 'Steam Momo', name: 'Veg', note: null, half: 30, full: 60, addon: null },
  { id: 'm-steam-paneer', cat: 'momos', group: 'Steam Momo', name: 'Paneer', note: null, half: 35, full: 70, addon: null },
  { id: 'm-steam-corn', cat: 'momos', group: 'Steam Momo', name: 'Cheese Corn', note: null, half: 60, full: 120, addon: null },
  { id: 'm-steam-chicken', cat: 'momos', group: 'Steam Momo', name: 'Chicken', note: null, half: 35, full: 70, addon: null },
  { id: 'm-kurkure-veg', cat: 'momos', group: 'Kurkure Momo', name: 'Veg', note: null, half: 40, full: 80, addon: null },
  { id: 'm-kurkure-paneer', cat: 'momos', group: 'Kurkure Momo', name: 'Paneer', note: null, half: 50, full: 100, addon: null },
  { id: 'm-kurkure-corn', cat: 'momos', group: 'Kurkure Momo', name: 'Cheese Corn', note: null, half: 70, full: 140, addon: null },
  { id: 'm-kurkure-chicken', cat: 'momos', group: 'Kurkure Momo', name: 'Chicken', note: null, half: 50, full: 100, addon: null },
  { id: 'm-peri-veg', cat: 'momos', group: 'Peri Peri Momo', name: 'Veg', note: null, half: 50, full: 100, addon: null },
  { id: 'm-peri-paneer', cat: 'momos', group: 'Peri Peri Momo', name: 'Paneer', note: null, half: 60, full: 120, addon: null },
  { id: 'm-peri-corn', cat: 'momos', group: 'Peri Peri Momo', name: 'Cheese Corn', note: null, half: 80, full: 160, addon: null },
  { id: 'm-peri-chicken', cat: 'momos', group: 'Peri Peri Momo', name: 'Chicken', note: null, half: 60, full: 120, addon: null },
  { id: 'm-afghani-veg', cat: 'momos', group: 'Afghani Momo', name: 'Veg', note: null, half: 50, full: 100, addon: null },
  { id: 'm-afghani-paneer', cat: 'momos', group: 'Afghani Momo', name: 'Paneer', note: null, half: 60, full: 120, addon: null },
  { id: 'm-afghani-corn', cat: 'momos', group: 'Afghani Momo', name: 'Cheese Corn', note: null, half: 80, full: 160, addon: null },
  { id: 'm-afghani-chicken', cat: 'momos', group: 'Afghani Momo', name: 'Chicken', note: null, half: 60, full: 120, addon: null },
  { id: 'm-chilli-veg', cat: 'momos', group: 'Chilli Momo', name: 'Veg', note: null, half: 50, full: 100, addon: null },
  { id: 'm-chilli-paneer', cat: 'momos', group: 'Chilli Momo', name: 'Paneer', note: null, half: 60, full: 120, addon: null },
  { id: 'm-chilli-corn', cat: 'momos', group: 'Chilli Momo', name: 'Cheese Corn', note: null, half: 80, full: 160, addon: null },
  { id: 'm-chilli-chicken', cat: 'momos', group: 'Chilli Momo', name: 'Chicken', note: null, half: 60, full: 120, addon: null },
  { id: 'c-og', cat: 'chillers', group: null, name: 'OG Refresher', note: 'Virgin mojito', half: null, full: 59, addon: null },
  { id: 'c-mint', cat: 'chillers', group: null, name: 'Mint Blast', note: null, half: null, full: 59, addon: null },
  { id: 'c-blue', cat: 'chillers', group: null, name: 'Blue Wave', note: null, half: null, full: 59, addon: null },
  { id: 'c-mango', cat: 'chillers', group: null, name: 'Mango Masti', note: null, half: null, full: 59, addon: null },
  { id: 'c-kairi', cat: 'chillers', group: null, name: 'Kairi Kick', note: null, half: null, full: 59, addon: null },
  { id: 'c-berry', cat: 'chillers', group: null, name: 'Berry Breeze', note: null, half: null, full: 59, addon: null },
  { id: 'c-berrylicious', cat: 'chillers', group: null, name: 'Berrylicious', note: null, half: null, full: 59, addon: null },
  { id: 'c-pineapple', cat: 'chillers', group: null, name: 'Pineapple Punch', note: null, half: null, full: 59, addon: null },
  { id: 'c-colada', cat: 'chillers', group: null, name: 'Piña Colada', note: 'Pineapple + coconut', half: null, full: 59, addon: null },
  { id: 'b-hero', cat: 'bites', group: 'Burgers', name: 'Hazy Hero', note: 'Veg burger', half: null, full: 49, addon: { name: 'Add cheese', price: 15 } },
  { id: 'b-hunter', cat: 'bites', group: 'Burgers', name: 'Hazy Hunter', note: 'Chicken burger', half: null, full: 69, addon: { name: 'Add cheese', price: 15 } },
  { id: 'b-fries', cat: 'bites', group: 'Fries', name: 'Classic Fries', note: null, half: null, full: 49, addon: null },
  { id: 'b-peri-fries', cat: 'bites', group: 'Fries', name: 'Peri Peri Fries', note: null, half: null, full: 59, addon: null },
  { id: 'b-combo-veg', cat: 'bites', group: 'Make it a meal', name: 'Veg Combo', note: 'Classic fries + veg burger + any mocktail', half: null, full: 129, addon: { name: 'Add cheese', price: 15 } },
  { id: 'b-combo-nonveg', cat: 'bites', group: 'Make it a meal', name: 'Non Veg Combo', note: 'Classic fries + chicken burger + any mocktail', half: null, full: 149, addon: { name: 'Add cheese', price: 15 } },
  { id: 'x-coke', cat: 'basics', group: null, name: 'Coca-Cola 250 ml', note: null, half: null, full: 25, addon: null },
  { id: 'x-sprite', cat: 'basics', group: null, name: 'Sprite 250 ml', note: null, half: null, full: 25, addon: null },
  { id: 'x-thumsup', cat: 'basics', group: null, name: 'Thums Up 600 ml', note: null, half: null, full: 40, addon: null },
  { id: 'x-water-1l', cat: 'basics', group: null, name: 'Mineral water 1 L', note: null, half: null, full: 20, addon: null },
  { id: 'x-water-500', cat: 'basics', group: null, name: 'Mineral water 500 ml', note: null, half: null, full: 10, addon: null },
]
