import { gestionUrl } from "../lib/api.ts"

export function Footer() {
  return (
    <footer>
      <a className="footer-brand" href="/">
        Kno’s Pizzas✳
      </a>
      <span>Pizza para compartir. Momentos para quedarse.</span>
      <a href={gestionUrl()}>
        Gestionar agenda ↗<span className="sr-only"> (se abre en otra página)</span>
      </a>
    </footer>
  )
}
