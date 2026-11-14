import type { AgendaEvent, DayState, FilterId } from "./types.ts"
import { eventKey } from "./dates.ts"

export function passesFilter(event: AgendaEvent, filter: FilterId): boolean {
  return filter === "all" || (filter !== "catering" && event.type === filter)
}

export function dayState(
  iso: string,
  today: string,
  reserved: string[],
  loaded: boolean,
  error: string,
): DayState {
  if (error) return "error"
  if (!loaded) return "loading"
  if (iso < today) return "past"
  if (reserved.includes(iso)) return "reserved"
  return "open"
}

export function bookLabel(state: DayState): string {
  if (state === "reserved") return "Reservado"
  if (state === "past") return "Fecha pasada"
  if (state === "loading") return "Consultando"
  if (state === "error") return "No disponible"
  return "Agendar"
}

export function bookAria(state: DayState, iso: string, longDate: (iso: string) => string): string {
  const action =
    state === "open"
      ? "Agendar catering"
      : state === "reserved"
        ? "Catering reservado"
        : state === "past"
          ? "Fecha pasada, catering no disponible"
          : state === "error"
            ? "Agenda no disponible"
            : "Consultando disponibilidad"
  return `${action} el ${longDate(iso)}`
}

export function weekStatus(iso: string, today: string, reserved: string[], loaded: boolean, error: string): {
  title: string
  note: string
} {
  if (!loaded) return { title: "Consultando…", note: "" }
  if (error) return { title: "Agenda no disponible", note: "" }
  if (iso < today) return { title: "Fecha pasada", note: "" }
  if (reserved.includes(iso)) return { title: "Catering reservado", note: "" }
  return { title: "Fecha para catering", note: "Sujeto a confirmación" }
}

export function eventsOnDate(events: AgendaEvent[], iso: string, filter: FilterId): AgendaEvent[] {
  return events
    .filter((event) => passesFilter(event, filter) && eventKey(event) === iso)
    .sort((a, b) => a.time.localeCompare(b.time))
}
