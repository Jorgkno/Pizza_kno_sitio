import { BookButton } from "./BookButton.tsx"
import { WeekEventButton } from "./Events.tsx"
import { dayState, eventsOnDate, weekStatus } from "../lib/calendar.ts"
import { longDate, weekDays, weekRangeLabel, weekdayShort } from "../lib/dates.ts"
import type { AgendaEvent, FilterId } from "../lib/types.ts"

const FILTERS: [FilterId, string][] = [
  ["all", "Todo"],
  ["catering", "Catering"],
  ["popup", "Pop-ups"],
  ["collab", "Colaboraciones"],
]

export function WeekCalendar({
  events,
  reserved,
  today,
  week,
  filter,
  loaded,
  error,
  onFilter,
  onWeek,
  onToday,
  onBook,
  onEvent,
}: {
  events: AgendaEvent[]
  reserved: string[]
  today: string | null
  week: string | null
  filter: FilterId
  loaded: boolean
  error: string
  onFilter: (filter: FilterId) => void
  onWeek: (iso: string) => void
  onToday: () => void
  onBook: (iso: string) => void
  onEvent: (event: AgendaEvent) => void
}) {
  const days = week ? weekDays(week) : []

  return (
    <section className="calendar-block" id="calendario" aria-labelledby="week-title">
      <div className="calendar-head">
        <div>
          <p className="eyebrow">TU PRÓXIMA PIZZA YA TIENE FECHA</p>
          <h2 id="week-title">Vista por semana</h2>
          <p aria-live="polite">{week ? weekRangeLabel(week) : "Consultando…"}</p>
        </div>
        <div className="pager" aria-label="Navegación de la semana">
          <button type="button" aria-label="Semana anterior" onClick={() => week && onWeek(shift(week, -7))} disabled={!week}>
            Anterior
          </button>
          <button type="button" aria-label="Semana siguiente" onClick={() => week && onWeek(shift(week, 7))} disabled={!week}>
            Siguiente
          </button>
          <button type="button" className="today" onClick={onToday} disabled={!today}>
            Hoy
          </button>
        </div>
      </div>
      <div className="filters" role="group" aria-label="Filtrar calendarios">
        {FILTERS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={filter === id}
            className={filter === id ? "selected" : ""}
            onClick={() => onFilter(id)}
          >
            {id !== "all" && <i className={`swatch swatch-${id}`} aria-hidden="true" />}
            <span>{label}</span>
          </button>
        ))}
      </div>
      {!week || !today ? (
        <p role="status">Consultando…</p>
      ) : (
        <div className="week-list" aria-label="Calendario semanal">
          {days.map((iso) => {
            const dayEvents = eventsOnDate(events, iso, filter)
            const state = dayState(iso, today, reserved, loaded, error)
            const status = weekStatus(iso, today, reserved, loaded, error)
            const popup = dayEvents.some((event) => event.type === "popup")
            const collab = dayEvents.some((event) => event.type === "collab")
            return (
              <div
                key={iso}
                className={`week-day${iso === today ? " is-current" : ""}${popup ? " is-popup" : ""}${collab ? " is-collab" : ""} state-${state}`}
                aria-label={longDate(iso).replace(/^/, `${weekdayName(iso)}, `)}
              >
                <div className="day-num">
                  <small>{weekdayShort(iso)}</small>
                  <strong>{Number(iso.slice(8))}</strong>
                  {iso === today && <span className="hoy">Hoy</span>}
                </div>
                <div className="day-body">
                  {dayEvents.length > 0 ? (
                    dayEvents.map((event) => (
                      <WeekEventButton key={String(event.id)} event={event} onEvent={onEvent} />
                    ))
                  ) : (
                    <p>
                      {status.title}
                      {status.note ? <small>{status.note}</small> : null}
                    </p>
                  )}
                </div>
                <BookButton state={state} iso={iso} onBook={onBook} />
              </div>
            )
          })}
        </div>
      )}
      <p className="legend">
        <span>
          <i className="swatch swatch-popup" aria-hidden="true" /> Pop-up
        </span>
        <span>
          <i className="swatch swatch-collab" aria-hidden="true" /> Colaboración
        </span>
        <span>Catering sujeto a confirmación</span>
      </p>
    </section>
  )
}

function shift(iso: string, days: number): string {
  const date = new Date(`${iso}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function weekdayName(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", { weekday: "long", timeZone: "UTC" }).format(
    new Date(`${iso}T12:00:00Z`),
  )
}
