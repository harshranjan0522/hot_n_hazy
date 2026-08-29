import Reveal from './Reveal'

const pillars = [
  {
    n: '01',
    title: 'Made fresh, nightly',
    body: 'Nothing sits overnight. Fillings are prepped for the evening and the steamers start from cold at 5:30.',
  },
  {
    n: '02',
    title: 'Hygiene you can watch',
    body: 'Our counter faces you on purpose. Gloves on, surfaces wiped down between batches, no hidden kitchen.',
  },
  {
    n: '03',
    title: 'Heat, dialled to you',
    body: 'Chilli and peri peri go on at the end, so we can take it up or pull it right back before it reaches you.',
  },
  {
    n: '04',
    title: 'Served hot or not at all',
    body: 'Momos go from basket to plate. If a batch has been standing, it does not leave the window.',
  },
]

export default function Care() {
  return (
    <section className="section care" id="care">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">How we cook</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="section-title">
            Made with love, <span className="flame-text">immense care</span> and full hygiene
          </h2>
        </Reveal>

        <ul className="care__list">
          {pillars.map((p, i) => (
            <Reveal as="li" key={p.n} delay={i * 0.09} className="care__card">
              <span className="care__n">{p.n}</span>
              <h3 className="care__title">{p.title}</h3>
              <p className="care__body">{p.body}</p>
              <span className="care__glow" aria-hidden="true" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
