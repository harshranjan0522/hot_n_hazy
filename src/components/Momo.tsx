/** A single steamed momo — pleated crown, plump body, drawn to a 100×100 box. */
export default function Momo({
  className,
  tone = 'pale',
}: {
  className?: string
  /** `pale` is a steamed momo, `fried` is the crisped kurkure version. */
  tone?: 'pale' | 'fried'
}) {
  const skin = tone === 'fried' ? '#efa94a' : '#f7ead8'
  const shade = tone === 'fried' ? '#c47f2c' : '#d8bfa0'
  const pleat = tone === 'fried' ? '#8f5313' : '#a98d68'

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="50" cy="86" rx="30" ry="6" fill="#000" opacity="0.25" />
      {/* body */}
      <path
        d="M50 26 C74 26 86 46 86 62 C86 78 70 86 50 86 C30 86 14 78 14 62 C14 46 26 26 50 26 Z"
        fill={skin}
        stroke={pleat}
        strokeWidth="2.2"
      />
      {/* underside shading */}
      <path
        d="M18 66 C26 82 40 86 50 86 C60 86 74 82 82 66 C74 78 62 81 50 81 C38 81 26 78 18 66 Z"
        fill={shade}
      />
      {/* pleats gathered at the crown */}
      <g fill={skin} stroke={pleat} strokeWidth="2.2" strokeLinejoin="round">
        <path d="M50 24 C42 30 36 38 34 48 C40 44 44 34 50 24 Z" />
        <path d="M50 24 C46 32 44 42 44 52 C48 44 49 34 50 24 Z" />
        <path d="M50 24 C54 32 56 42 56 52 C52 44 51 34 50 24 Z" />
        <path d="M50 24 C58 30 64 38 66 48 C60 44 56 34 50 24 Z" />
      </g>
      <circle cx="50" cy="24" r="5.5" fill={skin} stroke={pleat} strokeWidth="2.2" />
      {/* highlight */}
      <ellipse cx="38" cy="48" rx="9" ry="6" fill="#fff" opacity="0.45" transform="rotate(-22 38 48)" />
    </svg>
  )
}
