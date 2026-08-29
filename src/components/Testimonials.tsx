import Reveal from './Reveal'
import { reviews, ratings, business } from '../content'

function Stars({ count }: { count: number }) {
  return (
    <span className="stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < count ? 'stars__on' : 'stars__off'} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  )
}

export default function Testimonials() {
  const google = ratings[0]

  return (
    <section className="section reviews" id="reviews">
      <div className="shell">
        <div className="reviews__head">
          <div>
            <Reveal>
              <p className="eyebrow">What Bokaro says</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="section-title">
                Straight from <span className="flame-text">Google reviews</span>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="reviews__score">
            <span className="reviews__score-num">{google.score}</span>
            <Stars count={5} />
            <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer">
              {google.count} on Google ↗
            </a>
          </Reveal>
        </div>

        <ul className="reviews__grid">
          {reviews.map((r, i) => (
            <Reveal as="li" key={r.name} delay={(i % 3) * 0.08} className="review">
              <Stars count={r.stars} />
              <blockquote className="review__quote">{r.quote}</blockquote>
              <footer className="review__by">
                <span className="review__avatar" aria-hidden="true">
                  {r.name.charAt(0)}
                </span>
                <span>
                  <strong>{r.name}</strong>
                  <em>{r.meta}</em>
                </span>
              </footer>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <p className="reviews__note">
            Reviews quoted as written by the people who left them on Google.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
