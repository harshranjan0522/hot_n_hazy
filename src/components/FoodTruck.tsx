/**
 * The hero's food truck, drawn as a single inline SVG so it stays crisp at any
 * size and every part of it can be animated or recoloured from CSS.
 * Layout notes: the ground line sits at y=408, the box body spans x 245..855,
 * and the serving window is the lit rectangle at x 330..712.
 */
export default function FoodTruck({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 900 500"
      role="img"
      aria-label="Illustration of the Hot n Hazy food truck with its serving window lit up and momo steamers inside"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ht-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff4a2c" />
          <stop offset="48%" stopColor="#dd2015" />
          <stop offset="100%" stopColor="#8e1109" />
        </linearGradient>
        <linearGradient id="ht-cab" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff5a34" />
          <stop offset="100%" stopColor="#a4140b" />
        </linearGradient>
        <linearGradient id="ht-glow" x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor="#ffd08a" />
          <stop offset="55%" stopColor="#ff9a1f" />
          <stop offset="100%" stopColor="#7a3a05" />
        </linearGradient>
        <linearGradient id="ht-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4b2a1e" />
          <stop offset="60%" stopColor="#2a1710" />
          <stop offset="100%" stopColor="#150c08" />
        </linearGradient>
        <linearGradient id="ht-sign" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff6ea" />
          <stop offset="100%" stopColor="#f0d8be" />
        </linearGradient>
        <linearGradient id="ht-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff4e8" />
          <stop offset="100%" stopColor="#b39a86" />
        </linearGradient>

        <radialGradient id="ht-spill" cx="0.5" cy="0.15" r="0.85">
          <stop offset="0%" stopColor="#ffb43d" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffb43d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ht-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        <clipPath id="ht-window-clip">
          <rect x="330" y="172" width="382" height="146" rx="9" />
        </clipPath>
      </defs>

      {/* light pooling on the ground under the serving hatch */}
      <ellipse cx="520" cy="430" rx="300" ry="62" fill="url(#ht-spill)" />
      <ellipse cx="460" cy="446" rx="360" ry="26" fill="url(#ht-shadow)" />

      {/* ---- wheels ------------------------------------------------------ */}
      <g>
        <circle cx="248" cy="408" r="50" fill="#120b08" />
        <circle cx="248" cy="408" r="49" fill="none" stroke="#2b1a12" strokeWidth="2" />
        <circle cx="248" cy="408" r="24" fill="url(#ht-chrome)" />
        <circle cx="248" cy="408" r="9" fill="#7d6553" />
        <circle cx="704" cy="408" r="50" fill="#120b08" />
        <circle cx="704" cy="408" r="49" fill="none" stroke="#2b1a12" strokeWidth="2" />
        <circle cx="704" cy="408" r="24" fill="url(#ht-chrome)" />
        <circle cx="704" cy="408" r="9" fill="#7d6553" />
      </g>

      {/* ---- chassis ----------------------------------------------------- */}
      <rect x="120" y="370" width="710" height="26" rx="10" fill="#1b100b" />

      {/* ---- cab --------------------------------------------------------- */}
      <path
        d="M258 384 L258 198 L176 198 L124 258 L82 258 Q66 258 66 276 L66 358 Q66 384 88 384 Z"
        fill="url(#ht-cab)"
      />
      {/* windshield */}
      <path d="M182 210 L250 210 L250 252 L138 252 Z" fill="url(#ht-glass)" />
      <path d="M182 210 L206 210 L160 252 L138 252 Z" fill="#ffffff" opacity="0.09" />
      {/* door seam + handle */}
      <path d="M250 258 L250 372" stroke="#7c1208" strokeWidth="3" opacity="0.55" />
      <rect x="222" y="292" width="20" height="6" rx="3" fill="#ffdca6" opacity="0.8" />
      {/* headlight + bumper */}
      <rect x="62" y="288" width="20" height="30" rx="8" fill="#ffe9bd" />
      <rect x="62" y="288" width="20" height="30" rx="8" fill="#fff" opacity="0.35" />
      <rect x="58" y="352" width="52" height="18" rx="8" fill="url(#ht-chrome)" />

      {/* ---- box body ---------------------------------------------------- */}
      <rect x="248" y="122" width="600" height="262" rx="18" fill="url(#ht-body)" />
      <rect
        x="248"
        y="122"
        width="600"
        height="262"
        rx="18"
        fill="none"
        stroke="#ffb43d"
        strokeWidth="3"
        opacity="0.35"
      />
      {/* top highlight */}
      <rect x="266" y="132" width="564" height="8" rx="4" fill="#ffffff" opacity="0.16" />

      {/* flame stripe along the lower panel */}
      <path
        d="M262 344 Q330 322 392 344 T522 344 T652 344 T792 340 L836 344 L836 372 L262 372 Z"
        fill="#ff8a0b"
        opacity="0.9"
      />
      <path
        d="M262 356 Q340 338 404 356 T536 356 T668 356 T836 354 L836 372 L262 372 Z"
        fill="#ffb43d"
        opacity="0.75"
      />

      {/* ---- serving window ---------------------------------------------- */}
      <rect x="322" y="164" width="398" height="162" rx="13" fill="#2a1710" />
      <g clipPath="url(#ht-window-clip)">
        <rect x="330" y="172" width="382" height="146" fill="url(#ht-glow)" />

        {/* back-wall tiles */}
        <g opacity="0.18" stroke="#3a1c0c" strokeWidth="2">
          <path d="M330 206 H712 M330 240 H712 M330 274 H712" />
          <path d="M372 172 V318 M414 172 V318 M456 172 V318 M498 172 V318 M540 172 V318 M582 172 V318 M624 172 V318 M666 172 V318" />
        </g>

        {/* hanging bulbs inside */}
        <g stroke="#5c2c0a" strokeWidth="2">
          <path d="M382 172 V196" />
          <path d="M520 172 V186" />
          <path d="M660 172 V200" />
        </g>
        <circle cx="382" cy="202" r="7" fill="#fff3d2" />
        <circle cx="520" cy="192" r="7" fill="#fff3d2" />
        <circle cx="660" cy="206" r="7" fill="#fff3d2" />

        {/* cook silhouette */}
        <g fill="#4a1f08" opacity="0.72">
          <path d="M524 244 q22 0 26 26 l6 48 h-64 l6 -48 q4 -26 26 -26z" />
          <circle cx="524" cy="228" r="17" />
          <path d="M505 216 q19 -16 38 0 q4 -14 -19 -16 q-23 2 -19 16z" fill="#5c2c0a" />
        </g>

        {/* stacked bamboo steamers, left */}
        <g>
          <rect x="352" y="272" width="76" height="15" rx="5" fill="#c98a3f" />
          <rect x="352" y="286" width="76" height="15" rx="5" fill="#b3762f" />
          <rect x="352" y="300" width="76" height="15" rx="5" fill="#9c6526" />
          <ellipse cx="390" cy="270" rx="42" ry="9" fill="#dda45c" />
        </g>
        {/* stacked bamboo steamers, right */}
        <g>
          <rect x="612" y="280" width="72" height="14" rx="5" fill="#c98a3f" />
          <rect x="612" y="293" width="72" height="14" rx="5" fill="#b3762f" />
          <rect x="612" y="306" width="72" height="14" rx="5" fill="#9c6526" />
          <ellipse cx="648" cy="278" rx="40" ry="9" fill="#dda45c" />
        </g>

        {/* mojito glasses on the ledge */}
        <g>
          <path d="M452 292 l26 0 l-6 26 l-14 0 z" fill="#bfe7b0" opacity="0.92" />
          <rect x="462" y="316" width="6" height="6" fill="#8fbf80" />
          <path d="M486 296 l24 0 l-6 22 l-12 0 z" fill="#d6f0c6" opacity="0.9" />
        </g>
      </g>
      {/* window frame + counter ledge */}
      <rect
        x="322"
        y="164"
        width="398"
        height="162"
        rx="13"
        fill="none"
        stroke="#ffd9a3"
        strokeWidth="4"
      />
      <rect x="306" y="320" width="430" height="18" rx="8" fill="url(#ht-chrome)" />
      <rect x="306" y="320" width="430" height="6" rx="3" fill="#fff" opacity="0.5" />

      {/* ---- awning ------------------------------------------------------ */}
      <g>
        <path d="M296 112 H746 L730 160 H312 Z" fill="#f7ece0" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <path
            key={i}
            d={`M${300 + i * 56} 112 h28 l-6 48 h-28 Z`}
            fill={i % 2 === 0 ? '#dd2015' : '#ff8a0b'}
          />
        ))}
        {/* scalloped hem */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <circle key={i} cx={322 + i * 40} cy="160" r="10" fill="#f7ece0" />
        ))}
        <path d="M296 112 H746 L742 124 H300 Z" fill="#0b0705" opacity="0.18" />
      </g>

      {/* ---- roof sign --------------------------------------------------- */}
      <g>
        <rect x="470" y="98" width="12" height="26" fill="#7c1208" />
        <rect x="640" y="98" width="12" height="26" fill="#7c1208" />
        <rect x="418" y="44" width="286" height="58" rx="15" fill="url(#ht-sign)" />
        <rect
          x="418"
          y="44"
          width="286"
          height="58"
          rx="15"
          fill="none"
          stroke="#dd2015"
          strokeWidth="4"
        />
        <text
          x="561"
          y="83"
          textAnchor="middle"
          fontFamily="Anton, Arial Black, sans-serif"
          fontSize="34"
          letterSpacing="1.5"
          fill="#dd2015"
        >
          HOT N HAZY
        </text>
      </g>

      {/* ---- string lights over the roof --------------------------------- */}
      <g>
        <path
          d="M258 128 Q330 106 402 128 T546 128 T690 128 T846 122"
          fill="none"
          stroke="#3a2318"
          strokeWidth="2.5"
        />
        {[
          [294, 130],
          [366, 130],
          [438, 130],
          [510, 130],
          [582, 130],
          [654, 130],
          [726, 128],
          [798, 125],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            className="truck-bulb"
            cx={cx}
            cy={cy + 8}
            r="6"
            fill={i % 2 === 0 ? '#ffb43d' : '#fff3d2'}
            style={{ animationDelay: `${i * 0.22}s` }}
          />
        ))}
      </g>

      {/* ---- side wordmark ----------------------------------------------- */}
      <text
        x="784"
        y="228"
        textAnchor="middle"
        fontFamily="Space Grotesk, sans-serif"
        fontSize="15"
        fontWeight="700"
        letterSpacing="2"
        fill="#ffe6c2"
        opacity="0.85"
        transform="rotate(90 784 228)"
      >
        MOMOS · MOJITOS
      </text>
      <text
        x="812"
        y="228"
        textAnchor="middle"
        fontFamily="Space Grotesk, sans-serif"
        fontSize="15"
        fontWeight="700"
        letterSpacing="2"
        fill="#ffe6c2"
        opacity="0.6"
        transform="rotate(90 812 228)"
      >
        FRIES · BURGERS
      </text>
    </svg>
  )
}
