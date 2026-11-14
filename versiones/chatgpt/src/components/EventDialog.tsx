import { useEffect, useRef, useState } from "react"
import { MONTHS } from "../lib/dates.ts"
import { downloadIcs } from "../lib/ics.ts"
import type { AgendaEvent } from "../lib/types.ts"

export function EventDialog({
  event,
  onClose,
  onToast,
}: {
  event: AgendaEvent | null
  onClose: () => void
  onToast: (message: string) => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (event) {
      returnFocus.current = document.activeElement as HTMLElement | null
      if (!dialog.open) dialog.showModal()
    } else if (dialog.open) {
      dialog.close()
      returnFocus.current?.focus()
    }
  }, [event])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="event-dialog-title"
      onCancel={(native) => {
        native.preventDefault()
        onClose()
      }}
      onClick={(native) => {
        if (native.target === dialogRef.current) onClose()
      }}
    >
      {event && (
        <article className="dialog-sheet">
          <button type="button" className="close" aria-label="Cerrar" onClick={onClose}>
            Cerrar
          </button>
          <div className="dialog-scroll">
            {!event.sample && <EventPhoto event={event} />}
            <span className={`kind kind-${event.type}`}>
              <i aria-hidden="true" />
              {event.type === "popup" ? "Pop-up" : "Colaboración"}
              {event.sample ? " · Muestra" : ""}
            </span>
            <h2 id="event-dialog-title">{event.title}</h2>
            <div className="detail-meta">
              <span>
                {event.day} de {MONTHS[event.month].toLowerCase()} de {event.year}
              </span>
              <span>
                {event.time} — {event.end} · Hora de Monterrey
              </span>
              <span>{event.place}</span>
            </div>
            <p>{event.description}</p>
            {event.sample ? (
              <div className="notice">
                Fecha y sede ilustrativas. Este encuentro todavía no tiene ubicación confirmada ni admite reservas.
              </div>
            ) : (
              <>
                {event.address ? <p>{event.address}</p> : null}
                <a
                  className="btn ghost"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address || event.place)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cómo llegar<span className="sr-only"> (se abre en otra página)</span>
                </a>
              </>
            )}
          </div>
          <div className="dialog-actions">
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                downloadIcs(event)
                onToast(event.sample ? "Evento de muestra descargado" : "Evento descargado")
              }}
            >
              {event.sample ? "Guardar fecha de muestra" : "Añadir a mi calendario"}
            </button>
            <button type="button" className="btn ghost" onClick={() => shareEvent(event, onToast)}>
              Compartir
            </button>
          </div>
        </article>
      )}
    </dialog>
  )
}

function EventPhoto({ event }: { event: AgendaEvent }) {
  const [failed, setFailed] = useState(false)
  if (!event.image || failed) {
    return <div className={`detail-image tone-${event.type}`} aria-hidden="true" />
  }
  return (
    <div className="detail-image">
      <img
        src={event.image}
        alt=""
        width={900}
        height={600}
        decoding="async"
        onError={() => setFailed(true)}
      />
    </div>
  )
}

async function shareEvent(event: AgendaEvent, onToast: (message: string) => void) {
  const url = new URL(location.href)
  url.searchParams.set("evento", String(event.id))
  try {
    if (navigator.share) {
      await navigator.share({
        title: event.title,
        text: (event.sample ? "Evento de muestra · " : "Kno’s Pizzas · ") + event.title,
        url: url.href,
      })
    } else {
      await navigator.clipboard.writeText(url.href)
      onToast("Enlace copiado")
    }
  } catch {
    onToast("No se pudo compartir. Puedes copiar el enlace del navegador.")
  }
}
