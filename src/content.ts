/**
 * Every real-world fact about the business lives here so there is one place to
 * correct it. Sources are noted per block — anything unsourced is voice/copy,
 * not a claim.
 */

import type { DishVariant } from './components/DishArt'
import { posCategories, posItems } from './menu.data'

/* --- verified listing details ------------------------------------------- */
export const business = {
  name: "Hot n' Hazy",
  tagline: 'Momos, mojitos & more',
  /** From the Google Business listing. */
  address: "Near La Pino'z Pizza, City Centre, Sector 4",
  city: 'Bokaro Steel City, Jharkhand 827004',
  /** From the owner's own description. Google's listing shows 5:00–9:30 PM. */
  hours: '5:30 PM – 10:00 PM',
  days: 'Monday – Sunday',
  instagram: 'https://www.instagram.com/hot.n.hazy/',
  instagramHandle: '@hot.n.hazy',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hot+n+Hazy+Bokaro+Steel+City',
  /** Google Maps place embed, supplied by the owner. */
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3654.2913010884818!2d86.14480927533332!3d23.665538478728337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f42300352f3d2b%3A0x151a34276098e2c3!2sHot%20n'%20Hazy!5e0!3m2!1sen!2sin!4v1788001564434!5m2!1sen!2sin",
  zomatoUrl: 'https://www.zomato.com/bokaro/hot-n-hazy-bokaro-locality/order',
  favhikerUrl:
    'https://www.favhiker.com/city/chas-522/restaurants/hot-n-hazy-chas-6a8c4b553ddd1e09e92562f2',
} as const

/** Ratings as published on each platform. Refresh these when they move. */
export const ratings = [
  { platform: 'Google', score: '4.7', count: '32 reviews' },
  { platform: 'Zomato', score: '4.5', count: '96 reviews' },
  { platform: 'Justdial', score: '4.8', count: '29 reviews' },
] as const

/* --- menu ---------------------------------------------------------------
 * The menu itself is NOT written here. Names, notes, sections and every price
 * come straight from the counter till (POS/src/js/data.js) by way of the
 * generated src/menu.data.ts, so the website and the board on the cart cannot
 * drift apart. Change a price on the till, run `pnpm sync:menu`, done.
 *
 * Two things the website deliberately does not take from the till: prices,
 * which belong on the board and on the counter rather than on a page that
 * goes stale, and the Basics section — nobody comes to a momo cart to read
 * about bottled water.
 *
 * What lives here is voice: which drawing a card shows, how hot it is, the
 * line of copy under the name. Those are keyed by the till's own ids, and
 * anything the till adds that has no entry still shows up — with plain art
 * and a plain line — rather than quietly going missing.
 * ---------------------------------------------------------------------- */

export type MenuCard = {
  id: string
  /** The board's sub-heading above this card — "Burgers", "Make it a meal". */
  group?: string
  name: string
  note?: string
  blurb: string
  heat: 0 | 1 | 2 | 3
  tag?: string
  art: DishVariant
  /** The fillings a momo style comes in, in board order. Empty for one dish. */
  fillings: string[]
  /** The counter sells this in two sizes. */
  halfOrFull: boolean
  /** An extra the counter offers, named but not priced. */
  addon?: string
}

export type MenuCategory = {
  id: string
  label: string
  kicker: string
  cards: MenuCard[]
}

type Look = {
  art: DishVariant
  heat: 0 | 1 | 2 | 3
  blurb: string
  tag?: string
}

/**
 * Momo styles. All four fillings of a style come out of the same basket and
 * are drawn the same way, so the style is the card and the fillings are its
 * price rows — exactly how the board reads.
 */
const STYLE_LOOKS: Record<string, Look> = {
  'Steam Momo': {
    art: 'steamed',
    heat: 0,
    blurb: 'Thin skin, juicy filling, straight out of the basket. The one every review starts with.',
    tag: 'Most loved',
  },
  'Kurkure Momo': {
    art: 'kurkure',
    heat: 1,
    blurb: 'Crumb-coated and deep fried — the crunch you can hear from the next table.',
    tag: 'Regulars order this',
  },
  'Peri Peri Momo': {
    art: 'peri',
    heat: 3,
    blurb: 'Dusted heavy with peri peri — tangy, salty and properly fiery.',
    tag: 'Top rated',
  },
  'Afghani Momo': {
    art: 'afghani',
    heat: 1,
    blurb: 'Creamy, smoky, mildly spiced gravy clinging to every fold.',
    tag: 'Top rated',
  },
  'Chilli Momo': {
    art: 'chilli',
    heat: 3,
    blurb: 'Tossed in a glossy, garlicky chilli sauce. This is where the “hot” comes from.',
  },
}

/** Everything else is one dish per card, keyed by the till's item id. */
const ITEM_LOOKS: Record<string, Look> = {
  /* chillers — flat ₹59, nine of them */
  'c-og': {
    art: 'chiller-og',
    heat: 0,
    blurb: 'Lime, mint, soda, crushed ice. The reset button between plates.',
  },
  'c-mint': {
    art: 'chiller-mint',
    heat: 0,
    blurb: 'Mint turned all the way up — cold enough to put the chilli momos out.',
  },
  'c-blue': {
    art: 'chiller-blue',
    heat: 0,
    blurb: 'Citrus and blue syrup over ice. The one that ends up in everyone’s photos.',
  },
  'c-mango': {
    art: 'chiller-mango',
    heat: 0,
    blurb: 'Thick mango shaken with lime and a glass full of ice.',
  },
  'c-kairi': {
    art: 'chiller-kairi',
    heat: 0,
    blurb: 'Raw mango and black salt. Sour first, salty after.',
  },
  'c-berry': {
    art: 'chiller-berry',
    heat: 0,
    blurb: 'Berry and lime, light enough to finish before the momos land.',
  },
  'c-berrylicious': {
    art: 'chiller-berrylicious',
    heat: 0,
    blurb: 'The berry one, doubled — deeper, sweeter, properly purple.',
  },
  'c-pineapple': {
    art: 'chiller-pineapple',
    heat: 0,
    blurb: 'Pineapple and lime with a bite of black salt behind it.',
  },
  'c-colada': {
    art: 'chiller-colada',
    heat: 0,
    blurb: 'Pineapple and coconut, poured thick. The dessert of the nine.',
  },

  /* burgers, fries and the combos */
  'b-hero': {
    art: 'burger-veg',
    heat: 0,
    blurb: 'Crisp patty, fresh salad and house sauce in a toasted bun.',
  },
  'b-hunter': {
    art: 'burger-spicy',
    heat: 1,
    blurb: 'Chicken patty off the griddle, sauced and stacked.',
    tag: 'House special',
  },
  'b-fries': {
    art: 'fries-salted',
    heat: 0,
    blurb: 'Cut thick, fried twice, salted while they are still steaming.',
  },
  'b-peri-fries': {
    art: 'fries-peri',
    heat: 2,
    blurb: 'Tossed hot in peri peri masala so it actually sticks.',
  },
  'b-combo-veg': {
    art: 'burger-veg',
    heat: 0,
    blurb: 'Fries, the veg burger and any chiller off the board — the whole counter on one tray.',
    tag: 'Best value',
  },
  'b-combo-nonveg': {
    art: 'burger-spicy',
    heat: 1,
    blurb: 'Fries, the chicken burger and any chiller off the board.',
    tag: 'Best value',
  },

}

/** Used for anything the till grows that nobody has drawn yet. */
const PLAIN: Look = {
  art: 'steamed',
  heat: 0,
  blurb: 'Off the same hot counter as everything else.',
}

/**
 * Sections the website leaves off. The till still rings them up; they just
 * have no business on a menu people read to decide whether to walk over.
 */
const HIDDEN = new Set(['basics'])

/** Kickers the board writes with a price in them get a price-free one here. */
const KICKERS: Record<string, string> = {
  chillers: 'Cool, fresh, over crushed ice',
}

/** Turns the till's flat item list into the cards the menu section renders. */
function buildMenu(): MenuCategory[] {
  return posCategories
    .filter((cat) => !HIDDEN.has(cat.id))
    .map((cat) => {
      const cards: MenuCard[] = []
      const styles = new Map<string, MenuCard>()

      for (const item of posItems.filter((i) => i.cat === cat.id)) {
        // a momo style: the first filling opens the card, the rest join it
        const style = item.group && STYLE_LOOKS[item.group] ? item.group : null
        if (style) {
          let card = styles.get(style)
          if (!card) {
            card = {
              ...STYLE_LOOKS[style],
              id: `${cat.id}-${item.id.split('-')[1]}`,
              name: style,
              fillings: [],
              halfOrFull: item.half != null,
            }
            styles.set(style, card)
            cards.push(card)
          }
          card.fillings.push(item.name)
          continue
        }

        cards.push({
          ...(ITEM_LOOKS[item.id] ?? PLAIN),
          id: item.id,
          group: item.group ?? undefined,
          name: item.name,
          note: item.note ?? undefined,
          addon: item.addon?.name,
          fillings: [],
          halfOrFull: item.half != null,
        })
      }

      return {
        id: cat.id,
        label: cat.label,
        kicker: KICKERS[cat.id] ?? cat.kicker,
        cards,
      }
    })
}

export const menu: MenuCategory[] = buildMenu()

/**
 * The one number the page does quote: what a visit costs, end to end, read
 * off the same card. Cheapest food on the board (a half plate of veg steam)
 * up to the dearest full plate. Bottled drinks sit outside it.
 */
export const priceBand = (() => {
  const food = posItems.filter((i) => i.cat !== 'basics')
  const low = Math.min(...food.map((i) => i.half ?? i.full))
  const high = Math.max(...food.map((i) => i.full))
  return `₹${low} – ₹${high}`
})()

/* --- testimonials --------------------------------------------------------
 * Verbatim from the Google Business reviews for Hot n' Hazy, Bokaro Steel City
 * (4.7★, 32 reviews), read on 29 Aug 2026. Quoted as written — spelling and
 * all — because they are real people's words.
 * ---------------------------------------------------------------------- */

export type Review = {
  name: string
  meta: string
  stars: 4 | 5
  quote: string
}

export const reviews: Review[] = [
  {
    name: 'Akanksha Singh',
    meta: '9 reviews · Google',
    stars: 5,
    quote: 'Hands down the best momo in the city! You should definitely go and try.',
  },
  {
    name: 'Rashmi Singh',
    meta: 'Local Guide · 10 reviews · Google',
    stars: 5,
    quote:
      'Such a great place to have yummiest momos in Bokaro. They have variety of momos at very reasonable price. Hygeine is the USP for this food cart. Do try it once!',
  },
  {
    name: 'Raj Veer',
    meta: '5 reviews · Google',
    stars: 5,
    quote:
      'That was really something new in the town, Afghani and peri peri momos were probably the best i ever had, chilli momo is 🌶️ Must try, highly recommend.',
  },
  {
    name: 'Suraj Brds Ranchi',
    meta: 'Local Guide · 13 reviews · Google',
    stars: 5,
    quote:
      'This is very interesting place, very tasty food is provided here especially the veg steam momo is really hot and delicious service is top good it should be promoted internationally.',
  },
  {
    name: 'Rik Toptuhov',
    meta: 'Google',
    stars: 5,
    quote:
      'Actually i am your regular customer and i love your afghani and kurkure momos but today i tried Chilli momos and it was 🌶️',
  },
  {
    name: 'Soumyadip Bera',
    meta: '2 reviews · Google',
    stars: 5,
    quote:
      'Taste was amazing.. I got something new in our city.. I would to suggest to reduce the waiting time but overall it was awesome ❤️',
  },
]
