import Reveal from './Reveal'
import { business } from '../content'

const details = [
  { label: 'Where', value: [business.address, business.city] },
  { label: 'When', value: [business.hours, business.days] },
  { label: 'Damage', value: [business.priceBand, 'per plate, roughly'] },
]

export default function FindUs() {
  return (
    <section className="section find" id="find">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">Find the truck</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="section-title">
            City Centre, Sector 4 — <span className="flame-text">every evening</span>
          </h2>
        </Reveal>

        <div className="find__grid">
          <div className="find__info">
            <dl className="find__list">
              {details.map((d, i) => (
                <Reveal key={d.label} delay={0.1 + i * 0.08} className="find__row">
                  <dt>{d.label}</dt>
                  <dd>
                    {d.value.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </dd>
                </Reveal>
              ))}
            </dl>

            <Reveal delay={0.34} className="find__actions">
              <a className="btn btn--flame" href={business.mapsUrl} target="_blank" rel="noopener noreferrer">
                Open in Maps
                <span className="btn__arrow" aria-hidden="true">↗</span>
              </a>
              <a className="btn btn--ghost" href={business.instagram} target="_blank" rel="noopener noreferrer">
                {business.instagramHandle}
              </a>
            </Reveal>
          </div>

          <Reveal from="right" delay={0.12} className="find__map">
            <iframe
              src={business.mapEmbedUrl}
              title={`Map showing ${business.name} in Bokaro Steel City`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <span className="find__map-frame" aria-hidden="true" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
