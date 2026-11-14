export function Hero({ onBook }: { onBook: () => void }) {
  return <section className="hero" aria-labelledby="hero-title">
    <div className="hero-copy"><p className="eyebrow">SIEMPRE HAY ALGO COCINÁNDOSE</p>
    <h1 id="hero-title">Pop-ups &<br/><em>colaboraciones.</em></h1>
    <p className="lede">Pizza para compartir. Descubre dónde nos encontramos.</p>
    <a className="text-link" href="#calendario">Ver semana y agendar catering <span aria-hidden="true">↓</span></a></div>
    <button className="hero-seal" onClick={onBook}><span aria-hidden="true">✳</span><span>Planeemos<br/>tu evento</span><span aria-hidden="true">↗</span></button>
  </section>
}
