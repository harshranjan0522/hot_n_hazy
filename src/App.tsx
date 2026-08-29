import { motion, useScroll, useSpring } from 'motion/react'
import { useSmoothScroll } from './lib/useSmoothScroll'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Story from './components/Story'
import MenuSection from './components/MenuSection'
import Care from './components/Care'
import Testimonials from './components/Testimonials'
import FindUs from './components/FindUs'
import Footer from './components/Footer'

export default function App() {
  useSmoothScroll()

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })

  return (
    <>
      <a className="skip-link" href="#menu">
        Skip to the menu
      </a>

      <motion.div className="progress" style={{ scaleX: progress }} aria-hidden="true" />

      <Nav />

      <main id="main">
        <Hero />
        <Marquee />
        <Story />
        <MenuSection />
        <Marquee reverse />
        <Care />
        <Testimonials />
        <FindUs />
      </main>

      <Footer />

      <div className="grain" aria-hidden="true" />
    </>
  )
}
