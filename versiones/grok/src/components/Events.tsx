import { useState } from "react"
import { eventKey, longDate, MONTHS, weekdayShort } from "../lib/dates.ts"
import type { AgendaEvent } from "../lib/types.ts"

function Kind({ event, sampleWord }: { event: AgendaEvent; sampleWord: string }) {
  return (
    <span className={`kind kind-${event.type}`}>
      <i aria-hidden="true" />
      {event.type === "popup" ? "Pop-up" : "Colaboración"}
      {event.sample ? sampleWord : ""}
    </span>
  )
}

function Photo({ event }: { event: AgendaEvent }) {
  const [failed, setFailed] = useState(false)
  if (!event.image || failed) {
    return <span className={`photo-fallback tone-${event.type}`} aria-hidden="true" />
  }
  return (
    <img
      src={event.image}
      alt=""
      width={900}
      height={600}
      loading="lazy"
      decoding="async"
      fetchPriority="low"
      onError={() => setFailed(true)}
    />
  )
}

export function Events({
  events,
  today,
  loaded,
  error,
  onEvent,
}: {
  events: AgendaEvent[]
  today: string | null
  loaded: boolean
  error: string
  onEvent: (event: AgendaEvent) => void
}) {
  const upcoming = today
    ? events
        .filter((event) => eventKey(event) >= today)
        .sort((a, b) => eventKey(a).localeCompare(eventKey(b)) || a.time.localeCompare(b.time))
    : []
  const samples = events.some((event) => event.sample)

  return (
    <section className="events" id="encuentros" aria-labelledby="encounters-title">
      <div className="section-intro">
        <h2 id="encounters-title">Próximos pop-ups y colaboraciones</h2>
      </div>
      {!today || !loaded ? (
        <p role="status">Cargando encuentros…</p>
      ) : error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : upcoming.length === 0 ? (
        <p className="empty">Aún no hay próximos encuentros. Consulta las fechas de catering en la semana.</p>
      ) : (
        <div className="event-list">
          {upcoming.map((event) => {
            const key = eventKey(event)
            return (
              <button
                key={String(event.id)}
                type="button"
                className={`event-card tone-${event.type}`}
                onClick={() => onEvent(event)}
                aria-label={`Ver detalles de ${event.title}, ${longDate(key)}`}
              >
                <span className={`date-badge tone-${event.type}`}>
                  <small>{MONTHS[event.month].slice(0, 3)}</small>
                  <strong>{event.day}</strong>
                  <span>{weekdayShort(key)}</span>
                </span>
                <span className="event-photo">
                  <Photo event={event} />
                  <Kind event={event} sampleWord=" · Ejemplo" />
                </span>
                <span className="event-copy">
                  <span className="event-title">{event.title}</span>
                  <span>
                    {longDate(key)} · {event.time}–{event.end}
                  </span>
                  <span>{event.place}</span>
                  <span className="text-link">Ver detalles</span>
                </span>
              </button>
            )
          })}
        </div>
      )}
      {loaded && (
        <p className="sample-note">
          {samples
            ? "Encuentros de ejemplo · Fechas y sedes ilustrativas."
            : "Horarios locales de Monterrey."}
        </p>
      )}
    </section>
  )
}

export function WeekEventButton({
  event,
  onEvent,
}: {
  event: AgendaEvent
  onEvent: (event: AgendaEvent) => void
}) {
  return (
    <button
      type="button"
      className={`mini-event tone-${event.type}`}
      onClick={() => onEvent(event)}
      aria-label={`Ver detalles de ${event.title}`}
    >
      <span className="mini-photo">
        <Photo event={event} />
      </span>
      <span>
        <small>
          {event.type === "popup" ? "Pop-up" : "Colaboración"}
          {event.sample ? " · Ejemplo" : ""}
        </small>
        <strong>{event.title}</strong>
        <span>
          {event.time}–{event.end}
        </span>
      </span>
    </button>
  )
}

export function MonthEventButton({
  event,
  iso,
  onEvent,
}: {
  event: AgendaEvent
  iso: string
  onEvent: (event: AgendaEvent) => void
}) {
  return (
    <button
      type="button"
      className={`month-chip tone-${event.type}`}
      title={event.title}
      onClick={() => onEvent(event)}
      aria-label={`Ver detalles de ${event.title}, ${longDate(iso)}`}
    >
      <span className="mini-photo">
        <Photo event={event} />
      </span>
      <span>{event.type === "popup" ? "Pop-up" : "Colab."}</span>
    </button>
  )
}
