/** Straight off the board — see src/content.ts for where the menu comes from. */
const items = [
  'Steam momos',
  'Kurkure momos',
  'Afghani momos',
  'Nine chillers',
  'Peri peri fries',
  'Hazy Hero burger',
  'Chilli momos',
  'Cheese corn momos',
]

/**
 * Edge-to-edge scrolling ticker. The list is rendered twice and the track is
 * translated by exactly -50%, so the loop is seamless at any width.
 */
export default function Marquee({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="marquee" aria-hidden="true" data-anim>
      <div className={`marquee__track${reverse ? ' marquee__track--rev' : ''}`}>
        {[0, 1].map((copy) => (
          <ul className="marquee__list" key={copy}>
            {items.map((item) => (
              <li key={item}>
                {item}
                <span className="marquee__dot">&bull;</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
