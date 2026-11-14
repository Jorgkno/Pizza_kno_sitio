import { useEffect, useState } from "react"
import { CateringBanner } from "./components/CateringBanner.tsx"
import { CateringDialog } from "./components/CateringDialog.tsx"
import { EventDialog } from "./components/EventDialog.tsx"
import { Events } from "./components/Events.tsx"
import { Footer } from "./components/Footer.tsx"
import { Header } from "./components/Header.tsx"
import { Hero } from "./components/Hero.tsx"
import { MonthCalendar } from "./components/MonthCalendar.tsx"
import { WeekCalendar } from "./components/WeekCalendar.tsx"
import { apiUrl } from "./lib/api.ts"
import { eventKey, monthParts, monterreyToday, startOfWeek } from "./lib/dates.ts"
import { SAMPLE_EVENTS } from "./lib/sample.ts"
import type { AgendaEvent, Availability, FilterId } from "./lib/types.ts"

export default function App() {
  const [today] = useState(() => monterreyToday())
  const [week, setWeek] = useState(() => startOfWeek(monterreyToday()))
  const [month, setMonth] = useState(() => monthParts(monterreyToday()).month)
  const [year, setYear] = useState(() => monthParts(monterreyToday()).year)
  const [events, setEvents] = useState<AgendaEvent[]>([])
  const [reserved, setReserved] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<FilterId>("all")
  const [activeEvent, setActiveEvent] = useState<AgendaEvent | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingDate, setBookingDate] = useState("")
  const [toast, setToast] = useState("")
  const [activeNav, setActiveNav] = useState<"calendario" | "encuentros" | "">("")

  useEffect(() => {
    if (!today) return
    let cancelled = false
    Promise.all([fetch(apiUrl("/api/eventos")), fetch(apiUrl("/api/disponibilidad"))])
      .then(async ([eventsResponse, availabilityResponse]) => {
        if (!eventsResponse.ok || !availabilityResponse.ok) throw new Error()
        const eventsJson: unknown = await eventsResponse.json()
        const availabilityJson: unknown = await availabilityResponse.json()
        if (!Array.isArray(eventsJson) || !Array.isArray(availabilityJson)) throw new Error()
        if (cancelled) return
        const list = (eventsJson.length ? eventsJson : SAMPLE_EVENTS) as AgendaEvent[]
        setEvents(list)
        setReserved((availabilityJson as Availability[]).map((item) => item.date))
        setLoaded(true)
        const requested = new URLSearchParams(location.search).get("evento")
        const match = list.find((item) => String(item.id) === requested)
        if (match) {
          setMonth(match.month)
          setYear(match.year)
          setWeek(startOfWeek(eventKey(match)))
          setActiveEvent(match)
        }
      })
      .catch(() => {
        if (cancelled) return
        setError("No pudimos cargar la agenda. Recarga la página para consultar las fechas.")
        setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [today])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(""), 3500)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const nodes = ["encuentros", "calendario", "vista-mes"]
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node))
    if (!nodes.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const id = visible.target.id
        setActiveNav(id === "encuentros" ? "encuentros" : "calendario")
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: [0.15, 0.35, 0.6] },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [today])

  function openBooking(date = "") {
    if (!today) return
    setActiveEvent(null)
    setBookingDate(date)
    setBookingOpen(true)
  }

  function goMonth(delta: number) {
    if (month === null || year === null) return
    const next = new Date(Date.UTC(year, month + delta, 1))
    setMonth(next.getUTCMonth())
    setYear(next.getUTCFullYear())
  }

  return (
    <>
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <Header active={activeNav} onBook={() => openBooking()} />
      <main id="contenido">
        <Hero onBook={() => openBooking()} />
        <Events events={events} today={today} loaded={loaded} error={error} onEvent={setActiveEvent} />
        <WeekCalendar
          events={events}
          reserved={reserved}
          today={today}
          week={week}
          filter={filter}
          loaded={loaded}
          error={error}
          onFilter={setFilter}
          onWeek={setWeek}
          onToday={() => today && setWeek(startOfWeek(today))}
          onBook={openBooking}
          onEvent={setActiveEvent}
        />
        <MonthCalendar
          events={events}
          reserved={reserved}
          today={today}
          month={month}
          year={year}
          filter={filter}
          loaded={loaded}
          error={error}
          onMonth={goMonth}
          onToday={() => {
            if (!today) return
            const parts = monthParts(today)
            setYear(parts.year)
            setMonth(parts.month)
          }}
          onBook={openBooking}
          onEvent={setActiveEvent}
        />
        <CateringBanner onBook={() => openBooking()} />
      </main>
      <Footer />
      <EventDialog event={activeEvent} onClose={() => setActiveEvent(null)} onToast={setToast} />
      <CateringDialog
        open={bookingOpen}
        initialDate={bookingDate}
        today={today ?? ""}
        reserved={reserved}
        availabilityReady={loaded && !error}
        onClose={() => setBookingOpen(false)}
      />
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </>
  )
}
