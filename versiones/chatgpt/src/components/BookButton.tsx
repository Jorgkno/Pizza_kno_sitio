import { bookAria, bookLabel } from "../lib/calendar.ts"
import { longDate } from "../lib/dates.ts"
import type { DayState } from "../lib/types.ts"

function visualLabel(state: DayState): string {
  if (state === "open") return "Agen\u00ADdar"
  if (state === "reserved") return "Reser\u00ADvado"
  if (state === "loading") return "Consul\u00ADtando"
  return bookLabel(state)
}

export function BookButton({
  state,
  iso,
  onBook,
}: {
  state: DayState
  iso: string
  onBook: (iso: string) => void
}) {
  return (
    <button
      type="button"
      className={`book book-${state}`}
      disabled={state !== "open"}
      aria-label={bookAria(state, iso, longDate)}
      onClick={() => onBook(iso)}
    >
      <span>{visualLabel(state)}</span>
    </button>
  )
}
