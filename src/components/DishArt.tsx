import Momo, { type MomoVariant } from './Momo'
import Mojito, { type MojitoVariant } from './Mojito'
import Fries, { type FriesVariant } from './Fries'
import Burger, { type BurgerVariant } from './Burger'

/**
 * A menu item's art plus whatever is coming off it — the part that moves.
 *
 * Each variant gets the heat that actually belongs to it: steam off the
 * basket, thin oil smoke off the fryer, lazy smoke off the afghani, embers off
 * the tandoor, spice dust off the peri peri — and, for the cold half of the
 * board, fizz instead of smoke. All of it is CSS-animated so the list, which
 * runs seven of these at once, never touches the main thread; `data-anim` on
 * the menu section parks the lot once it scrolls away.
 */

export type DishVariant = MomoVariant | MojitoVariant | FriesVariant | BurgerVariant

/** Wisps drawn in a 100×100 box so they line up with the art underneath. */
function Wisps({
  paths,
  className,
  stroke,
  width,
  opacity,
}: {
  paths: string[]
  className: string
  stroke: string
  width: number
  opacity: number
}) {
  return (
    <g fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" opacity={opacity}>
      {paths.map((d, i) => (
        <path key={i} className={className} style={{ animationDelay: `${i * 1.15}s` }} d={d} />
      ))}
    </g>
  )
}

const STEAM = [
  'M36 30 C26 18 42 12 34 0',
  'M50 26 C40 12 58 6 50 -6',
  'M64 30 C54 18 70 12 62 0',
]

const SMOKE = ['M40 30 C24 16 48 8 34 -6', 'M62 30 C46 16 70 8 56 -6']

/** Same wisps, started higher up, for art that is taller than a momo. */
const HIGH = ['M36 22 C22 8 46 0 32 -14', 'M62 22 C48 8 72 0 58 -14']

/** Rising specks — sparks off the tandoor, masala off the peri peri. */
function Motes({
  className,
  count,
  colors,
  y,
  radius,
  gap,
}: {
  className: string
  count: number
  colors: string[]
  y: number
  radius: number
  gap: number
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          className={className}
          style={{ animationDelay: `${i * gap}s` }}
          cx={50 - ((count - 1) * 11) / 2 + i * 11}
          cy={y}
          r={radius + (i % 3) * 0.5}
          fill={colors[i % colors.length]}
        />
      ))}
    </>
  )
}

function Fx({ variant }: { variant: DishVariant }) {
  switch (variant) {
    /* --- momos ------------------------------------------------------- */

    /* fryer smoke: thinner, greyer and quicker than steam */
    case 'fried':
    case 'kurkure':
      return (
        <>
          <Wisps paths={SMOKE} className="fx-smoke" stroke="#d8c4b0" width={4} opacity={0.5} />
          {/* crumbs shaking loose */}
          {variant === 'kurkure' &&
            [0, 1, 2].map((i) => (
              <rect
                key={i}
                className="fx-crumb"
                style={{ animationDelay: `${i * 0.9}s` }}
                x={30 + i * 18}
                y="52"
                width="4"
                height="3.4"
                rx="0.8"
                fill={['#f7c672', '#d18f31', '#8f5613'][i]}
              />
            ))}
        </>
      )

    /* afghani: creamy, so the smoke is wide, slow and cool-toned */
    case 'afghani':
      return <Wisps paths={SMOKE} className="fx-lazy" stroke="#cdd6de" width={7} opacity={0.42} />

    /* tandoor: char smoke with sparks lifting off it */
    case 'tandoori':
      return (
        <>
          <Wisps paths={SMOKE} className="fx-smoke" stroke="#9c8c82" width={5} opacity={0.45} />
          <Motes className="fx-ember" count={4} colors={['#ff5a1e', '#ffb43d']} y={56} radius={1.6} gap={0.65} />
        </>
      )

    /* peri peri: dry masala lifting off and drifting */
    case 'peri':
      return <Motes className="fx-dust" count={6} colors={['#ffb43d', '#c62b0d']} y={58} radius={1.3} gap={0.5} />

    /* chilli: the sauce is the show, so this is heat shimmer and a spark */
    case 'chilli':
      return (
        <>
          <Wisps paths={SMOKE} className="fx-smoke" stroke="#ff7a44" width={4} opacity={0.4} />
          <Motes className="fx-ember" count={2} colors={['#ff3b21']} y={54} radius={1.8} gap={1.1} />
        </>
      )

    /* --- fries ------------------------------------------------------- */

    /* salt raining back down off the fries */
    case 'fries-salted':
      return (
        <>
          <Wisps paths={HIGH} className="fx-smoke" stroke="#e6d7c8" width={4} opacity={0.4} />
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              className="fx-crumb"
              style={{ animationDelay: `${i * 0.85}s` }}
              cx={38 + i * 13}
              cy="30"
              r="1.3"
              fill="#fffaf0"
            />
          ))}
        </>
      )

    /* peri peri fries: same masala cloud as the momos, lifted to the fries */
    case 'fries-peri':
      return (
        <>
          <Wisps paths={HIGH} className="fx-smoke" stroke="#d99a6a" width={4} opacity={0.35} />
          <Motes className="fx-dust" count={6} colors={['#ffb43d', '#c62b0d']} y={34} radius={1.3} gap={0.5} />
        </>
      )

    /* cheese fries: proper steam, because it goes out molten */
    case 'fries-cheese':
      return <Wisps paths={HIGH} className="fx-steam" stroke="#fff4e8" width={5} opacity={0.45} />

    /* --- burgers ----------------------------------------------------- */

    case 'burger-veg':
      return <Wisps paths={STEAM} className="fx-steam" stroke="#fff4e8" width={4.5} opacity={0.4} />

    case 'burger-cheese':
      return <Wisps paths={SMOKE} className="fx-steam" stroke="#ffe0ab" width={5} opacity={0.42} />

    /* the spicy one comes off the griddle smoking, with chilli in the air */
    case 'burger-spicy':
      return (
        <>
          <Wisps paths={SMOKE} className="fx-smoke" stroke="#ff7a44" width={4.5} opacity={0.45} />
          <Motes className="fx-ember" count={3} colors={['#ff3b21', '#ffb43d']} y={62} radius={1.6} gap={0.8} />
        </>
      )

    /* --- mojitos ----------------------------------------------------- */
    /* Nothing rises off a cold drink — the fizz and frost live on the glass
       itself, so the heat layer stays empty. */

    case 'mojito-classic':
    case 'mojito-apple':
    case 'mojito-lagoon':
    case 'mojito-melon':
      return null

    /* steamed, straight out of the basket */
    default:
      return <Wisps paths={STEAM} className="fx-steam" stroke="#fff4e8" width={5} opacity={0.55} />
  }
}

/** The right drawing for a variant. */
function Art({ variant }: { variant: DishVariant }) {
  if (variant.startsWith('mojito-')) {
    return <Mojito className="dish-art__item" variant={variant as MojitoVariant} />
  }
  if (variant.startsWith('fries-')) {
    return <Fries className="dish-art__item" variant={variant as FriesVariant} />
  }
  if (variant.startsWith('burger-')) {
    return <Burger className="dish-art__item" variant={variant as BurgerVariant} />
  }
  return <Momo className="dish-art__item" variant={variant as MomoVariant} />
}

export default function DishArt({ variant }: { variant: DishVariant }) {
  // Mojitos have no heat layer at all, so the extra SVG is skipped rather than
  // mounted empty.
  const cold = variant.startsWith('mojito-')

  return (
    <span className={`dish-art dish-art--${variant}${cold ? ' dish-art--cold' : ''}`}>
      <Art variant={variant} />
      {!cold && (
        <svg
          className="dish-art__fx"
          viewBox="0 0 100 100"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Fx variant={variant} />
        </svg>
      )}
    </span>
  )
}
