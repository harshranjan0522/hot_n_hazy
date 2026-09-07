/**
 * A chiller in a highball, drawn to the same 100×100 box as the momo so the
 * menu cards stay on one grid.
 *
 * `variant` only swaps what is in the glass — the glass, ice, mint and lime
 * are the same build every time, because the cart pours all nine off the same
 * counter. The cold half of the menu gets bubbles and frost instead of steam.
 *
 * One variant per drink on the board, in board order.
 */

export type ChillerVariant =
  | 'chiller-og'
  | 'chiller-mint'
  | 'chiller-blue'
  | 'chiller-mango'
  | 'chiller-kairi'
  | 'chiller-berry'
  | 'chiller-berrylicious'
  | 'chiller-pineapple'
  | 'chiller-colada'

const fills: Record<ChillerVariant, { top: string; bottom: string; fruit: string }> = {
  'chiller-og': { top: '#d8f3c4', bottom: '#8fd36a', fruit: '#a5d94f' },
  'chiller-mint': { top: '#d3f7e4', bottom: '#3fc48a', fruit: '#7fe0b0' },
  'chiller-blue': { top: '#9fe8ff', bottom: '#1f8ede', fruit: '#3fb8f0' },
  'chiller-mango': { top: '#ffe08a', bottom: '#f08c07', fruit: '#ffb43d' },
  'chiller-kairi': { top: '#e9fb9c', bottom: '#8fc21f', fruit: '#c6e34a' },
  'chiller-berry': { top: '#ffb3bd', bottom: '#e33a52', fruit: '#ff6472' },
  'chiller-berrylicious': { top: '#e3b9f7', bottom: '#7b2ec8', fruit: '#b45ce8' },
  'chiller-pineapple': { top: '#fff3a8', bottom: '#f0bc0d', fruit: '#ffd93d' },
  'chiller-colada': { top: '#fff8e8', bottom: '#e6cea2', fruit: '#f3e3c6' },
}

const GLASS = 'M30 26 L35 83 Q35.4 88 40 88 L60 88 Q64.6 88 65 83 L70 26 Z'
const LIQUID = 'M33 38 L35 83 Q35.4 88 40 88 L60 88 Q64.6 88 65 83 L67 38 Z'

export default function Chiller({
  className,
  variant,
  idPrefix = 'chiller',
}: {
  className?: string
  variant: ChillerVariant
  idPrefix?: string
}) {
  const { top, bottom, fruit } = fills[variant]
  const id = (n: string) => `${idPrefix}-${variant}-${n}`

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={id('drink')} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="100%" stopColor={bottom} />
        </linearGradient>
        <clipPath id={id('inside')}>
          <path d={LIQUID} />
        </clipPath>
      </defs>

      <ellipse cx="50" cy="90" rx="22" ry="4" fill="#000" opacity="0.3" />

      {/* the drink */}
      <path d={LIQUID} fill={`url(#${id('drink')})`} />

      <g clipPath={`url(#${id('inside')})`}>
        {/* muddled fruit and mint settled at the bottom */}
        <circle cx="43" cy="76" r="4" fill={fruit} opacity="0.8" />
        <circle cx="57" cy="80" r="3.2" fill={fruit} opacity="0.7" />
        <ellipse cx="52" cy="70" rx="4.5" ry="2.4" fill="#3f7d22" opacity="0.65" transform="rotate(28 52 70)" />
        <ellipse cx="42" cy="62" rx="4" ry="2.1" fill="#3f7d22" opacity="0.55" transform="rotate(-18 42 62)" />

        {/* crushed ice */}
        <g fill="#ffffff" opacity="0.42">
          <rect x="38" y="44" width="13" height="12" rx="3" transform="rotate(-16 44 50)" />
          <rect x="52" y="52" width="12" height="11" rx="3" transform="rotate(22 58 57)" />
          <rect x="41" y="62" width="11" height="10" rx="3" transform="rotate(9 46 67)" />
        </g>

        {/* bubbles climbing the glass */}
        <g className="fx-fizz" fill="#ffffff" opacity="0.75">
          <circle cx="41" cy="84" r="1.6" />
          <circle cx="50" cy="86" r="1.1" style={{ animationDelay: '0.7s' }} />
          <circle cx="58" cy="84" r="1.8" style={{ animationDelay: '1.4s' }} />
          <circle cx="46" cy="88" r="1.3" style={{ animationDelay: '2.1s' }} />
          <circle cx="55" cy="87" r="1" style={{ animationDelay: '2.8s' }} />
        </g>
      </g>

      {/* liquid surface */}
      <ellipse cx="50" cy="38" rx="17" ry="4" fill={top} opacity="0.95" />
      <ellipse className="fx-swill" cx="50" cy="38" rx="12" ry="2.4" fill="#ffffff" opacity="0.4" />

      {/* glass: outline plus a bright edge on the left */}
      <path d={GLASS} fill="#ffffff" opacity="0.09" />
      <path d={GLASS} fill="none" stroke="#ffffff" strokeWidth="2.4" opacity="0.55" />
      <path d="M33 30 L37.5 82" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.45" strokeLinecap="round" />

      {/* condensation sliding down the outside */}
      <g className="fx-drop" fill="#ffffff" opacity="0.5">
        <circle cx="39" cy="50" r="1.5" />
        <circle cx="62" cy="58" r="1.2" style={{ animationDelay: '1.6s' }} />
      </g>

      {/* straw */}
      <g className="fx-straw">
        <rect x="57" y="8" width="4.6" height="34" rx="2.3" fill="#fff4e8" transform="rotate(14 59 25)" />
        <rect x="57" y="14" width="4.6" height="5" rx="1" fill="#dd2015" transform="rotate(14 59 25)" />
        <rect x="57" y="26" width="4.6" height="5" rx="1" fill="#dd2015" transform="rotate(14 59 25)" />
      </g>

      {/* mint sprig */}
      <g className="fx-sprig">
        <path d="M44 30 C44 22 40 18 34 16 C33 23 37 29 44 30 Z" fill="#4f9c2c" />
        <path d="M46 30 C46 21 50 16 57 15 C58 22 54 28 46 30 Z" fill="#63b537" />
        <path d="M45 31 C45 25 45 21 46 17" fill="none" stroke="#3a7a1f" strokeWidth="1.6" strokeLinecap="round" />
      </g>

      {/* lime wedge on the rim */}
      <g transform="translate(68 24) rotate(24)">
        <path d="M0 0 A9 9 0 0 1 0 -12 Z" fill="#c9e86a" />
        <path d="M0 0 A9 9 0 0 1 0 -12 Z" fill="none" stroke="#8fbf2e" strokeWidth="1.4" />
        <path d="M0 -1.5 L-5 -4 M0 -5 L-5.5 -6.5 M0 -8.5 L-4 -9.5" stroke="#eefbb8" strokeWidth="1" />
      </g>
    </svg>
  )
}
