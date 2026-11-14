import type { AgendaEvent } from "./types.ts"

function escapeIcs(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
}

export function buildIcs(event: AgendaEvent): string {
  const stamp = `${event.year}${String(event.month + 1).padStart(2, "0")}${String(event.day).padStart(2, "0")}`
  const dtstamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0]
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Knos Pizzas//Agenda//ES",
    "BEGIN:VEVENT",
    `UID:knos-${event.sample ? "example-" : ""}${event.id}@knos-pizzas.local`,
    `DTSTAMP:${dtstamp}Z`,
    `DTSTART;TZID=America/Monterrey:${stamp}T${event.time.replace(":", "")}00`,
    `DTEND;TZID=America/Monterrey:${stamp}T${event.end.replace(":", "")}00`,
    `SUMMARY:${escapeIcs((event.sample ? "[MUESTRA] " : "") + event.title)}`,
    `LOCATION:${escapeIcs(event.address || event.place)}`,
    "DESCRIPTION:" +
      escapeIcs(
        event.sample
          ? "Evento de muestra. Fecha y sede pendientes de confirmación."
          : event.description,
      ) +
      "\\nHorario local de Monterrey.",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  return lines.join("\r\n")
}

export function downloadIcs(event: AgendaEvent): void {
  const blob = new Blob([buildIcs(event)], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "knos-evento.ics"
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
