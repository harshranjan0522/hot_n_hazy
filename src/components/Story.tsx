import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import Reveal from './Reveal'
import FoodTruck from './FoodTruck'
import Customers from './Customers'
import { priceBand, ratings } from '../content'

export default function Story() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const plateY = useTransform(scrollYProgress, [0, 1], [70, -70])

  return (
    <section className="section story" id="story" ref={ref}>
      <div className="shell story__grid">
        <div className="story__copy">
          <Reveal>
            <p className="eyebrow">Our story</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="section-title">
              Bokaro&rsquo;s go-to spot for <span className="flame-text">momo lovers</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="lede story__lede">
              We serve up sizzling, juicy momos and spicy bites that are full of flavour and
              made fresh every evening. Steam, kurkure, afghani, peri peri or fiery
              chilli — there&rsquo;s something here to satisfy your taste buds.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="lede story__lede">
              Grab a hot plate, chill with friends and enjoy the vibrant vibes of the city.
              Come hungry — leave happy.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="story__sign">— the Hot n&rsquo; Hazy crew</p>
          </Reveal>

          <div className="story__ratings">
            {ratings.map((r, i) => (
              <Reveal key={r.platform} delay={0.3 + i * 0.08} className="rating">
                <span className="rating__score">{r.score}</span>
                <span className="rating__meta">
                  <strong>{r.platform}</strong>
                  {r.count}
                </span>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="story__art" aria-hidden="true" data-anim>
          <motion.div
            className="story__scene"
            style={{ y: reduced ? 0 : plateY }}
          >
            <span className="story__scene-glow" />
            {/* customers layer on top of the truck — same 900x500 grid, so the
                counter and ground lines line up between the two drawings */}
            <FoodTruck className="story__scene-truck" />
            <Customers className="story__scene-people" />
          </motion.div>
          <p className="story__hand">made fresh, every evening</p>
        </div>
      </div>
      <p className="story__price">
        Everything on the board runs <strong>{priceBand}</strong>
      </p>
    </section>
  )
}
