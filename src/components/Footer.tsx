import Logo from './Logo'
import { business } from '../content'

const elsewhere = [
  { label: 'Instagram', href: business.instagram },
  { label: 'Zomato', href: business.zomatoUrl },
  { label: 'FavHiker', href: business.favhikerUrl },
  { label: 'Google Maps', href: business.mapsUrl },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div className="footer__brand">
          <Logo className="footer__logo" idPrefix="foot" />
          <p className="footer__hand">Come hungry — leave happy.</p>
        </div>

        <nav className="footer__links" aria-label="Elsewhere">
          <h2 className="footer__h">Find us online</h2>
          <ul>
            {elsewhere.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__where">
          <h2 className="footer__h">The truck</h2>
          <address>
            {business.address}
            <br />
            {business.city}
          </address>
          <p>
            {business.hours}
            <br />
            {business.days}
          </p>
        </div>
      </div>

      <div className="shell footer__base">
        <p>
          &copy; {new Date().getFullYear()} {business.name}. All rights reserved.
        </p>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  )
}
