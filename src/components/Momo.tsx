/**
 * The momo, drawn to a 100×100 box, in every guise the counter sells it.
 *
 * `variant` picks the whole treatment: skin colour, what has been done to the
 * surface (blistered, crumbed, sauced, charred, dusted) and any garnish that
 * hangs off it. The animated heat around it — steam, smoke, embers, spice
 * dust — is a separate layer; see `DishArt`.
 */

export type MomoVariant =
  | 'steamed'
  | 'fried'
  | 'kurkure'
  | 'afghani'
  | 'tandoori'
  | 'chilli'
  | 'peri'

/** The body outline, reused as the clip for every surface treatment. */
const BODY = 'M50 26 C74 26 86 46 86 62 C86 78 70 86 50 86 C30 86 14 78 14 62 C14 46 26 26 50 26 Z'

const skins: Record<MomoVariant, { skin: string; shade: string; pleat: string }> = {
  steamed: { skin: '#f7ead8', shade: '#d8bfa0', pleat: '#a98d68' },
  fried: { skin: '#efa94a', shade: '#c47f2c', pleat: '#8f5313' },
  kurkure: { skin: '#e8a441', shade: '#bd7524', pleat: '#7d4610' },
  afghani: { skin: '#f4ecdd', shade: '#d7cab2', pleat: '#b09e7e' },
  tandoori: { skin: '#d8562a', shade: '#a03211', pleat: '#5e1a06' },
  chilli: { skin: '#cf2f1a', shade: '#8f1206', pleat: '#5c0a02' },
  peri: { skin: '#e2703a', shade: '#ac4718', pleat: '#6d2a08' },
}

/** Deterministic scatter so a texture never re-shuffles between renders. */
function scatter(count: number, seed: number) {
  const out: { x: number; y: number; r: number }[] = []
  for (let i = 0; i < count; i++) {
    const a = Math.sin(seed + i * 12.9898) * 43758.5453
    const b = Math.sin(seed + i * 78.233) * 12345.6789
    const t = a - Math.floor(a)
    const u = b - Math.floor(b)
    out.push({
      x: 20 + t * 60,
      y: 34 + u * 46,
      r: 1 + ((t + u) % 1) * 2.2,
    })
  }
  return out
}

/** The per-variant surface, clipped to the body so nothing spills off the edge. */
function Surface({ variant, id }: { variant: MomoVariant; id: (n: string) => string }) {
  switch (variant) {
    /* deep-fried: blistered, crisped, with hard little bubbles of colour */
    case 'fried':
      return (
        <>
          {scatter(9, 3).map((p, i) => (
            <ellipse
              key={i}
              cx={p.x}
              cy={p.y}
              rx={p.r * 1.9}
              ry={p.r * 1.35}
              fill="#a8590f"
              opacity={0.42}
            />
          ))}
          {scatter(6, 11).map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y - 4} r={p.r * 0.8} fill="#ffd89b" opacity={0.55} />
          ))}
          {/* crisped rim */}
          <path d={BODY} fill="none" stroke="#7a3f06" strokeWidth="3" opacity="0.5" />
        </>
      )

    /* kurkure: a coat of coarse crumb, so the texture is chunks, not spots */
    case 'kurkure':
      return (
        <>
          {scatter(26, 7).map((p, i) => (
            <rect
              key={i}
              x={p.x}
              y={p.y}
              width={p.r * 2.4}
              height={p.r * 2}
              rx="1"
              fill={['#f7c672', '#d18f31', '#8f5613'][i % 3]}
              opacity="0.9"
              transform={`rotate(${(i * 37) % 90} ${p.x} ${p.y})`}
            />
          ))}
        </>
      )

    /* afghani: a blanket of malai poured over the top, herbs and pepper on it */
    case 'afghani':
      return (
        <>
          <path
            d="M14 60 C14 44 26 26 50 26 C74 26 86 44 86 60 C80 64 76 58 70 62 C64 66 60 58 53 62 C46 66 41 58 34 62 C27 66 22 58 14 60 Z"
            fill="#fffaf0"
            opacity="0.95"
          />
          {scatter(7, 21).map((p, i) => (
            <ellipse
              key={i}
              cx={p.x}
              cy={40 + (p.y % 14)}
              rx={p.r * 1.3}
              ry={p.r * 0.55}
              fill="#79a844"
              opacity="0.85"
              transform={`rotate(${(i * 51) % 120} ${p.x} ${40 + (p.y % 14)})`}
            />
          ))}
          {scatter(6, 33).map((p, i) => (
            <circle key={i} cx={p.x} cy={38 + (p.y % 16)} r="1.1" fill="#4a3a2b" opacity="0.8" />
          ))}
        </>
      )

    /* tandoori: charred where the flame caught it, blistered black */
    case 'tandoori':
      return (
        <>
          {scatter(8, 5).map((p, i) => (
            <ellipse
              key={i}
              cx={p.x}
              cy={p.y}
              rx={p.r * 2.1}
              ry={p.r * 1.5}
              fill="#2b0d03"
              opacity={0.55 + (i % 3) * 0.14}
            />
          ))}
          {scatter(5, 17).map((p, i) => (
            <circle key={i} cx={p.x + 3} cy={p.y - 3} r={p.r * 0.7} fill="#ffb43d" opacity="0.5" />
          ))}
          {/* the flame-side edge, still glowing */}
          <path
            d="M18 68 C26 82 40 86 50 86 C60 86 74 82 82 68"
            fill="none"
            stroke="#ff6a1e"
            strokeWidth="4"
            opacity="0.55"
          />
        </>
      )

    /* chilli: a wet coat of sauce with a gloss that travels across it */
    case 'chilli':
      return (
        <>
          <path d={BODY} fill={`url(#${id('gloss')})`} opacity="0.9" />
          {scatter(10, 13).map((p, i) => (
            <rect
              key={i}
              x={p.x}
              y={p.y}
              width={p.r * 1.7}
              height={p.r * 0.9}
              rx="0.6"
              fill="#5d0902"
              opacity="0.7"
              transform={`rotate(${(i * 63) % 180} ${p.x} ${p.y})`}
            />
          ))}
          <rect className="momo-sheen" x="-40" y="20" width="26" height="72" fill="#fff" opacity="0.3" />
        </>
      )

    /* peri peri: dry masala dust, thick enough to see the grain */
    case 'peri':
      return (
        <>
          {scatter(34, 9).map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={p.r * 0.62}
              fill={['#8e1607', '#c62b0d', '#ffb43d'][i % 3]}
              opacity="0.9"
            />
          ))}
        </>
      )

    /* steamed: nothing added — just a wet sheen off the basket */
    default:
      return <ellipse cx="60" cy="70" rx="16" ry="8" fill="#fff" opacity="0.22" />
  }
}

export default function Momo({
  className,
  variant,
  tone,
  idPrefix = 'momo',
}: {
  className?: string
  variant?: MomoVariant
  /** Older two-way switch, still used by the drifting hero momos. */
  tone?: 'pale' | 'fried'
  /** Keeps clip/gradient ids unique when several momos share a page. */
  idPrefix?: string
}) {
  const v: MomoVariant = variant ?? (tone === 'fried' ? 'fried' : 'steamed')
  const { skin, shade, pleat } = skins[v]
  const id = (name: string) => `${idPrefix}-${v}-${name}`

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={id('clip')}>
          <path d={BODY} />
        </clipPath>
        {v === 'chilli' && (
          <linearGradient id={id('gloss')} x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#ff4a2a" />
            <stop offset="55%" stopColor="#c9210f" />
            <stop offset="100%" stopColor="#6d0b03" />
          </linearGradient>
        )}
      </defs>

      <ellipse cx="50" cy="86" rx="30" ry="6" fill="#000" opacity="0.25" />

      {/* tandoori arrives on the skewer it was charred on */}
      {v === 'tandoori' && (
        <g className="momo-skewer">
          <rect x="47" y="2" width="5" height="82" rx="2.5" fill="#b98d55" />
          <rect x="47" y="2" width="2" height="82" fill="#e0b478" opacity="0.85" />
        </g>
      )}

      {/* body */}
      <path d={BODY} fill={skin} stroke={pleat} strokeWidth="2.2" />
      {/* underside shading */}
      <path
        d="M18 66 C26 82 40 86 50 86 C60 86 74 82 82 66 C74 78 62 81 50 81 C38 81 26 78 18 66 Z"
        fill={shade}
      />

      <g clipPath={`url(#${id('clip')})`}>
        <Surface variant={v} id={id} />
      </g>

      {/* pleats gathered at the crown */}
      <g fill={skin} stroke={pleat} strokeWidth="2.2" strokeLinejoin="round">
        <path d="M50 24 C42 30 36 38 34 48 C40 44 44 34 50 24 Z" />
        <path d="M50 24 C46 32 44 42 44 52 C48 44 49 34 50 24 Z" />
        <path d="M50 24 C54 32 56 42 56 52 C52 44 51 34 50 24 Z" />
        <path d="M50 24 C58 30 64 38 66 48 C60 44 56 34 50 24 Z" />
      </g>
      <circle cx="50" cy="24" r="5.5" fill={skin} stroke={pleat} strokeWidth="2.2" />

      {/* sauce that has run off the bottom and pooled */}
      {v === 'chilli' && (
        <g className="momo-drip">
          <path d="M36 82 C36 90 32 92 32 96 C32 99 40 99 40 96 C40 92 36 90 36 82 Z" fill="#a8180a" />
          <circle cx="62" cy="93" r="3.4" fill="#c9210f" />
        </g>
      )}

      {/* the last of the malai, still sliding off */}
      {v === 'afghani' && (
        <path className="momo-drip" d="M64 74 C64 82 60 84 60 88 C60 91 68 91 68 88 C68 84 64 82 64 74 Z" fill="#fffaf0" opacity="0.9" />
      )}

      {/* highlight */}
      {v !== 'afghani' && v !== 'chilli' && (
        <ellipse cx="38" cy="48" rx="9" ry="6" fill="#fff" opacity="0.4" transform="rotate(-22 38 48)" />
      )}
    </svg>
  )
}
