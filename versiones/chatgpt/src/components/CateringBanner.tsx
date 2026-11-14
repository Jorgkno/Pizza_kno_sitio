export function CateringBanner({ onBook }: { onBook: () => void }) {
  return (
    <section className="banner" aria-labelledby="banner-title">
      <span className="banner-mark" aria-hidden="true">
        ✳
      </span>
      <div>
        <p className="eyebrow">NOSOTROS LLEVAMOS LAS PIZZAS</p>
        <h2 id="banner-title">Tú pones el motivo.</h2>
        <p>Celebraciones, equipos y momentos que merecen buena comida.</p>
      </div>
      <button type="button" className="btn primary" onClick={onBook}>
        Cuéntanos tu idea
      </button>
    </section>
  )
}
