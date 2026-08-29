import { useRef } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from 'motion/react'
import FoodTruck from './FoodTruck'
import Logo from './Logo'
import Skyline from './Skyline'
import Steam from './Steam'
import Momo from './Momo'

/** Momos that drift across the hero. Positions are % of the hero box. */
const floaters = [
  { left: '7%', top: '26%', size: 78, depth: 1.7, tone: 'pale', spin: -14 },
  { left: '86%', top: '18%', size: 62, depth: 2.4, tone: 'fried', spin: 18 },
  { left: '18%', top: '62%', size: 52, depth: 3.1, tone: 'fried', spin: 24 },
  { left: '78%', top: '58%', size: 88, depth: 1.3, tone: 'pale', spin: -20 },
  { left: '68%', top: '9%', size: 44, depth: 2.8, tone: 'pale', spin: 10 },
] as const

/** Multiplies a scroll-progress value into a pixel offset. */
function useParallax(progress: MotionValue<number>, distance: number) {
  return useTransform(progress, [0, 1], [0, distance])
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Back layers drift down slowly, front layers rush up — the further forward,
  // the bigger the number.
  const skyY = useParallax(scrollYProgress, 140)
  const skylineY = useParallax(scrollYProgress, 70)
  const hazeY = useParallax(scrollYProgress, -70)
  const titleY = useParallax(scrollYProgress, -260)
  const truckY = useParallax(scrollYProgress, -90)
  const floatY = useParallax(scrollYProgress, -380)

  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 1.18])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const truckScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  // Pointer parallax — a few degrees of lean that follows the cursor.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const leanX = useSpring(pointerX, { stiffness: 90, damping: 18, mass: 0.6 })
  const leanY = useSpring(pointerY, { stiffness: 90, damping: 18, mass: 0.6 })
  const truckLeanX = useTransform(leanX, [-1, 1], [-22, 22])
  const truckLeanY = useTransform(leanY, [-1, 1], [-10, 10])
  const titleLeanX = useTransform(leanX, [-1, 1], [12, -12])

  const handlePointer = (event: React.PointerEvent<HTMLElement>) => {
    if (reduced) return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1)
    pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1)
  }

  const resetPointer = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <section
      id="top"
      ref={ref}
      className="hero"
      onPointerMove={handlePointer}
      onPointerLeave={resetPointer}
    >
      {/* ---- back layers ------------------------------------------------ */}
      <motion.div className="hero__sky" style={{ y: reduced ? 0 : skyY }} aria-hidden="true" />
      <div className="hero__vignette" aria-hidden="true" />

      <motion.div className="hero__haze" style={{ y: reduced ? 0 : hazeY }} aria-hidden="true">
        <span className="hero__blob hero__blob--red" />
        <span className="hero__blob hero__blob--orange" />
        <span className="hero__blob hero__blob--ember" />
      </motion.div>

      <motion.div
        className="hero__skyline"
        style={{ y: reduced ? 0 : skylineY }}
        aria-hidden="true"
      >
        <Skyline className="hero__skyline-svg" />
      </motion.div>

      {/* ---- headline --------------------------------------------------- */}
      <motion.div
        className="hero__content"
        style={{
          y: reduced ? 0 : titleY,
          scale: reduced ? 1 : titleScale,
          opacity: reduced ? 1 : titleOpacity,
          x: reduced ? 0 : titleLeanX,
        }}
      >
        <motion.p
          className="hero__eyebrow"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="hero__pin" aria-hidden="true" />
          Bokaro Steel City · Jharkhand
        </motion.p>

        <h1 className="hero__title">
          <span className="sr-only">Hot n Hazy</span>
          <motion.span
            className="hero__line"
            aria-hidden="true"
            initial={{ opacity: 0, y: 90, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.25, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Hot
          </motion.span>
          <motion.span
            className="hero__amp"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.3, rotate: -40 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.62, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <Logo withText={false} idPrefix="hero-amp" />
          </motion.span>
          <motion.span
            className="hero__line hero__line--flame"
            aria-hidden="true"
            initial={{ opacity: 0, y: 90, rotate: 3 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.42, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Hazy
          </motion.span>
        </h1>

        <motion.p
          className="hero__tagline"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Steaming momos, ice-cold mojitos, loaded fries and burgers — the most elite
          plate in town, served hot off a truck every evening.
        </motion.p>

        <motion.div
          className="hero__cta"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <a className="btn btn--flame" href="#menu">
            See the menu
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </a>
          <a className="btn btn--ghost" href="#find">
            Find the truck
          </a>
        </motion.div>
      </motion.div>

      {/* ---- truck + foreground ----------------------------------------- */}
      <motion.div
        className="hero__truck"
        style={{
          y: reduced ? 0 : truckY,
          scale: reduced ? 1 : truckScale,
          x: reduced ? 0 : truckLeanX,
        }}
      >
        <motion.div
          className="hero__truck-inner"
          initial={{ opacity: 0, x: -140 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: reduced ? 0 : truckLeanY }}
        >
          <FoodTruck className="hero__truck-svg" />
          <Steam className="hero__steam hero__steam--a" />
          <Steam className="hero__steam hero__steam--b" />
        </motion.div>
      </motion.div>

      <motion.div className="hero__floaters" style={{ y: reduced ? 0 : floatY }} aria-hidden="true">
        {floaters.map((f, i) => (
          <motion.span
            key={i}
            className="hero__floater"
            style={{ left: f.left, top: f.top, width: f.size, height: f.size }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: reduced ? 0 : [0, -18, 0],
              rotate: reduced ? f.spin : [f.spin, f.spin + 12, f.spin],
            }}
            transition={{
              opacity: { delay: 0.7 + i * 0.1, duration: 0.7 },
              scale: { delay: 0.7 + i * 0.1, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
              y: { duration: 4 + f.depth, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 6 + f.depth, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <Momo tone={f.tone} />
          </motion.span>
        ))}
      </motion.div>

      <div className="hero__floor" aria-hidden="true" />

      <motion.a
        className="hero__scroll"
        href="#story"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        style={{ opacity: reduced ? 1 : titleOpacity }}
      >
        <span>Scroll</span>
        <span className="hero__scroll-rail" aria-hidden="true">
          <span className="hero__scroll-dot" />
        </span>
      </motion.a>
    </section>
  )
}
