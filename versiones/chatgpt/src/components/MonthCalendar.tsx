import { BookButton } from "./BookButton.tsx"
import { MonthEventButton } from "./Events.tsx"
import { dayState, passesFilter } from "../lib/calendar.ts"
import { MONTHS, WEEKDAYS } from "../lib/dates.ts"
import type { AgendaEvent, FilterId } from "../lib/types.ts"

export function MonthCalendar({
  events,
  reserved,
  today,
  month,
  year,
  filter,
  loaded,
  error,
  onMonth,
  onToday,
  onBook,
  onEvent,
}: {
  events: AgendaEvent[]
  reserved: string[]
  today: string | null
  month: number | null
  year: number | null
  filter: FilterId
  loaded: boolean
  error: string
  onMonth: (delta: number) => void
  onToday: () => void
  onBook: (iso: string) => void
  onEvent: (event: AgendaEvent) => void
}) {
  const ready = month !== null && year !== null && today !== null
  const cells = ready ? buildCells(year, month) : []
  const inMonth = events.filter(
    (event) => passesFilter(event, filter) && event.month === month && event.year === year,
  )

  return (
    <section className="calendar-block month-block" id="vista-mes" aria-labelledby="month-title">
      <div className="section-intro">
        <p className="eyebrow">EXPLORA TODAS LAS FECHAS</p>
        <h2 id="month-title">Vista por mes</h2>
      </div>
      <div className="calendar-head">
        <h3>
          {ready ? (
            <>
              {MONTHS[month]} <span>{year}</span>
            </>
          ) : (
            "Consultando…"
          )}
        </h3>
        <div className="pager" aria-label="Navegación del mes">
          <button type="button" aria-label="Mes anterior" onClick={() => onMonth(-1)} disabled={!ready}>
            Anterior
          </button>
          <button type="button" aria-label="Mes siguiente" onClick={() => onMonth(1)} disabled={!ready}>
            Siguiente
          </button>
          <button type="button" className="today" onClick={onToday} disabled={!today}>
            Hoy
          </button>
        </div>
      </div>
      {ready ? (
        <div className="month-frame">
          <div className="weekdays" aria-hidden="true">
            {WEEKDAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="month-grid" aria-label={`Calendario de ${MONTHS[month]} de ${year}`}>
            {cells.map((cell) => {
              if (cell.outside) {
                return (
                  <div key={cell.iso} className="month-day outside">
                    <span className="month-num">{cell.day}</span>
                  </div>
                )
              }
              const dayEvents = inMonth.filter((event) => event.day === cell.day)
              const state = dayState(cell.iso, today, reserved, loaded, error)
              return (
                <div
                  key={cell.iso}
                  className={`month-day state-${state}${cell.iso === today ? " is-current" : ""}${reserved.includes(cell.iso) ? " is-booked" : ""}`}
                >
                  <span className="month-num">
                    {cell.day}
                    {cell.iso === today && <span className="hoy">Hoy</span>}
                  </span>
                  <div className="month-events">
                    {dayEvents.map((event) => (
                      <MonthEventButton key={String(event.id)} event={event} iso={cell.iso} onEvent={onEvent} />
                    ))}
                  </div>
                  <BookButton state={state} iso={cell.iso} onBook={onBook} />
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <p role="status">Consultando…</p>
      )}
      <div className="legend">
        <span>
          <i className="swatch swatch-popup" aria-hidden="true" /> Pop-ups
        </span>
        <span>
          <i className="swatch swatch-collab" aria-hidden="true" /> Colaboraciones
        </span>
        <span>
          <i className="swatch swatch-catering" aria-hidden="true" /> Solicitar catering
        </span>
        <span>
          <i className="swatch swatch-reserved" aria-hidden="true" /> Reservado
        </span>
      </div>
      <p className="sample-note">Las fechas de catering se confirman después de revisar tu solicitud.</p>
    </section>
  )
}

function buildCells(year: number, month: number): { iso: string; day: number; outside: boolean }[] {
  const lead = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7
  const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const total = Math.ceil((lead + count) / 7) * 7
  return Array.from({ length: total }, (_, index) => {
    const day = index - lead + 1
    const date = new Date(Date.UTC(year, month, day))
    return {
      iso: date.toISOString().slice(0, 10),
      day: date.getUTCDate(),
      outside: day < 1 || day > count,
    }
  })
}
