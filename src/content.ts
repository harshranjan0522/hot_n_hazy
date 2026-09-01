/**
 * Every real-world fact about the business lives here so there is one place to
 * correct it. Sources are noted per block — anything unsourced is voice/copy,
 * not a claim.
 */

import type { DishVariant } from './components/DishArt'

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
  /** Zomato lists ~₹100 for one order; Google's per-person band is ₹1–200. */
  priceBand: '₹100 – ₹200',
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
 * Item names come from the owner's description and Google's review topics
 * (momos · afghani momos · chilli momo · peri peri momos · kurkure momos).
 * Per-item prices are intentionally absent — fill `price` in when you have the
 * real card; the sourced ₹100–200 band is shown on the section instead.
 * ---------------------------------------------------------------------- */

export type MenuItem = {
  name: string
  blurb: string
  heat: 0 | 1 | 2 | 3
  tag?: string
  price?: string
  /** Which drawing the card shows. Falls back to a plain momo when unset. */
  art?: DishVariant
}

export type MenuCategory = {
  id: string
  label: string
  kicker: string
  items: MenuItem[]
}

export const menu: MenuCategory[] = [
  {
    id: 'momos',
    label: 'Momos',
    kicker: 'The reason people cross town',
    items: [
      {
        name: 'Steamed momos',
        art: 'steamed',
        blurb: 'Thin skin, juicy filling, straight out of the basket. The one every review starts with.',
        heat: 0,
        tag: 'Most loved',
      },
      {
        name: 'Fried momos',
        art: 'fried',
        blurb: 'Same parcels, dropped in hot oil until the pleats go golden and crisp at the edges.',
        heat: 1,
      },
      {
        name: 'Kurkure momos',
        art: 'kurkure',
        blurb: 'Crumb-coated and deep fried — the crunch you can hear from the next table.',
        heat: 1,
        tag: 'Regulars order this',
      },
      {
        name: 'Afghani momos',
        art: 'afghani',
        blurb: 'Creamy, smoky, mildly spiced gravy clinging to every fold.',
        heat: 1,
        tag: 'Top rated',
      },
      {
        name: 'Tandoori momos',
        art: 'tandoori',
        blurb: 'Marinated, skewered and charred over the tandoor until the edges blister.',
        heat: 2,
      },
      {
        name: 'Chilli momos',
        art: 'chilli',
        blurb: 'Tossed in a glossy, garlicky chilli sauce. This is where the "hot" comes from.',
        heat: 3,
      },
      {
        name: 'Peri peri momos',
        art: 'peri',
        blurb: 'Dusted heavy with peri peri — tangy, salty and properly fiery.',
        heat: 3,
        tag: 'Top rated',
      },
    ],
  },
  {
    id: 'mojitos',
    label: 'Mojitos',
    kicker: 'Something cold to fight the heat',
    items: [
      {
        name: 'Classic virgin mojito',
        art: 'mojito-classic',
        blurb: 'Lime, mint, soda, crushed ice. The standard reset button between plates.',
        heat: 0,
      },
      {
        name: 'Green apple mojito',
        art: 'mojito-apple',
        blurb: 'Sharp and sweet, built on the same mint-and-lime base.',
        heat: 0,
      },
      {
        name: 'Blue lagoon',
        art: 'mojito-lagoon',
        blurb: 'Citrus and blue curaçao syrup over ice — the one that shows up in everyone’s photos.',
        heat: 0,
      },
      {
        name: 'Watermelon cooler',
        art: 'mojito-melon',
        blurb: 'Fresh watermelon, lime and a pinch of black salt.',
        heat: 0,
      },
    ],
  },
  {
    id: 'fries',
    label: 'Fries',
    kicker: 'For the table, always',
    items: [
      {
        name: 'Salted fries',
        art: 'fries-salted',
        blurb: 'Cut thick, fried twice, salted while still steaming.',
        heat: 0,
      },
      {
        name: 'Peri peri fries',
        art: 'fries-peri',
        blurb: 'Tossed hot in peri peri masala so it actually sticks.',
        heat: 2,
      },
      {
        name: 'Loaded cheese fries',
        art: 'fries-cheese',
        blurb: 'Molten cheese, herbs and a scatter of chilli flakes over the whole basket.',
        heat: 1,
      },
    ],
  },
  {
    id: 'burgers',
    label: 'Burgers',
    kicker: 'Handheld, and seriously underrated',
    items: [
      {
        name: 'Veg burger',
        art: 'burger-veg',
        blurb: 'Crisp patty, fresh veg, house sauce in a toasted bun.',
        heat: 0,
      },
      {
        name: 'Cheese burst burger',
        art: 'burger-cheese',
        blurb: 'Double cheese, griddled until it runs down the side.',
        heat: 0,
      },
      {
        name: 'Spicy hazy burger',
        art: 'burger-spicy',
        blurb: 'Our chilli sauce, jalapeños and extra crunch. Order a mojito with it.',
        heat: 3,
        tag: 'House special',
      },
    ],
  },
]

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
