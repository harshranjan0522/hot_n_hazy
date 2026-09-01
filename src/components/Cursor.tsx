import { useEffect, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
} from 'motion/react'
import Momo from './Momo'

/**
 * The pointer, as a momo.
 *
 * Mounted only for fine pointers (see App) — a touch device has no cursor to
 * replace, and the native one is left alone there. Two nested layers on
 * purpose: the outer carries the spring that chases the pointer, the inner the
 * lean it picks up from its own velocity. One element would make them fight
 * over `transform`.
 *
 * The native cursor is hidden by `.has-momo-cursor` on <html>, which is added
 * here rather than in the stylesheet so the class only ever exists while this
 * component is actually mounted and drawing something.
 */

/** Anything worth a hover state. Matches the real controls on the page. */
const INTERACTIVE =
  'a, button, [role="tab"], input, textarea, select, summary, [tabindex]:not([tabindex="-1"])'

export default function Cursor() {
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const [hot, setHot] = useState(false)
  const [down, setDown] = useState(false)

  // Off-screen until the first real pointer event, so it never flashes at 0,0.
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  // Stiff enough to click accurately, soft enough to have some weight to it.
  const spring = { stiffness: 900, damping: 45, mass: 0.35 }
  const springX = useSpring(x, spring)
  const springY = useSpring(y, spring)

  // It leans into the direction it is being dragged, like it is being carried.
  const velocity = useVelocity(springX)
  const lean = useTransform(velocity, [-2400, 2400], [20, -20], { clamp: true })
  const tilt = useSpring(lean, { stiffness: 240, damping: 24 })

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const target = event.target as Element | null

      // Over the map embed the parent stops receiving moves, so the momo would
      // freeze at the edge. Hand the pointer back to the iframe instead.
      if (target?.tagName === 'IFRAME') {
        setVisible(false)
        return
      }

      x.set(event.clientX)
      y.set(event.clientY)
      setVisible(true)
      setHot(Boolean(target?.closest?.(INTERACTIVE)))
    }

    const hide = () => setVisible(false)
    const onDown = () => setDown(true)
    const onUp = () => setDown(false)

    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerdown', onDown, { passive: true })
    document.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('mouseleave', hide)
    window.addEventListener('blur', hide)
    document.documentElement.classList.add('has-momo-cursor')

    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('mouseleave', hide)
      window.removeEventListener('blur', hide)
      document.documentElement.classList.remove('has-momo-cursor')
    }
  }, [x, y])

  return (
    <motion.div
      className={`momo-cursor${hot ? ' is-hot' : ''}${down ? ' is-down' : ''}`}
      aria-hidden="true"
      style={{
        x: reduced ? x : springX,
        y: reduced ? y : springY,
        opacity: visible ? 1 : 0,
      }}
    >
      <motion.span className="momo-cursor__lean" style={{ rotate: reduced ? 0 : tilt }}>
        {/* It goes hot over anything clickable. Chilli rather than fried on
            purpose: the golden momo vanishes into the amber buttons, which is
            exactly where the hover state needs to be readable. */}
        <Momo className="momo-cursor__svg" variant={hot ? 'chilli' : 'steamed'} idPrefix="cursor" />
      </motion.span>
    </motion.div>
  )
}
