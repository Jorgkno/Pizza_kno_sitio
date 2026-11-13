const SLOTS = [1, 2, 3]

export function Experiencia() {
  return (
    <section className="experiencia" id="experiencia" aria-labelledby="experiencia-titulo">
      <div className="section-intro">
        <p className="eyebrow">PIZZAS · CATERING & POP-UPS</p>
        <h2 id="experiencia-titulo">Momentos para quedarse.</h2>
      </div>
      <div className="slots">
        {SLOTS.map((slot) => (
          <figure key={slot}>
            <div className="slot" role="img" aria-label="Espacio para fotografía, sin imagen" />
            <figcaption>Sin fotografía</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
