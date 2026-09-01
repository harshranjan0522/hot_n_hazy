/**
 * A burger, drawn to the same 100×100 box as the momo.
 *
 * The stack is the same three-layer build every time; `variant` decides what
 * is between the buns — a plain patty, cheese that has run over the sides, or
 * the chilli-and-jalapeño version that comes with its own heat.
 */

export type BurgerVariant = 'burger-veg' | 'burger-cheese' | 'burger-spicy'

/** Sesame seeds on the crown, hand-placed so they read at 4rem. */
const seeds = [
  { x: 38, y: 34, r: -22 },
  { x: 47, y: 30, r: 8 },
  { x: 57, y: 32, r: 26 },
  { x: 64, y: 39, r: -14 },
  { x: 33, y: 42, r: 18 },
  { x: 50, y: 40, r: -6 },
] as const

export default function Burger({
  className,
  variant,
  idPrefix = 'burger',
}: {
  className?: string
  variant: BurgerVariant
  idPrefix?: string
}) {
  const id = (n: string) => `${idPrefix}-${variant}-${n}`
  const spicy = variant === 'burger-spicy'

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={id('bun')} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#f0be74" />
          <stop offset="100%" stopColor="#c4832f" />
        </linearGradient>
      </defs>

      <ellipse cx="50" cy="90" rx="26" ry="4.5" fill="#000" opacity="0.32" />

      {/* the whole stack settles a little, like it has just been put down */}
      <g className="fx-stack">
        {/* crown */}
        <path d="M20 52 C20 30 33 22 50 22 C67 22 80 30 80 52 Z" fill={`url(#${id('bun')})`} />
        <path d="M24 44 C30 34 38 30 50 30" fill="none" stroke="#ffe0ab" strokeWidth="2.6" opacity="0.5" strokeLinecap="round" />
        <g fill="#fff4e8" opacity="0.92">
          {seeds.map((s, i) => (
            <ellipse key={i} cx={s.x} cy={s.y} rx="2.6" ry="1.5" transform={`rotate(${s.r} ${s.x} ${s.y})`} />
          ))}
        </g>

        {/* cheese, with a slice hanging over each side */}
        <path
          className={variant === 'burger-cheese' ? 'fx-melt' : undefined}
          d="M19 53 L81 53 L81 58 C76 58 74 66 70 66 C66 66 65 59 61 59 C57 59 56 65 52 65 C48 65 46 58 42 58 C38 58 36 65 32 65 C28 65 26 58 19 58 Z"
          fill="#ffc23d"
        />

        {/* lettuce */}
        <path
          d="M18 58 C24 52 28 60 34 55 C40 50 44 60 50 55 C56 50 60 60 66 55 C72 50 76 60 82 58 C82 64 78 66 72 66 L28 66 C22 66 18 64 18 58 Z"
          fill={spicy ? '#5f9c33' : '#6fb63c'}
        />

        {/* patty */}
        <rect x="22" y="64" width="56" height="12" rx="6" fill={spicy ? '#7a2a12' : '#77401d'} />
        <rect x="22" y="64" width="56" height="4" rx="2" fill="#96552b" opacity="0.7" />

        {/* jalapeños and chilli sauce for the spicy one */}
        {spicy && (
          <>
            <path d="M22 74 C28 80 34 74 40 79 C46 83 52 76 58 80 C64 84 72 77 78 74 L78 78 L22 78 Z" fill="#c9210f" />
            <g fill="#7fbf3a" stroke="#4c8a1e" strokeWidth="1.2">
              <circle cx="34" cy="70" r="3.4" />
              <circle cx="52" cy="68" r="3" />
              <circle cx="66" cy="71" r="3.2" />
            </g>
          </>
        )}

        {/* heel */}
        <path d="M20 78 L80 78 C80 86 72 90 50 90 C28 90 20 86 20 78 Z" fill={`url(#${id('bun')})`} />
      </g>

      {/* cheese running down the side, still moving */}
      {variant === 'burger-cheese' && (
        <g className="fx-melt-drip" fill="#ffc23d">
          <path d="M26 62 C26 70 22 72 22 76 C22 79 30 79 30 76 C30 72 26 70 26 62 Z" />
          <path d="M74 62 C74 68 71 70 71 73 C71 76 78 76 78 73 C78 70 74 68 74 62 Z" />
        </g>
      )}
    </svg>
  )
}
