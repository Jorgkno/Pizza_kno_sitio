export const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const

export const WEEKDAYS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"] as const

export function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export function startOfWeek(iso: string): string {
  const day = new Date(`${iso}T12:00:00Z`).getUTCDay()
  return addDays(iso, -((day + 6) % 7))
}

export function weekDays(iso: string): string[] {
  const start = startOfWeek(iso)
  return Array.from({ length: 7 }, (_, index) => addDays(start, index))
}

export function formatDate(
  iso: string,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat("es-MX", {
    ...options,
    timeZone: "UTC",
  }).format(new Date(`${iso}T12:00:00Z`))
}

export function weekdayShort(iso: string): string {
  return formatDate(iso, { weekday: "short" }).replace(".", "")
}

export function longDate(iso: string): string {
  return formatDate(iso, { day: "numeric", month: "long", year: "numeric" })
}

export function weekRangeLabel(iso: string): string {
  const end = addDays(iso, 6)
  const startDate = new Date(`${iso}T12:00:00Z`)
  const endDate = new Date(`${end}T12:00:00Z`)
  if (startDate.getUTCFullYear() === endDate.getUTCFullYear()) {
    if (startDate.getUTCMonth() === endDate.getUTCMonth()) {
      return `${startDate.getUTCDate()} al ${formatDate(end, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`
    }
    return `${formatDate(iso, { day: "numeric", month: "short" })} a ${formatDate(end, {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`
  }
  return `${formatDate(iso, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} a ${formatDate(end, { day: "numeric", month: "short", year: "numeric" })}`
}

export function eventKey(event: {
  year: number
  month: number
  day: number
}): string {
  return `${event.year}-${String(event.month + 1).padStart(2, "0")}-${String(event.day).padStart(2, "0")}`
}

export function monterreyToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Monterrey",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now)
  const bag: Record<string, string> = {}
  for (const part of parts) {
    if (part.type !== "literal") bag[part.type] = part.value
  }
  return `${bag.year}-${bag.month}-${bag.day}`
}

export function monthParts(iso: string): { year: number; month: number } {
  const [year, month] = iso.split("-").map(Number)
  return { year, month: month - 1 }
}
