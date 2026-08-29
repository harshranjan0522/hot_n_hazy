/**
 * Customers standing at the truck's counter, eating. Drawn on the same
 * 900x500 grid as <FoodTruck /> so the two can be stacked and stay aligned:
 * the counter ledge sits at y≈330 and the ground line at y≈462.
 */

type PersonProps = {
  /** Horizontal centre on the 900-unit grid. */
  x: number
  /** 1 = an adult at counter height. */
  scale?: number
  /** `eating` raises a momo to the mouth; `holding` cradles a plate. */
  pose?: 'eating' | 'holding'
  /** Staggers the idle motion so the group never moves in lockstep. */
  delay?: number
}

function Person({ x, scale = 1, pose = 'holding', delay = 0 }: PersonProps) {
  const g = 462 // ground
  const h = 150 * scale
  const hipY = g
  const shoulderY = g - h * 0.48
  const headR = 21 * scale
  const headY = shoulderY - headR - 8
  const halfW = 31 * scale

  return (
    <g className="eater" style={{ animationDelay: `${delay}s` }}>
      {/* torso */}
      <path
        d={`M${x - halfW} ${hipY}
            L${x - halfW * 0.86} ${shoulderY + 8}
            Q${x} ${shoulderY - 14} ${x + halfW * 0.86} ${shoulderY + 8}
            L${x + halfW} ${hipY} Z`}
        fill="#150d09"
      />
      {/* neck + head */}
      <rect
        x={x - 7 * scale}
        y={headY}
        width={14 * scale}
        height={headR + 16}
        rx={6 * scale}
        fill="#150d09"
      />
      <circle cx={x} cy={headY} r={headR} fill="#150d09" />

      {/* rim light on the side facing the lit hatch */}
      <path
        d={`M${x + halfW * 0.86} ${shoulderY + 8} L${x + halfW} ${hipY}`}
        stroke="#ff8a0b"
        strokeWidth={3 * scale}
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d={`M${x + headR * 0.5} ${headY - headR * 0.75}
            A${headR} ${headR} 0 0 1 ${x + headR * 0.82} ${headY + headR * 0.5}`}
        fill="none"
        stroke="#ffb43d"
        strokeWidth={2.6 * scale}
        strokeLinecap="round"
        opacity="0.55"
      />

      {pose === 'eating' ? (
        <g className="eater__arm" style={{ animationDelay: `${delay}s` }}>
          <path
            d={`M${x + halfW * 0.6} ${shoulderY + 26}
                Q${x + halfW * 1.1} ${shoulderY + 2} ${x + 9 * scale} ${headY + headR * 0.7}`}
            fill="none"
            stroke="#150d09"
            strokeWidth={12 * scale}
            strokeLinecap="round"
          />
          {/* the momo, on its way up */}
          <circle
            cx={x + 9 * scale}
            cy={headY + headR * 0.7}
            r={7 * scale}
            fill="#f7ead8"
            stroke="#a98d68"
            strokeWidth={1.6 * scale}
          />
        </g>
      ) : (
        <g>
          <path
            d={`M${x - halfW * 0.6} ${shoulderY + 26}
                Q${x - halfW * 1.05} ${shoulderY + 54} ${x - halfW * 0.35} ${shoulderY + 62}`}
            fill="none"
            stroke="#150d09"
            strokeWidth={11 * scale}
            strokeLinecap="round"
          />
          {/* plate of momos */}
          <ellipse
            cx={x - halfW * 0.3}
            cy={shoulderY + 62}
            rx={22 * scale}
            ry={6 * scale}
            fill="#efe0cb"
          />
          <g stroke="#a98d68" strokeWidth={1.3 * scale}>
            <ellipse
              cx={x - halfW * 0.75}
              cy={shoulderY + 55}
              rx={8 * scale}
              ry={6.5 * scale}
              fill="#f7ead8"
            />
            <ellipse
              cx={x + halfW * 0.1}
              cy={shoulderY + 55}
              rx={8 * scale}
              ry={6.5 * scale}
              fill="#f7ead8"
            />
          </g>
        </g>
      )}
    </g>
  )
}

export default function Customers({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 900 500"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Scales are tuned so heads clear the counter ledge at y≈330 — at
          anything smaller they read as shapes at the truck's base, not
          people standing at the hatch. */}
      <Person x={296} scale={1.72} pose="eating" delay={0} />
      <Person x={486} scale={1.58} pose="holding" delay={0.9} />
      <Person x={742} scale={1.78} pose="eating" delay={1.8} />
    </svg>
  )
}
