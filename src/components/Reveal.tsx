import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 44 },
  down: { x: 0, y: -44 },
  left: { x: 44, y: 0 },
  right: { x: -44, y: 0 },
  none: { x: 0, y: 0 },
}

type RevealProps = {
  children: ReactNode
  /** Which way the element travels in from. */
  from?: Direction
  /** Seconds to wait before starting — use to stagger siblings by hand. */
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'span' | 'p'
}

/**
 * Fades and slides its children in the first time they cross into view.
 * Collapses to a plain fade-free render under prefers-reduced-motion so
 * content is never gated behind an animation that will not play.
 */
export default function Reveal({
  children,
  from = 'up',
  delay = 0,
  className,
  as = 'div',
}: RevealProps) {
  const reduced = useReducedMotion()
  const Tag = motion[as]

  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  const { x, y } = offsets[from]

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  )
}
