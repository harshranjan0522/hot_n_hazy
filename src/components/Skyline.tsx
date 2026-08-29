/**
 * Bokaro's steel-plant skyline as a flat silhouette — chimneys, cooling towers
 * and a couple of gas holders. Sits far back in the hero parallax stack.
 */
export default function Skyline({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 260"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
        {/* low sheds */}
        <path d="M0 210 h130 v-38 h96 v38 h74 v-58 h120 v58 h96 v-30 h140 v30 h110 v-46 h130 v46 h96 v-34 h148 v34 h180 v50 H0 Z" />
        {/* chimney stacks */}
        <path d="M212 172 l10 -110 h18 l10 110 Z" />
        <path d="M268 172 l8 -84 h14 l8 84 Z" />
        <path d="M980 168 l11 -126 h20 l11 126 Z" />
        <path d="M1046 168 l8 -92 h14 l8 92 Z" />
        {/* cooling towers */}
        <path d="M560 200 q6 -70 26 -96 h44 q20 26 26 96 Z" />
        <path d="M1216 202 q6 -64 24 -88 h40 q18 24 24 88 Z" />
        {/* gas holders */}
        <circle cx="740" cy="188" r="34" />
        <circle cx="806" cy="196" r="26" />
        {/* gantry */}
        <path d="M400 152 h150 v8 h-150 Z M414 160 v50 h8 v-50 Z M528 160 v50 h8 v-50 Z" />
      </g>
    </svg>
  )
}
