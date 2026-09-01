const items = [
  'Steamed momos',
  'Kurkure momos',
  'Tandoori momos',
  'Virgin mojitos',
  'Peri peri fries',
  'Cheese burgers',
  'Chilli garlic momos',
  'Loaded fries',
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
