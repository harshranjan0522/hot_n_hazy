import { useEffect, useState } from 'react'

/**
 * Subscribes to a media query from React.
 *
 * Reads synchronously on first render so the initial paint is already correct
 * — a mount-then-correct would build the full desktop-weight hero on a phone
 * once, which is the exact work we are trying to avoid.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    onChange()
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/**
 * Touch-first devices. Gates the effects that cost the most on a mobile GPU
 * — full-viewport blends, wide blurs, backdrop sampling — and hands scrolling
 * back to the OS. Deliberately about input, not width: a narrow desktop window
 * still has the GPU to spare.
 */
export const useCoarsePointer = () => useMediaQuery('(pointer: coarse)')

/** Matches the phone breakpoint the stylesheets lay out against. */
export const useNarrowScreen = () => useMediaQuery('(max-width: 720px)')
