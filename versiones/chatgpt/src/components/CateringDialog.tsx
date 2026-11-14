import { useEffect, useRef, useState, type FormEvent } from "react"
import { apiUrl } from "../lib/api.ts"
import { longDate } from "../lib/dates.ts"
import type { Draft } from "../lib/types.ts"

const OCCASIONS = ["Celebración privada", "Evento de empresa", "Boda", "Otro encuentro"]

export function CateringDialog({
  open,
  initialDate,
  today,
  reserved,
  availabilityReady,
  onClose,
}: {
  open: boolean
  initialDate: string
  today: string
  reserved: string[]
  availabilityReady: boolean
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      returnFocus.current = document.activeElement as HTMLElement | null
      if (!dialog.open) dialog.showModal()
    } else if (dialog.open) {
      dialog.close()
      returnFocus.current?.focus()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="dialog-title"
      onCancel={(native) => {
        native.preventDefault()
        onClose()
      }}
      onClick={(native) => {
        if (native.target === dialogRef.current) onClose()
      }}
    >
      {open && (
        <BookingForm
          key={initialDate}
          initialDate={initialDate}
          today={today}
          reserved={reserved}
          availabilityReady={availabilityReady}
          onClose={onClose}
        />
      )}
    </dialog>
  )
}

function BookingForm({
  initialDate,
  today,
  reserved,
  availabilityReady,
  onClose,
}: {
  initialDate: string
  today: string
  reserved: string[]
  availabilityReady: boolean
  onClose: () => void
}) {
  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState<Draft>({ date: initialDate })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [reference, setReference] = useState("")

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Draft
    const next = { ...draft, ...data }
    if (!availabilityReady) { setError("Agenda no disponible"); return }
    if (reserved.includes(String(next.date))) {
      setError("Esta fecha ya tiene una reserva de catering confirmada. Elige otra fecha."); return
    }
    if (step === 1) {
      if (reserved.includes(String(data.date))) {
        setError("Esta fecha ya tiene una reserva de catering confirmada. Elige otra fecha.")
        return
      }
      setDraft(next)
      setError("")
      setStep(2)
      return
    }
    setSaving(true)
    setError("")
    try {
      const response = await fetch(apiUrl("/api/solicitudes"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...next, guests: Number(next.guests) }),
      })
      const payload = (await response.json()) as { error?: string; reference?: string }
      if (!response.ok) throw new Error(payload.error)
      setDraft(next)
      setReference(payload.reference ?? "")
      setStep(3)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Intenta de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  return (
        <div className="dialog-sheet">
          <button type="button" className="close" aria-label="Cerrar" onClick={onClose}>
            Cerrar
          </button>
          {step < 3 ? (
            <form key={step} className="dialog-form" onSubmit={onSubmit}>
              <div className="dialog-scroll">
                <p className="eyebrow">UNA MESA A TU MEDIDA</p>
                <h2 id="dialog-title">Planeemos algo rico.</h2>
                <p>Cuéntanos lo esencial. La fecha se confirma después de revisar tu solicitud.</p>
                <ol className="steps">
                  <li className={step === 1 ? "current" : undefined} aria-current={step === 1 ? "step" : undefined}>
                    01 Tu evento
                  </li>
                  <li className={step === 2 ? "current" : undefined} aria-current={step === 2 ? "step" : undefined}>
                    02 Tus datos
                  </li>
                </ol>
                {step === 1 ? (
                  <StepEvent draft={draft} initialDate={initialDate} today={today} />
                ) : (
                  <StepContact draft={draft} />
                )}
                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
              </div>
              <div className="dialog-actions">
                {step === 1 ? (
                  <button type="submit" className="btn primary">
                    Continuar
                  </button>
                ) : (
                  <>
                    <button type="submit" className="btn primary" disabled={saving}>
                      {saving ? "Guardando solicitud…" : "Enviar solicitud"}
                    </button>
                    <button
                      type="button"
                      className="btn text"
                      disabled={saving}
                      onClick={(native) => {
                        const form = native.currentTarget.form
                        if (form) {
                          setDraft({
                            ...draft,
                            ...(Object.fromEntries(new FormData(form)) as Draft),
                          })
                        }
                        setStep(1)
                      }}
                    >
                      Volver a mi evento
                    </button>
                  </>
                )}
              </div>
            </form>
          ) : (
            <div className="dialog-form">
              <div className="dialog-scroll success">
                <p className="eyebrow">UNA MESA A TU MEDIDA</p>
                <h2 id="dialog-title">Ya estamos cocinando tu idea.</h2>
                <div className="success-check" aria-hidden="true">
                  ✓
                </div>
                <p>Tu solicitud se guardó correctamente.</p>
                <strong>{reference}</strong>
                <p>Conserva tu referencia. Es una solicitud pendiente; aún no confirma la fecha ni el servicio.</p>
              </div>
              <div className="dialog-actions">
                <button type="button" className="btn primary" onClick={onClose}>
                  Volver al calendario
                </button>
              </div>
            </div>
          )}
        </div>
  )
}

function StepEvent({
  draft,
  initialDate,
  today,
}: {
  draft: Draft
  initialDate: string
  today: string
}) {
  return (
    <>
      <div className="form-row pair">
        <label>
          Fecha
          <DateField name="date" min={today} defaultValue={draft.date || initialDate} />
        </label>
        <label>
          Hora
          <input
            required
            name="time"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            pattern="([01][0-9]|2[0-3]):[0-5][0-9]"
            placeholder="14:00"
            defaultValue={draft.time || "14:00"}
            aria-describedby="hora-formato"
            onInvalid={(event) => {
              event.currentTarget.setCustomValidity("Usa el formato de 24 horas, por ejemplo 14:00.")
            }}
            onInput={(event) => event.currentTarget.setCustomValidity("")}
          />
        </label>
      </div>
      <p id="hora-formato" className="form-note">
        Formato de 24 horas, por ejemplo 14:00.
      </p>
      <div className="form-row">
        <label>
          Invitados
          <input
            required
            type="number"
            min={1}
            max={1000}
            name="guests"
            inputMode="numeric"
            defaultValue={draft.guests || 30}
          />
        </label>
        <label>
          Tipo de evento
          <select required name="occasion" defaultValue={draft.occasion || ""}>
            <option value="" disabled>
              Selecciona una opción
            </option>
            {OCCASIONS.map((occasion) => (
              <option key={occasion}>{occasion}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        ¿Dónde será?
        <input
          required
          maxLength={250}
          name="location"
          placeholder="Ciudad, zona o lugar del evento"
          defaultValue={draft.location}
        />
      </label>
      <label>
        Algo que debamos saber <small>(opcional)</small>
        <textarea
          maxLength={2000}
          name="notes"
          placeholder="Tu idea, estilo de menú, restricciones alimentarias…"
          defaultValue={draft.notes}
        />
      </label>
      <p className="form-note">Cuéntanos cuántas personas asistirán. Sujeto a cobertura y disponibilidad.</p>
    </>
  )
}

function StepContact({ draft }: { draft: Draft }) {
  const when = draft.date
    ? new Date(`${draft.date}T12:00:00`).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""
  return (
    <>
      <p className="summary">
        {when} · {draft.guests} personas
      </p>
      <label>
        Tu nombre
        <input name="name" autoComplete="name" required maxLength={150} defaultValue={draft.name} />
      </label>
      <label>
        Correo electrónico
        <input
          name="email"
          autoComplete="email"
          type="email"
          required
          maxLength={200}
          defaultValue={draft.email}
        />
      </label>
      <label>
        Teléfono
        <input
          name="phone"
          autoComplete="tel"
          type="tel"
          required
          pattern="[+0-9 ()\\-]{7,25}"
          placeholder="+52 81 1234 5678"
          defaultValue={draft.phone}
        />
      </label>
      <label className="consent">
        <input type="checkbox" required />
        Acepto que utilicen estos datos para gestionar y responder esta solicitud de catering.
      </label>
    </>
  )
}

function DateField({
  name,
  min,
  defaultValue,
}: {
  name: string
  min: string
  defaultValue: string
}) {
  const [value, setValue] = useState(defaultValue)
  const face = value ? longDate(value) : "Elige una fecha"
  return (
    <span className="date-shell">
      <input
        required
        type="date"
        name={name}
        min={min}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <span className="date-face" aria-hidden="true">
        {face}
      </span>
    </span>
  )
}
