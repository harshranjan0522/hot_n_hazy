import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import Logo from './Logo'
import { business } from '../content'

const links = [
  { href: '#story', label: 'Our story' },
  { href: '#menu', label: 'Menu' },
  { href: '#care', label: 'How we cook' },
  { href: '#find', label: 'Find us' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40))

  // Freeze the page behind the mobile sheet, and let Escape close it.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <motion.header
        className={`nav${scrolled ? ' nav--solid' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="nav__inner">
          <a className="nav__brand" href="#top" aria-label="Hot n Hazy — home">
            <Logo className="nav__mark" withText={false} idPrefix="nav" />
            <span className="nav__brand-text">
              Hot <em>n</em> Hazy
            </span>
          </a>

          <nav className="nav__links" aria-label="Primary">
            {links.map((link) => (
              <a key={link.href} className="nav__link" href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <a className="btn btn--flame btn--sm nav__cta" href="#find">
            Tonight&rsquo;s spot
          </a>

          <button
            className="nav__burger"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <span className={`nav__burger-bar${open ? ' is-open' : ''}`} aria-hidden="true" />
            <span className={`nav__burger-bar${open ? ' is-open' : ''}`} aria-hidden="true" />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="sheet"
            initial={{ opacity: 0, clipPath: 'circle(0% at 92% 5%)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 92% 5%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 92% 5%)' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="sheet__links" aria-label="Mobile">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14 + i * 0.07, duration: 0.5 }}
                >
                  <span className="sheet__index">0{i + 1}</span>
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <motion.p
              className="sheet__note"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              Open {business.hours} · Bokaro Steel City
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
