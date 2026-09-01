import { useEffect } from 'react'

/**
 * Infinite CSS animations keep ticking when their section is scrolled out of
 * view — browsers do not throttle them. With ~25 of them running at once the
 * page never gets an idle frame, so there is no headroom left when a real
 * scroll arrives and *everything* feels laggy, not just the hero.
 *
 * This parks each animated region while it is off screen. Regions opt in with
 * `data-anim`; the `.is-parked` class freezes every animation inside them.
 */
export function usePauseOffscreen() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-anim]')
    if (!nodes.length || !('IntersectionObserver' in window)) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle('is-parked', !entry.isIntersecting)
        }
      },
      // A margin of slack so a region is already running by the time it edges in.
      { rootMargin: '15% 0px' },
    )

    nodes.forEach((node) => io.observe(node))
    return () => io.disconnect()
  }, [])
}
