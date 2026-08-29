/**
 * The Hot n' Hazy badge, rebuilt as vector: charcoal disc, hot red ring,
 * flame mark, wordmark under it. `withText` drops the lettering for the
 * small sizes (nav mark, favicon) where it would be unreadable.
 */
export default function Logo({
  className,
  withText = true,
  idPrefix = 'logo',
}: {
  className?: string
  withText?: boolean
  /** Keeps gradient ids unique when the badge appears more than once. */
  idPrefix?: string
}) {
  const id = (name: string) => `${idPrefix}-${name}`

  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      role="img"
      aria-label="Hot n' Hazy"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={id('disc')} cx="0.38" cy="0.3" r="0.85">
          <stop offset="0%" stopColor="#2e2a28" />
          <stop offset="60%" stopColor="#161311" />
          <stop offset="100%" stopColor="#080605" />
        </radialGradient>
        <linearGradient id={id('ring')} x1="0.1" y1="0.05" x2="0.9" y2="0.95">
          <stop offset="0%" stopColor="#ff4326" />
          <stop offset="30%" stopColor="#e02417" />
          <stop offset="62%" stopColor="#94120a" />
          <stop offset="100%" stopColor="#4a0803" />
        </linearGradient>
        <linearGradient id={id('flame')} x1="0.5" y1="0.02" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#ffd049" />
          <stop offset="30%" stopColor="#ff9412" />
          <stop offset="70%" stopColor="#f4491a" />
          <stop offset="100%" stopColor="#c8160c" />
        </linearGradient>
        <linearGradient id={id('core')} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#fff6de" />
          <stop offset="48%" stopColor="#ffd875" />
          <stop offset="100%" stopColor="#ff8f14" />
        </linearGradient>
      </defs>

      {/* disc + ring */}
      <circle cx="100" cy="100" r="100" fill={`url(#${id('disc')})`} />
      <circle
        cx="100"
        cy="100"
        r="89"
        fill="none"
        stroke={`url(#${id('ring')})`}
        strokeWidth="11"
      />

      {/* flame */}
      <g
        className="logo__flame"
        transform={
          withText
            ? 'translate(0 -26) scale(0.74) translate(35 30)'
            : 'translate(-29 -1) scale(1.32)'
        }
      >
        <path
          d="M104 24 c-2 22 12 34 22 48 c13 18 12 44 -8 58 c-16 11 -38 8 -49 -7 c-12 -16 -9 -36 2 -49 c8 -10 15 -18 16 -30 c7 9 10 19 9 30 c9 -13 11 -33 8 -50 z"
          fill={`url(#${id('flame')})`}
        />
        <path
          d="M101 84 c1 12 8 17 11 26 c4 12 -2 24 -12 27 c-11 -3 -17 -15 -13 -27 c3 -9 12 -14 14 -26 z"
          fill={`url(#${id('core')})`}
        />
      </g>

      {withText && (
        <g
          fill="#fff4e8"
          fontFamily="Anton, 'Arial Black', sans-serif"
          textAnchor="middle"
          letterSpacing="2.5"
        >
          <text x="100" y="146" fontSize="20">
            HOT N&apos;
          </text>
          <text x="100" y="168" fontSize="20">
            HAZY
          </text>
        </g>
      )}
    </svg>
  )
}
