import { useEffect, useState } from "react"

export function Header({
  active,
  onBook,
}: {
  active: "calendario" | "encuentros" | ""
  onBook: () => void
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 900) setOpen(false)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return (
    <header className="site-header" onKeyDown={(event) => event.key === "Escape" && setOpen(false)}>
      <div className="header-inner">
        <a className="brand" href="/" aria-label="Kno’s Pizzas, inicio">
          <span className="brand-name">
            Kno’s<span className="mark" aria-hidden="true">✳</span>
          </span>
          <small>PIZZAS · CATERING & POP-UPS</small>
        </a>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Cerrar" : "Menú"}
        </button>
        <nav id="site-nav" className={open ? "open" : ""} aria-label="Secciones">
          <a
            href="#calendario"
            aria-current={active === "calendario" ? "true" : undefined}
            onClick={() => setOpen(false)}
          >
            Calendario
          </a>
          <a
            href="#encuentros"
            aria-current={active === "encuentros" ? "true" : undefined}
            onClick={() => setOpen(false)}
          >
            Pop-ups & colaboraciones
          </a>
          <button
            type="button"
            className="btn primary nav-book"
            onClick={() => {
              setOpen(false)
              onBook()
            }}
          >
            Planeemos tu evento
          </button>
        </nav>
      </div>
    </header>
  )
}
