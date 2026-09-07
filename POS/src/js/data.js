/**
 * Factory defaults for the counter — transcribed from the menu boards on the
 * cart itself (Momos, Chillers and Bites), so the prices here are the real
 * ones, not estimates. Everything is still editable from the admin window at
 * runtime, and those edits live in localStorage.
 *
 * Item shape:
 *   group  — optional sub-heading inside a section, matching the board layout
 *            ("Steam Momo", "Burgers", "Make it a meal").
 *   name   — what the tile says. Inside a group that is just the variant.
 *   half   — null when the item is sold in one size only.
 *   addon  — an optional extra the popup offers (cheese on a burger).
 */

/** Section order here is the order they stack on the home screen. */
export const CATEGORIES = [
  { id: 'momos', label: 'Momos', kicker: 'Steamed to perfection' },
  { id: 'chillers', label: 'Chillers', kicker: 'Cool. Fresh. Flat ₹59.' },
  { id: 'bites', label: 'Burgers & Fries', kicker: 'Good food. Good mood.' },
  { id: 'basics', label: 'Basics', kicker: 'Cold drinks & water' },
]

/**
 * Every momo style carries the same four fillings. Prices per the board:
 * paneer and chicken match, cheese corn is ₹30 over veg on a half, and a full
 * is always twice the half.
 */
const MOMO_STYLES = [
  { group: 'Steam Momo', slug: 'steam', veg: 30, paneer: 35, corn: 60, chicken: 35 },
  { group: 'Kurkure Momo', slug: 'kurkure', veg: 40, paneer: 50, corn: 70, chicken: 50 },
  { group: 'Peri Peri Momo', slug: 'peri', veg: 50, paneer: 60, corn: 80, chicken: 60 },
  { group: 'Afghani Momo', slug: 'afghani', veg: 50, paneer: 60, corn: 80, chicken: 60 },
  { group: 'Chilli Momo', slug: 'chilli', veg: 50, paneer: 60, corn: 80, chicken: 60 },
]

/** Board order of the fillings, kept identical in every style. */
const MOMO_FILLINGS = [
  { key: 'veg', name: 'Veg' },
  { key: 'paneer', name: 'Paneer' },
  { key: 'corn', name: 'Cheese Corn' },
  { key: 'chicken', name: 'Chicken' },
]

const MOMO_ITEMS = MOMO_STYLES.flatMap((style) =>
  MOMO_FILLINGS.map((filling) => ({
    id: 'm-' + style.slug + '-' + filling.key,
    cat: 'momos',
    group: style.group,
    name: filling.name,
    half: style[filling.key],
    full: style[filling.key] * 2,
  })),
)

/** Every chiller is ₹59 — the board prices them as one flat rate. */
const CHILLER_NAMES = [
  ['og', 'OG Refresher', 'Virgin mojito'],
  ['mint', 'Mint Blast'],
  ['blue', 'Blue Wave'],
  ['mango', 'Mango Masti'],
  ['kairi', 'Kairi Kick'],
  ['berry', 'Berry Breeze'],
  ['berrylicious', 'Berrylicious'],
  ['pineapple', 'Pineapple Punch'],
  ['colada', 'Piña Colada', 'Pineapple + coconut'],
]

const CHILLER_ITEMS = CHILLER_NAMES.map(([slug, name, note]) => ({
  id: 'c-' + slug,
  cat: 'chillers',
  name,
  note,
  half: null,
  full: 59,
}))

export const DEFAULT_ITEMS = [
  ...MOMO_ITEMS,
  ...CHILLER_ITEMS,

  // Cheese is an add-on the popup offers, not a tile of its own — the board
  // prices it as "+15" against each burger, and it rides on the combos too.
  {
    id: 'b-hero',
    cat: 'bites',
    group: 'Burgers',
    name: 'Hazy Hero',
    note: 'Veg burger',
    half: null,
    full: 49,
    addon: { name: 'Add cheese', price: 15 },
  },
  {
    id: 'b-hunter',
    cat: 'bites',
    group: 'Burgers',
    name: 'Hazy Hunter',
    note: 'Chicken burger',
    half: null,
    full: 69,
    addon: { name: 'Add cheese', price: 15 },
  },

  { id: 'b-fries', cat: 'bites', group: 'Fries', name: 'Classic Fries', half: null, full: 49 },
  { id: 'b-peri-fries', cat: 'bites', group: 'Fries', name: 'Peri Peri Fries', half: null, full: 59 },

  {
    id: 'b-combo-veg',
    cat: 'bites',
    group: 'Make it a meal',
    name: 'Veg Combo',
    note: 'Classic fries + veg burger + any mocktail',
    half: null,
    full: 129,
    addon: { name: 'Add cheese', price: 15 },
  },
  {
    id: 'b-combo-nonveg',
    cat: 'bites',
    group: 'Make it a meal',
    name: 'Non Veg Combo',
    note: 'Classic fries + chicken burger + any mocktail',
    half: null,
    full: 149,
    addon: { name: 'Add cheese', price: 15 },
  },

  { id: 'x-coke', cat: 'basics', name: 'Coca-Cola 250 ml', half: null, full: 25 },
  { id: 'x-sprite', cat: 'basics', name: 'Sprite 250 ml', half: null, full: 25 },
  { id: 'x-thumsup', cat: 'basics', name: 'Thums Up 600 ml', half: null, full: 40 },
  { id: 'x-water-1l', cat: 'basics', name: 'Mineral water 1 L', half: null, full: 20 },
  { id: 'x-water-500', cat: 'basics', name: 'Mineral water 500 ml', half: null, full: 10 },
]

/** The three people on the counter. PINs are changeable in the admin window. */
export const DEFAULT_USERS = [
  { id: 'u-aryan', name: 'Aryan', pin: '1111' },
  { id: 'u-gyani', name: 'Gyani', pin: '2222' },
  { id: 'u-ashwani', name: 'Ashwani', pin: '3333' },
]

export const SHOP = {
  name: "HOT N' HAZY",
  tagline: 'A little momo stop in Bokaro',
  address: "Near La Pino'z Pizza, City Centre, Sector 4",
  city: 'Bokaro Steel City, Jharkhand 827004',
}
