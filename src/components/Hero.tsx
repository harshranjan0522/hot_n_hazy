import { useRef } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
  type MotionValue,
} from 'motion/react'
import FoodTruck from './FoodTruck'
import Logo from './Logo'
import Skyline from './Skyline'
import Steam from './Steam'
import Momo from './Momo'

/**
 * Momos drifting across the hero. `depth` drives everything about how a momo
 * behaves: bigger depth = nearer the viewer = travels further and faster on
 * scroll, and bobs harder. Positions are % of the hero box.
 */
const floaters = [
  { left: '6%', top: '24%', size: 84, depth: 1.9, tone: 'pale', spin: -14, steam: true },
  { left: '87%', top: '15%', size: 60, depth: 2.5, tone: 'fried', spin: 18, steam: false },
  { left: '14%', top: '64%', size: 50, depth: 3.1, tone: 'fried', spin: 26, steam: false },
  { left: '79%', top: '57%', size: 92, depth: 1.2, tone: 'pale', spin: -20, steam: true },
  { left: '68%', top: '8%', size: 42, depth: 2.8, tone: 'pale', spin: 10, steam: false },
  { left: '30%', top: '9%', size: 34, depth: 3.5, tone: 'fried', spin: -28, steam: false },
  { left: '93%', top: '40%', size: 46, depth: 2.1, tone: 'pale', spin: 15, steam: false },
  { left: '2%', top: '47%', size: 38, depth: 2.7, tone: 'fried', spin: -18, steam: false },
] as const

type FloaterCfg = (typeof floaters)[number]

/**
 * One drifting momo. Two nested elements on purpose: the outer one carries the
 * scroll-linked parallax (`style`), the inner one the endless idle drift
 * (`animate`). Putting both on one element would make them fight over `y`.
 */
function Floater({
  cfg,
  index,
  progress,
  reduced,
}: {
  cfg: FloaterCfg
  index: number
  progress: MotionValue<number>
  reduced: boolean | null
}) {
  // Nearer momos rush past faster — that difference is the parallax.
  const y = useTransform(progress, [0, 1], [0, -190 * cfg.depth])
  const x = useTransform(progress, [0, 1], [0, cfg.spin * 2.4])
  const spin = useTransform(progress, [0, 1], [cfg.spin, cfg.spin + cfg.spin * 3.5])
  const scale = useTransform(progress, [0, 1], [1, 1 + cfg.depth * 0.14])

  const drift = 12 + cfg.depth * 9
  const period = 5.5 + cfg.depth * 1.4

  return (
    <motion.span
      className="hero__floater"
      style={{
        left: cfg.left,
        top: cfg.top,
        width: cfg.size,
        height: cfg.size,
        ...(reduced ? {} : { y, x, rotate: spin, scale }),
      }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: 0.7 + index * 0.08,
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      <motion.span
        className="hero__floater-inner"
        animate={
          reduced
            ? {}
            : {
                y: [0, -drift, 4, -drift * 0.6, 0],
                x: [0, drift * 0.4, -drift * 0.3, 0],
                rotate: [0, 9, -7, 4, 0],
                scale: [1, 1.06, 0.97, 1.03, 1],
              }
        }
        transition={{
          duration: period,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.35,
        }}
      >
        <Momo tone={cfg.tone} />
        {cfg.steam && <Steam className="hero__floater-steam" />}
      </motion.span>
    </motion.span>
  )
}

/** Multiplies a scroll-progress value into a pixel offset. */
function useParallax(progress: MotionValue<number>, distance: number) {
  return useTransform(progress, [0, 1], [0, distance])
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  // 0 -> 1 as the hero scrolls out of view. Deliberately NOT a pinned/sticky
  // stage: a sticky stage needs a whole extra viewport to clear itself, and
  // that stretch shows up as an empty page after the truck has faded.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Back layers drift down slowly, front layers rush up — the further forward,
  // the bigger the number. The spread between these numbers IS the parallax,
  // so they are deliberately far apart.
  const skyY = useParallax(scrollYProgress, 300)
  const skylineY = useParallax(scrollYProgress, 150)
  const hazeY = useParallax(scrollYProgress, -120)
  const titleY = useParallax(scrollYProgress, -460)
  const truckY = useParallax(scrollYProgress, -120)

  const skyScale = useTransform(scrollYProgress, [0, 1], [1, 1.14])
  const skylineScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 1.32])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.42], [1, 0])
  // The truck simply drives off to the left as the hero scrolls away — no
  // zoom. A short hold first so it reads as parked, then it pulls out, picks up
  // a little motion blur, and is gone well before the hero is, so no empty
  // stretch is ever on screen. The veil carries the background into the flat
  // ink the next section starts on.
  const truckExitX = useTransform(scrollYProgress, [0, 0.1, 0.85], ['0%', '0%', '-190%'])
  const truckOpacity = useTransform(scrollYProgress, [0, 0.6, 0.85], [1, 1, 0])
  const truckBlur = useTransform(scrollYProgress, [0.25, 0.85], [0, 7])
  const truckFilter = useMotionTemplate`blur(${truckBlur}px)`
  const veilOpacity = useTransform(scrollYProgress, [0.5, 0.95], [0, 1])

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
    <section id="top" ref={ref} className="hero">
      <div
        className="hero__stage"
        onPointerMove={handlePointer}
        onPointerLeave={resetPointer}
      >
      {/* ---- back layers ------------------------------------------------ */}
      <motion.div
        className="hero__sky"
        style={reduced ? undefined : { y: skyY, scale: skyScale }}
        aria-hidden="true"
      />
      <div className="hero__vignette" aria-hidden="true" />

      <motion.div className="hero__haze" style={{ y: reduced ? 0 : hazeY }} aria-hidden="true">
        <span className="hero__blob hero__blob--red" />
        <span className="hero__blob hero__blob--orange" />
        <span className="hero__blob hero__blob--ember" />
      </motion.div>

      <motion.div
        className="hero__skyline"
        style={reduced ? undefined : { y: skylineY, scale: skylineScale }}
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
        style={
          reduced
            ? undefined
            : {
                x: truckExitX,
                y: truckY,
                opacity: truckOpacity,
                filter: truckFilter,
              }
        }
      >
        {/* pointer lean lives on its own layer so it never fights the exit */}
        <motion.div
          className="hero__truck-lean"
          style={reduced ? undefined : { x: truckLeanX, y: truckLeanY }}
        >
          <motion.div
            className="hero__truck-inner"
            /* drives in from the right, overshoots slightly, then settles */
            initial={{ opacity: 0, x: '118%' }}
            animate={{ opacity: 1, x: ['118%', '-2.5%', '0%'] }}
            transition={{
              opacity: { delay: 0.3, duration: 0.5 },
              x: { delay: 0.3, duration: 1.9, times: [0, 0.78, 1], ease: [0.16, 1, 0.3, 1] },
            }}
          >
            <FoodTruck className="hero__truck-svg" />
            <Steam className="hero__steam hero__steam--a" />
            <Steam className="hero__steam hero__steam--b" />
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="hero__floaters" aria-hidden="true">
        {floaters.map((f, i) => (
          <Floater key={i} cfg={f} index={i} progress={scrollYProgress} reduced={reduced} />
        ))}
      </div>

      <div className="hero__floor" aria-hidden="true" />

      <motion.div
        className="hero__veil"
        style={{ opacity: reduced ? 0 : veilOpacity }}
        aria-hidden="true"
      />

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
      </div>
    </section>
  )
}
