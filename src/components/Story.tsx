import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import Reveal from './Reveal'
import Momo from './Momo'
import { business, ratings } from '../content'

export default function Story() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const plateY = useTransform(scrollYProgress, [0, 1], [80, -80])
  const plateRotate = useTransform(scrollYProgress, [0, 1], [-8, 8])

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
              made fresh every evening. Steamed, fried, or fiery tandoori — there&rsquo;s
              something here to satisfy your taste buds.
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

        <div className="story__art" aria-hidden="true">
          <motion.div
            className="story__plate"
            style={{ y: reduced ? 0 : plateY, rotate: reduced ? 0 : plateRotate }}
          >
            <span className="story__ring" />
            <span className="story__ring story__ring--two" />
            <div className="story__momos">
              <Momo className="story__momo story__momo--a" />
              <Momo className="story__momo story__momo--b" tone="fried" />
              <Momo className="story__momo story__momo--c" />
            </div>
          </motion.div>
          <p className="story__hand">made fresh, every evening</p>
        </div>
      </div>
      <p className="story__price">
        Most plates land between <strong>{business.priceBand}</strong>
      </p>
    </section>
  )
}
