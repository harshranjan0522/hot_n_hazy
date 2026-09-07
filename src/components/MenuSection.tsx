import { useState } from 'react'
import { AnimatePresence, motion, LayoutGroup } from 'motion/react'
import Reveal from './Reveal'
import DishArt from './DishArt'
import { menu, priceBand, business, type MenuCard } from '../content'

/** Renders 0–3 chillies for an item's heat level. */
function Heat({ level }: { level: 0 | 1 | 2 | 3 }) {
  if (level === 0) return null
  return (
    <span className="heat" title={`Heat level ${level} of 3`}>
      <span className="sr-only">Heat level {level} of 3</span>
      {Array.from({ length: level }, (_, i) => (
        <span key={i} aria-hidden="true">
          🌶️
        </span>
      ))}
    </span>
  )
}

/**
 * What the board says about an item beyond its name: the fillings a momo style
 * comes in, whether it is sold half or full, and anything you can add to it.
 * No prices — those live on the cart, where they can't go stale.
 */
function Detail({ card }: { card: MenuCard }) {
  const lines = [
    card.halfOrFull ? 'Half or full plate' : null,
    card.addon ?? null,
  ].filter(Boolean)

  if (!card.fillings.length && !lines.length) return null

  return (
    <div className="dish__detail">
      {card.fillings.length > 0 && (
        <ul className="dish__fillings">
          {card.fillings.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
      {lines.length > 0 && <p className="dish__served">{lines.join(' · ')}</p>}
    </div>
  )
}

export default function MenuSection() {
  const [active, setActive] = useState(menu[0].id)
  const category = menu.find((c) => c.id === active) ?? menu[0]

  return (
    /* data-anim parks the dish art off screen — it sits on the section, not
       the list, because the list is remounted on every tab switch and would
       drop out of the observer. */
    <section className="section menu" id="menu" data-anim>
      <div className="shell">
        <div className="menu__head">
          <div>
            <Reveal>
              <p className="eyebrow">The menu</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="section-title">
                Everything comes off the <span className="flame-text">same hot counter</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12} className="menu__price">
            <span>The whole board</span>
            <strong>{priceBand}</strong>
          </Reveal>
        </div>

        {/* category switcher */}
        <LayoutGroup id="menu-tabs">
          <div className="menu__tabs" role="tablist" aria-label="Menu categories">
            {menu.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={c.id === active}
                aria-controls={`panel-${c.id}`}
                id={`tab-${c.id}`}
                className={`menu__tab${c.id === active ? ' is-active' : ''}`}
                onClick={() => setActive(c.id)}
              >
                {c.id === active && (
                  <motion.span
                    layoutId="menu-pill"
                    className="menu__pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="menu__tab-label">{c.label}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        <AnimatePresence mode="wait">
          <motion.div
            key={category.id}
            id={`panel-${category.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${category.id}`}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="menu__kicker">{category.kicker}</p>

            <ul className="menu__list">
              {category.cards.map((card, i) => (
                <motion.li
                  key={card.id}
                  className="dish"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: Math.min(i, 8) * 0.055,
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -6 }}
                >
                  <div className="dish__art" aria-hidden="true">
                    <DishArt variant={card.art} />
                  </div>
                  <div className="dish__text">
                    {card.group && <p className="dish__group">{card.group}</p>}
                    <h3 className="dish__name">
                      {card.name}
                      <Heat level={card.heat} />
                    </h3>
                    {card.note && <p className="dish__note">{card.note}</p>}
                    <p className="dish__blurb">{card.blurb}</p>
                    <Detail card={card} />
                    {card.tag && <span className="dish__tag">{card.tag}</span>}
                  </div>
                  <span className="dish__edge" aria-hidden="true" />
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        <Reveal delay={0.1} className="menu__foot">
          <p className="menu__note">
            Every item here is what the counter is actually ringing up tonight — the board on
            the cart has the prices.
          </p>
          <div className="menu__cta">
            <a className="btn btn--flame" href={business.zomatoUrl} target="_blank" rel="noopener noreferrer">
              Order on Zomato
              <span className="btn__arrow" aria-hidden="true">↗</span>
            </a>
            <a className="btn btn--ghost" href={business.favhikerUrl} target="_blank" rel="noopener noreferrer">
              See it on FavHiker
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
