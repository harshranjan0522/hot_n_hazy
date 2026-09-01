/**
 * A carton of fries, drawn to the same 100×100 box as the momo.
 *
 * `variant` changes what has been thrown over them after the fryer — nothing,
 * peri peri masala, or a ladle of cheese — which is the only thing that
 * actually differs between the three on the board.
 */

export type FriesVariant = 'fries-salted' | 'fries-peri' | 'fries-cheese'

/** Each fry: x offset, rotation, length. Hand-placed so the fan looks packed. */
const sticks = [
  { x: 32, rot: -21, len: 44 },
  { x: 39, rot: -9, len: 52 },
  { x: 46, rot: -2, len: 46 },
  { x: 52, rot: 6, len: 54 },
  { x: 59, rot: 15, len: 44 },
  { x: 64, rot: 26, len: 38 },
] as const

/** Deterministic speck placement over the fries. */
function specks(count: number, seed: number) {
  return Array.from({ length: count }, (_, i) => {
    const a = Math.sin(seed + i * 12.9898) * 43758.5453
    const b = Math.sin(seed + i * 78.233) * 12345.6789
    return { x: 32 + (a - Math.floor(a)) * 38, y: 24 + (b - Math.floor(b)) * 34 }
  })
}

export default function Fries({
  className,
  variant,
  idPrefix = 'fries',
}: {
  className?: string
  variant: FriesVariant
  idPrefix?: string
}) {
  const id = (n: string) => `${idPrefix}-${variant}-${n}`
  const peri = variant === 'fries-peri'

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={id('fry')} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#ffd270" />
          <stop offset="100%" stopColor="#e09b28" />
        </linearGradient>
        <linearGradient id={id('box')} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#f04b2a" />
          <stop offset="100%" stopColor="#a8140c" />
        </linearGradient>
      </defs>

      <ellipse cx="50" cy="93" rx="24" ry="4" fill="#000" opacity="0.3" />

      {/* the fries, fanned out of the carton */}
      <g>
        {sticks.map((s, i) => (
          <g
            key={i}
            className="fx-fry"
            style={{ animationDelay: `${i * 0.32}s` }}
            transform={`rotate(${s.rot} ${s.x + 3} 62)`}
          >
            <rect
              x={s.x}
              y={62 - s.len}
              width="7"
              height={s.len}
              rx="2.6"
              fill={peri ? '#e08a2c' : `url(#${id('fry')})`}
              stroke="#a86610"
              strokeWidth="1.4"
            />
            <rect x={s.x + 1.6} y={64 - s.len} width="2" height={s.len * 0.5} rx="1" fill="#fff1c4" opacity="0.5" />
          </g>
        ))}
      </g>

      {/* what went on top after the fryer */}
      {variant === 'fries-salted' &&
        specks(14, 4).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.2" fill="#fffaf0" opacity="0.9" />
        ))}

      {peri &&
        specks(26, 6).map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i % 3 === 0 ? 1.7 : 1.1}
            fill={['#8e1607', '#d3300f', '#ffb43d'][i % 3]}
            opacity="0.92"
          />
        ))}

      {variant === 'fries-cheese' && (
        <>
          {/* cheese poured over the fan, running down between the sticks */}
          <path
            className="fx-melt"
            d="M28 40 C34 34 44 32 50 32 C58 32 68 35 73 41 C73 48 68 46 66 52 C64 58 58 54 56 60 C54 66 48 62 46 56 C44 50 38 52 36 46 C34 41 30 45 28 40 Z"
            fill="#ffc23d"
          />
          <path
            d="M28 40 C34 34 44 32 50 32 C58 32 68 35 73 41"
            fill="none"
            stroke="#ffe08a"
            strokeWidth="2"
            opacity="0.8"
          />
          {specks(8, 8).map((p, i) => (
            <circle key={i} cx={p.x} cy={28 + (p.y % 20)} r="1.2" fill={i % 2 ? '#c9210f' : '#4f8b2a'} />
          ))}
        </>
      )}

      {/* carton, drawn last so the fries sit inside it */}
      <path d="M31 56 L69 56 L64 90 Q63.6 93 60 93 L40 93 Q36.4 93 36 90 Z" fill={`url(#${id('box')})`} />
      <path d="M31 56 L69 56 L67.7 65 L32.3 65 Z" fill="#fff4e8" opacity="0.92" />
      <path d="M44 68 L50 79 L56 68 L53 86 L47 86 Z" fill="#fff4e8" opacity="0.4" />
    </svg>
  )
}
