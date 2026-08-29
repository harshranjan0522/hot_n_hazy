/**
 * Three rising wisps of steam. Purely decorative: it is positioned by the
 * parent and animated entirely in CSS so it costs nothing on the main thread.
 */
export default function Steam({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 200"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        fill="none"
        stroke="#fff4e8"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.5"
      >
        <path className="steam-wisp" d="M34 190 C14 154 52 136 30 100 C12 70 44 52 30 18" />
        <path
          className="steam-wisp"
          style={{ animationDelay: '1.1s' }}
          d="M62 194 C42 156 82 140 60 104 C42 74 74 56 60 22"
        />
        <path
          className="steam-wisp"
          style={{ animationDelay: '2.2s' }}
          d="M92 190 C72 154 110 136 88 100 C70 70 102 52 88 18"
        />
      </g>
    </svg>
  )
}
