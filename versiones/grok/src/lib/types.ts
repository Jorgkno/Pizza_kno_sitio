export type EventType = "popup" | "collab"
export type FilterId = "all" | "catering" | "popup" | "collab"
export type DayState = "past" | "reserved" | "open" | "loading" | "error"

export type AgendaEvent = {
  sample?: boolean
  id: number | string
  day: number
  month: number
  year: number
  type: EventType
  title: string
  place: string
  time: string
  end: string
  image?: string
  description: string
  address?: string
}

export type Availability = {
  date: string
}

export type Draft = Record<string, string>
