export function Hero({ onBook }: { onBook: () => void }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">SIEMPRE HAY ALGO COCINÁNDOSE</p>
        <h1 id="hero-title">
          Pop-ups & <em>colaboraciones.</em>
        </h1>
        <p className="lede">Pizza para compartir. Descubre dónde nos encontramos.</p>
        <p className="lede quiet">Celebraciones, equipos y momentos que merecen buena comida.</p>
        <div className="hero-actions">
          <a className="btn primary" href="#encuentros">
            Ver próximas fechas
          </a>
          <button type="button" className="btn ghost" onClick={onBook}>
            Solicitar catering
          </button>
        </div>
        <a className="text-link" href="#calendario">
          Ver semana y agendar catering
        </a>
      </div>
      <aside className="hero-aside" aria-hidden="true">
        <p className="hero-mark">✳</p>
        <p>Kno’s</p>
        <p>Monterrey</p>
      </aside>
    </section>
  )
}
