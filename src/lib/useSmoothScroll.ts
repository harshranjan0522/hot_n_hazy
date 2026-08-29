import { useEffect } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from 'motion/react'

/**
 * Drives page scroll through Lenis so the parallax layers glide instead of
 * stepping with the wheel. Returns nothing — it just takes over `window`
 * scrolling for the lifetime of the component, and stays out of the way
 * entirely when the visitor has asked for reduced motion.
 */
export function useSmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.1,
      // Gentle exponential ease-out — long tail, no rubber-band at the end.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    })

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    // A URL that arrives with a hash (#menu) is scrolled by the browser before
    // Lenis mounts, so Lenis starts at 0 and the page snaps back. Re-issue the
    // jump once, after layout has settled.
    let hashFrame = 0
    if (window.location.hash) {
      hashFrame = requestAnimationFrame(() => {
        const target = document.querySelector(window.location.hash)
        if (target) lenis.scrollTo(target as HTMLElement, { immediate: true, offset: -8 })
      })
    }

    // Let `href="#menu"` links hand off to Lenis instead of jumping.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]')
      if (!anchor) return
      const id = anchor.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (!target) return
      event.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: -8 })
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(hashFrame)
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [reduced])
}
