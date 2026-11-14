/* Kno’s Pizzas · versión Muse
   Front sin build: HTML + CSS + JavaScript.
   Consume las mismas rutas que el sitio en vivo:
   GET /api/eventos, GET /api/disponibilidad y POST /api/solicitudes.
   En local, server/dev.mjs sirve estos archivos y proxea /api
   al mock (o al sitio en vivo con dev:live). Nunca se hace POST
   al sitio en vivo desde el dev normal: el mock responde en local.
   Fechas en America/Monterrey, calculadas en el cliente. */

"use strict";

const LIVE_ORIGIN = "https://mesa-calendario-catering.jdelsol-91.chatgpt.site";
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const WEEKDAYS_SHORT = ["LUN","MAR","MIÉ","JUE","VIE","SÁB","DOM"];
const OCCASIONS = ["Celebración privada","Evento de empresa","Boda","Otro encuentro"];

/* Los cuatro encuentros de muestra del sitio actual. Solo se usan
   si GET /api/eventos responde []. No son eventos reales. */
const SAMPLE_EVENTS = [
  { sample: true, id: 1, day: 14, month: 10, year: 2026, type: "popup", title: "Un sábado para compartir", place: "Patio de temporada · sede por confirmar", time: "13:00", end: "19:00", image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85", description: "Pizza recién hecha, ingredientes de temporada y muchas ganas de encontrarnos. Una muestra de cómo se verán tus próximos pop-ups." },
  { sample: true, id: 2, day: 20, month: 10, year: 2026, type: "collab", title: "Pizza & vino", place: "Cocina invitada · sede por confirmar", time: "19:00", end: "23:00", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85", description: "Una colaboración para descubrir sabores y conocer a quienes están detrás de cada plato. La ubicación y el menú se publicarán al confirmar el evento." },
  { sample: true, id: 3, day: 28, month: 10, year: 2026, type: "popup", title: "Sábado de pizza", place: "Jardín de temporada · sede por confirmar", time: "10:00", end: "15:00", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85", description: "Sobremesas sin prisa y una cocina para disfrutar juntos. Este evento es una muestra; aún no está abierto al público." },
  { sample: true, id: 4, day: 5, month: 11, year: 2026, type: "collab", title: "La última pizza del año", place: "Espacio colaborador · sede por confirmar", time: "18:00", end: "22:00", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=85", description: "Un encuentro para cerrar el año alrededor de la mesa. Evento de muestra, pendiente de fecha y sede reales." },
];

/* ---------- fechas (America/Monterrey) ---------- */

function monterreyToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Monterrey", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const bag = {};
  for (const p of parts) if (p.type !== "literal") bag[p.type] = p.value;
  return `${bag.year}-${bag.month}-${bag.day}`;
}
function addDays(iso, days) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
function startOfWeek(iso) {
  const day = new Date(`${iso}T12:00:00Z`).getUTCDay();
  return addDays(iso, -((day + 6) % 7));
}
function weekDays(iso) {
  const start = startOfWeek(iso);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}
function fmt(iso, opts) {
  return new Intl.DateTimeFormat("es-MX", { ...opts, timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));
}
function longDate(iso) { return fmt(iso, { day: "numeric", month: "long", year: "numeric" }); }
function weekdayShort(iso) { return fmt(iso, { weekday: "short" }).replace(".", ""); }
function weekdayLong(iso) { return fmt(iso, { weekday: "long" }); }
function weekRangeLabel(iso) {
  const end = addDays(iso, 6);
  const s = new Date(`${iso}T12:00:00Z`), e = new Date(`${end}T12:00:00Z`);
  if (s.getUTCFullYear() === e.getUTCFullYear() && s.getUTCMonth() === e.getUTCMonth()) {
    return `${s.getUTCDate()} al ${fmt(end, { day: "numeric", month: "long", year: "numeric" })}`;
  }
  return `${fmt(iso, { day: "numeric", month: "short" })} a ${fmt(end, { day: "numeric", month: "short", year: "numeric" })}`;
}
function eventKey(ev) { return `${ev.year}-${String(ev.month + 1).padStart(2, "0")}-${String(ev.day).padStart(2, "0")}`; }
function monthParts(iso) { const [y, m] = iso.split("-").map(Number); return { year: y, month: m - 1 }; }
function esc(s) { return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

/* ---------- estado ---------- */

const state = {
  today: monterreyToday(),
  week: startOfWeek(monterreyToday()),
  month: monthParts(monterreyToday()).month,
  year: monthParts(monterreyToday()).year,
  events: [],
  reserved: [],
  loaded: false,
  error: "",
  filter: "all",
  activeEvent: null,
  activeNav: "",
};

const $ = (sel) => document.querySelector(sel);
const toastEl = $("#toast");

/* Si una foto de ejemplo no carga, se sustituye por el bloque
   de color de su tipo, sin icono roto y sin errores de consola. */
document.addEventListener("error", (e) => {
  const t = e.target;
  if (!t || t.tagName !== "IMG") return;
  const tone = (t.closest("[class*='tone-']") || { className: "" }).className.match(/tone-(popup|collab)/);
  const span = document.createElement("span");
  span.className = `photo-fallback ${tone ? tone[0] : ""}`;
  span.setAttribute("aria-hidden", "true");
  t.replaceWith(span);
}, true);
let toastTimer = null;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, 3500);
}

/* ---------- filtros y estados del día ---------- */

function passesFilter(ev, filter) {
  return filter === "all" || (filter !== "catering" && ev.type === filter);
}
function dayState(iso) {
  if (state.error) return "error";
  if (!state.loaded) return "loading";
  if (iso < state.today) return "past";
  if (state.reserved.includes(iso)) return "reserved";
  return "open";
}
function bookLabel(s) {
  if (s === "reserved") return "Reservado";
  if (s === "past") return "Fecha pasada";
  if (s === "loading") return "Consultando";
  if (s === "error") return "No disponible";
  return "Agendar";
}
function bookAria(s, iso) {
  const action = s === "open" ? "Agendar catering"
    : s === "reserved" ? "Catering reservado"
    : s === "past" ? "Fecha pasada, catering no disponible"
    : s === "error" ? "Agenda no disponible"
    : "Consultando disponibilidad";
  return `${action} el ${longDate(iso)}`;
}
function weekStatus(iso) {
  if (!state.loaded) return { title: "Consultando…", note: "" };
  if (state.error) return { title: "Agenda no disponible", note: "" };
  if (iso < state.today) return { title: "Fecha pasada", note: "" };
  if (state.reserved.includes(iso)) return { title: "Catering reservado", note: "" };
  return { title: "Fecha para catering", note: "Sujeto a confirmación" };
}
function eventsOnDate(iso, filter) {
  return state.events
    .filter((ev) => passesFilter(ev, filter) && eventKey(ev) === iso)
    .sort((a, b) => a.time.localeCompare(b.time));
}

/* ---------- encuentros próximos ---------- */

function renderEvents() {
  const status = $("#events-status");
  const list = $("#event-list");
  const note = $("#sample-note");
  if (!state.loaded) { status.textContent = "Cargando encuentros…"; status.hidden = false; list.innerHTML = ""; note.hidden = true; return; }
  if (state.error) { status.textContent = state.error; status.hidden = false; list.innerHTML = ""; note.hidden = true; return; }
  status.hidden = true;
  const upcoming = state.events
    .filter((ev) => eventKey(ev) >= state.today)
    .sort((a, b) => eventKey(a).localeCompare(eventKey(b)) || a.time.localeCompare(b.time));
  if (!upcoming.length) {
    list.innerHTML = "";
    status.textContent = "Aún no hay próximos encuentros. Consulta las fechas de catering en la semana.";
    status.hidden = false;
  } else {
    list.innerHTML = upcoming.map((ev) => {
      const key = eventKey(ev);
      return `<button type="button" class="event-card tone-${ev.type}" data-event="${esc(ev.id)}" aria-label="Ver detalles de ${esc(ev.title)}, ${esc(longDate(key))}">
        <span class="date-badge tone-${ev.type}"><small>${esc(MONTHS[ev.month].slice(0, 3))}</small><strong>${ev.day}</strong><span>${esc(weekdayShort(key))}</span></span>
        <span class="event-photo">${ev.image ? `<img src="${esc(ev.image)}" alt="" width="900" height="600" loading="lazy" decoding="async" />` : `<span class="photo-fallback tone-${ev.type}" aria-hidden="true"></span>`}<span class="kind kind-${ev.type}"><i aria-hidden="true"></i>${ev.type === "popup" ? "Pop-up" : "Colaboración"}${ev.sample ? " · Ejemplo" : ""}</span></span>
        <span class="event-copy"><span class="event-title">${esc(ev.title)}</span><span>${esc(longDate(key))} · ${esc(ev.time)}–${esc(ev.end)}</span><span>${esc(ev.place)}</span><span class="text-link">Ver detalles</span></span>
      </button>`;
    }).join("");
    list.querySelectorAll("[data-event]").forEach((btn) => btn.addEventListener("click", () => openEvent(btn.dataset.event)));
  }
  const samples = state.events.some((ev) => ev.sample);
  note.hidden = false;
  note.textContent = samples ? "Encuentros de ejemplo · Fechas y sedes ilustrativas." : "Horarios locales de Monterrey.";
}

/* ---------- semana ---------- */

function renderWeek() {
  const range = $("#week-range");
  const status = $("#week-status");
  const list = $("#week-list");
  range.textContent = weekRangeLabel(state.week);
  if (!state.loaded && !state.error) { status.textContent = "Consultando…"; status.hidden = false; list.innerHTML = ""; return; }
  status.hidden = true;
  list.innerHTML = weekDays(state.week).map((iso) => {
    const dayEvents = eventsOnDate(iso, state.filter);
    const st = dayState(iso);
    const statusInfo = weekStatus(iso);
    const isToday = iso === state.today;
    return `<div class="week-day${isToday ? " is-current" : ""} state-${st}" aria-label="${esc(weekdayLong(iso))}, ${esc(longDate(iso))}">
      <div class="day-num"><small>${esc(weekdayShort(iso))}</small><strong>${Number(iso.slice(8))}</strong>${isToday ? '<span class="hoy">Hoy</span>' : ""}</div>
      <div class="day-body">${dayEvents.length ? dayEvents.map((ev) => `<button type="button" class="mini-event tone-${ev.type}" data-event="${esc(ev.id)}" aria-label="Ver detalles de ${esc(ev.title)}"><span class="mini-photo">${ev.image ? `<img src="${esc(ev.image)}" alt="" loading="lazy" decoding="async" />` : `<span class="photo-fallback tone-${ev.type}" aria-hidden="true"></span>`}</span><span><small>${ev.type === "popup" ? "Pop-up" : "Colaboración"}${ev.sample ? " · Ejemplo" : ""}</small><strong>${esc(ev.title)}</strong><span>${esc(ev.time)}–${esc(ev.end)}</span></span></button>`).join("") : `<p>${esc(statusInfo.title)}${statusInfo.note ? `<small>${esc(statusInfo.note)}</small>` : ""}</p>`}</div>
      <button type="button" class="book book-${st}" ${st !== "open" ? "disabled" : ""} aria-label="${esc(bookAria(st, iso))}" data-book="${iso}">${esc(bookLabel(st))}</button>
    </div>`;
  }).join("");
  list.querySelectorAll("[data-event]").forEach((btn) => btn.addEventListener("click", () => openEvent(btn.dataset.event)));
  list.querySelectorAll("[data-book]").forEach((btn) => btn.addEventListener("click", () => openBooking(btn.dataset.book)));
  $("#week-prev").disabled = false;
  $("#week-next").disabled = false;
  $("#week-today").disabled = false;
}

/* ---------- mes ---------- */

function buildCells(year, month) {
  const lead = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const total = Math.ceil((lead + count) / 7) * 7;
  return Array.from({ length: total }, (_, i) => {
    const day = i - lead + 1;
    const date = new Date(Date.UTC(year, month, day));
    return { iso: date.toISOString().slice(0, 10), day: date.getUTCDate(), outside: day < 1 || day > count };
  });
}

function renderMonth() {
  const label = $("#month-label");
  const status = $("#month-status");
  const frame = $("#month-frame");
  const grid = $("#month-grid");
  label.innerHTML = `${esc(MONTHS[state.month])} <span>${state.year}</span>`;
  status.hidden = true;
  frame.hidden = false;
  const inMonth = state.events.filter((ev) => passesFilter(ev, state.filter) && ev.month === state.month && ev.year === state.year);
  grid.setAttribute("aria-label", `Calendario de ${MONTHS[state.month]} de ${state.year}`);
  grid.innerHTML = buildCells(state.year, state.month).map((cell) => {
    if (cell.outside) return `<div class="month-day outside"><span class="month-num">${cell.day}</span></div>`;
    const dayEvents = inMonth.filter((ev) => ev.day === cell.day);
    const st = dayState(cell.iso);
    const isToday = cell.iso === state.today;
    return `<div class="month-day state-${st}${isToday ? " is-current" : ""}${state.reserved.includes(cell.iso) ? " is-booked" : ""}">
      <span class="month-num">${cell.day}${isToday ? '<span class="hoy">Hoy</span>' : ""}</span>
      <div class="month-events">${dayEvents.map((ev) => `<button type="button" class="month-chip tone-${ev.type}" title="${esc(ev.title)}" data-event="${esc(ev.id)}" aria-label="Ver detalles de ${esc(ev.title)}, ${esc(longDate(cell.iso))}"><span class="mini-photo">${ev.image ? `<img src="${esc(ev.image)}" alt="" loading="lazy" decoding="async" />` : ""}</span><span>${ev.type === "popup" ? "Pop-up" : "Colab."}</span></button>`).join("")}</div>
      <button type="button" class="book book-${st}" ${st !== "open" ? "disabled" : ""} aria-label="${esc(bookAria(st, cell.iso))}" data-book="${cell.iso}">${esc(bookLabel(st))}</button>
    </div>`;
  }).join("");
  grid.querySelectorAll("[data-event]").forEach((btn) => btn.addEventListener("click", () => openEvent(btn.dataset.event)));
  grid.querySelectorAll("[data-book]").forEach((btn) => btn.addEventListener("click", () => openBooking(btn.dataset.book)));
  $("#month-prev").disabled = false;
  $("#month-next").disabled = false;
  $("#month-today").disabled = false;
}

function renderAll() { renderEvents(); renderWeek(); renderMonth(); }

/* ---------- diálogo del encuentro ---------- */

const eventDialog = $("#event-dialog");
const eventSheet = $("#event-sheet");
let lastFocus = null;

function escapeIcs(v) {
  return String(v).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}
function buildIcs(ev) {
  const stamp = `${ev.year}${String(ev.month + 1).padStart(2, "0")}${String(ev.day).padStart(2, "0")}`;
  const dtstamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0];
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Knos Pizzas//Agenda//ES", "BEGIN:VEVENT",
    `UID:knos-${ev.sample ? "example-" : ""}${ev.id}@knos-pizzas.local`,
    `DTSTAMP:${dtstamp}Z`,
    `DTSTART;TZID=America/Monterrey:${stamp}T${ev.time.replace(":", "")}00`,
    `DTEND;TZID=America/Monterrey:${stamp}T${ev.end.replace(":", "")}00`,
    `SUMMARY:${escapeIcs((ev.sample ? "[MUESTRA] " : "") + ev.title)}`,
    `LOCATION:${escapeIcs(ev.address || ev.place)}`,
    "DESCRIPTION:" + escapeIcs(ev.sample ? "Evento de muestra. Fecha y sede pendientes de confirmación." : ev.description) + "\\nHorario local de Monterrey.",
    "END:VEVENT", "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}
function downloadIcs(ev) {
  const blob = new Blob([buildIcs(ev)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "knos-evento.ics"; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function openEvent(id) {
  const ev = state.events.find((e) => String(e.id) === String(id));
  if (!ev) return;
  state.activeEvent = ev;
  lastFocus = document.activeElement;
  const key = eventKey(ev);
  eventSheet.innerHTML = `
    <button type="button" class="close" id="event-close" aria-label="Cerrar">Cerrar</button>
    <div class="dialog-scroll">
      <div class="detail-image tone-${ev.type}">${ev.image ? `<img src="${esc(ev.image)}" alt="" width="900" height="600" decoding="async" />` : ""}</div>
      <span class="kind kind-${ev.type}"><i aria-hidden="true"></i>${ev.type === "popup" ? "Pop-up" : "Colaboración"}${ev.sample ? " · Muestra" : ""}</span>
      <h2 id="event-dialog-title">${esc(ev.title)}</h2>
      <div class="detail-meta">
        <span>${ev.day} de ${MONTHS[ev.month].toLowerCase()} de ${ev.year}</span>
        <span>${esc(ev.time)} — ${esc(ev.end)} · Hora de Monterrey</span>
        <span>${esc(ev.place)}</span>
      </div>
      <p>${esc(ev.description)}</p>
      ${ev.sample
        ? `<div class="notice">Fecha y sede ilustrativas. Este encuentro todavía no tiene ubicación confirmada ni admite reservas.</div>`
        : `${ev.address ? `<p>${esc(ev.address)}</p>` : ""}<a class="btn ghost" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(ev.address || ev.place)}" target="_blank" rel="noopener noreferrer">Cómo llegar<span class="sr-only"> (se abre en otra página)</span></a>`}
    </div>
    <div class="dialog-actions">
      <button type="button" class="btn primary" id="event-ics">${ev.sample ? "Guardar fecha de muestra" : "Añadir a mi calendario"}</button>
      <button type="button" class="btn ghost" id="event-share">Compartir</button>
    </div>`;
  $("#event-close").addEventListener("click", closeEvent);
  $("#event-ics").addEventListener("click", () => { downloadIcs(ev); toast(ev.sample ? "Evento de muestra descargado" : "Evento descargado"); });
  $("#event-share").addEventListener("click", async () => {
    const url = new URL(location.href);
    url.searchParams.set("evento", String(ev.id));
    try {
      if (navigator.share) {
        await navigator.share({ title: ev.title, text: (ev.sample ? "Evento de muestra · " : "Kno’s Pizzas · ") + ev.title, url: url.href });
      } else {
        await navigator.clipboard.writeText(url.href);
        toast("Enlace copiado");
      }
    } catch { toast("No se pudo compartir. Puedes copiar el enlace del navegador."); }
  });
  if (!eventDialog.open) eventDialog.showModal();
}
function closeEvent() {
  if (eventDialog.open) eventDialog.close();
  state.activeEvent = null;
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
eventDialog.addEventListener("click", (e) => { if (e.target === eventDialog) closeEvent(); });
eventDialog.addEventListener("cancel", (e) => { e.preventDefault(); closeEvent(); });

/* ---------- diálogo de catering (dos pasos) ---------- */

const cateringDialog = $("#catering-dialog");
const cateringSheet = $("#catering-sheet");
let booking = { step: 1, draft: {}, error: "", saving: false, reference: "" };

function openBooking(date = "") {
  booking = { step: 1, draft: { date }, error: "", saving: false, reference: "" };
  renderBooking();
  lastFocus = document.activeElement;
  if (!cateringDialog.open) cateringDialog.showModal();
}
function closeBooking() {
  if (cateringDialog.open) cateringDialog.close();
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
cateringDialog.addEventListener("click", (e) => { if (e.target === cateringDialog) closeBooking(); });
cateringDialog.addEventListener("cancel", (e) => { e.preventDefault(); closeBooking(); });

function stepEventHTML() {
  const d = booking.draft;
  return `
    <div class="form-row pair">
      <label>Fecha
        <span class="date-shell">
          <input required type="date" name="date" min="${esc(state.today)}" value="${esc(d.date || "")}" id="field-date" />
          <span class="date-face" id="date-face" aria-hidden="true">${d.date ? esc(longDate(d.date)) : "Elige una fecha"}</span>
        </span>
      </label>
      <label>Hora
        <input required name="time" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" pattern="([01][0-9]|2[0-3]):[0-5][0-9]" placeholder="14:00" value="${esc(d.time || "14:00")}" aria-describedby="hora-formato" id="field-time" />
      </label>
    </div>
    <p id="hora-formato" class="form-note">Formato de 24 horas, por ejemplo 14:00.</p>
    <div class="form-row">
      <label>Invitados
        <input required type="number" min="1" max="1000" name="guests" inputmode="numeric" value="${esc(d.guests || 30)}" />
      </label>
      <label>Tipo de evento
        <select required name="occasion">
          <option value="" ${!d.occasion ? "selected" : ""} disabled>Selecciona una opción</option>
          ${OCCASIONS.map((o) => `<option ${d.occasion === o ? "selected" : ""}>${esc(o)}</option>`).join("")}
        </select>
      </label>
    </div>
    <label>¿Dónde será?
      <input required maxlength="250" name="location" placeholder="Ciudad, zona o lugar del evento" value="${esc(d.location || "")}" />
    </label>
    <label>Algo que debamos saber <small>(opcional)</small>
      <textarea maxlength="2000" name="notes" placeholder="Tu idea, estilo de menú, restricciones alimentarias…">${esc(d.notes || "")}</textarea>
    </label>
    <p class="form-note">Cuéntanos cuántas personas asistirán. Sujeto a cobertura y disponibilidad.</p>`;
}
function stepContactHTML() {
  const d = booking.draft;
  const when = d.date ? longDate(d.date) : "";
  return `
    <p class="summary">${esc(when)} · ${esc(d.guests || "")} personas</p>
    <label>Tu nombre
      <input name="name" autocomplete="name" required maxlength="150" value="${esc(d.name || "")}" />
    </label>
    <label>Correo electrónico
      <input name="email" autocomplete="email" type="email" required maxlength="200" value="${esc(d.email || "")}" />
    </label>
    <label>Teléfono
      <input name="phone" autocomplete="tel" type="tel" required pattern="[+0-9 ()-]{7,25}" placeholder="+52 81 1234 5678" value="${esc(d.phone || "")}" />
    </label>
    <label class="consent">
      <input type="checkbox" required />
      Acepto que utilicen estos datos para gestionar y responder esta solicitud de catering.
    </label>`;
}

function renderBooking() {
  if (booking.step === 3) {
    cateringSheet.innerHTML = `
      <button type="button" class="close" id="booking-close" aria-label="Cerrar">Cerrar</button>
      <div class="dialog-form">
        <div class="dialog-scroll success">
          <p class="eyebrow">UNA MESA A TU MEDIDA</p>
          <h2 id="dialog-title">Ya estamos cocinando tu idea.</h2>
          <div class="success-check" aria-hidden="true">✓</div>
          <p>Tu solicitud se guardó correctamente.</p>
          <strong>${esc(booking.reference)}</strong>
          <p>Conserva tu referencia. Es una solicitud pendiente; aún no confirma la fecha ni el servicio.</p>
        </div>
        <div class="dialog-actions">
          <button type="button" class="btn primary" id="booking-done">Volver al calendario</button>
        </div>
      </div>`;
    $("#booking-close").addEventListener("click", closeBooking);
    $("#booking-done").addEventListener("click", closeBooking);
    return;
  }
  cateringSheet.innerHTML = `
    <button type="button" class="close" id="booking-close" aria-label="Cerrar">Cerrar</button>
    <form class="dialog-form" id="booking-form" novalidate>
      <div class="dialog-scroll">
        <p class="eyebrow">UNA MESA A TU MEDIDA</p>
        <h2 id="dialog-title">Planeemos algo rico.</h2>
        <p>Cuéntanos lo esencial. La fecha se confirma después de revisar tu solicitud.</p>
        <ol class="steps">
          <li class="${booking.step === 1 ? "current" : ""}" ${booking.step === 1 ? 'aria-current="step"' : ""}>01 Tu evento</li>
          <li class="${booking.step === 2 ? "current" : ""}" ${booking.step === 2 ? 'aria-current="step"' : ""}>02 Tus datos</li>
        </ol>
        ${booking.step === 1 ? stepEventHTML() : stepContactHTML()}
        ${booking.error ? `<p class="form-error" role="alert">${esc(booking.error)}</p>` : ""}
      </div>
      <div class="dialog-actions">
        ${booking.step === 1
          ? `<button type="submit" class="btn primary">Continuar</button>`
          : `<button type="submit" class="btn primary" ${booking.saving ? "disabled" : ""}>${booking.saving ? "Guardando solicitud…" : "Enviar solicitud"}</button>
             <button type="button" class="btn text" id="booking-back" ${booking.saving ? "disabled" : ""}>Volver a mi evento</button>`}
      </div>
    </form>`;
  $("#booking-close").addEventListener("click", closeBooking);
  const form = $("#booking-form");
  const dateInput = $("#field-date");
  if (dateInput) {
    dateInput.addEventListener("change", () => {
      const face = $("#date-face");
      if (face) face.textContent = dateInput.value ? longDate(dateInput.value) : "Elige una fecha";
    });
  }
  const timeInput = $("#field-time");
  if (timeInput) {
    timeInput.addEventListener("invalid", () => timeInput.setCustomValidity("Usa el formato de 24 horas, por ejemplo 14:00."));
    timeInput.addEventListener("input", () => timeInput.setCustomValidity(""));
  }
  const back = $("#booking-back");
  if (back) back.addEventListener("click", () => {
    booking.draft = { ...booking.draft, ...Object.fromEntries(new FormData(form)) };
    booking.error = "";
    booking.step = 1;
    renderBooking();
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const data = Object.fromEntries(new FormData(form));
    const next = { ...booking.draft, ...data };
    if (booking.step === 1) {
      if (state.reserved.includes(String(data.date))) {
        booking.error = "Esta fecha ya tiene una reserva de catering confirmada. Elige otra fecha.";
        renderBooking();
        return;
      }
      booking.draft = next; booking.error = ""; booking.step = 2; renderBooking(); return;
    }
    booking.saving = true; booking.error = ""; renderBooking();
    try {
      const response = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...next, guests: Number(next.guests) }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Intenta de nuevo.");
      booking.draft = next;
      booking.reference = payload.reference || "";
      booking.step = 3;
    } catch (err) {
      booking.error = err instanceof Error ? err.message : "Intenta de nuevo.";
    } finally {
      booking.saving = false;
      renderBooking();
    }
  });
}

/* ---------- navegación y filtros ---------- */

$("#menu-toggle").addEventListener("click", () => {
  const nav = $("#site-nav");
  const open = nav.classList.toggle("open");
  const btn = $("#menu-toggle");
  btn.setAttribute("aria-expanded", String(open));
  btn.textContent = open ? "Cerrar" : "Menú";
});
document.querySelectorAll("#site-nav a").forEach((a) => a.addEventListener("click", () => {
  $("#site-nav").classList.remove("open");
  $("#menu-toggle").setAttribute("aria-expanded", "false");
  $("#menu-toggle").textContent = "Menú";
}));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { $("#site-nav").classList.remove("open"); $("#menu-toggle").textContent = "Menú"; }
});
window.addEventListener("resize", () => {
  if (window.innerWidth >= 900) { $("#site-nav").classList.remove("open"); $("#menu-toggle").textContent = "Menú"; }
});

$("#nav-book").addEventListener("click", () => openBooking());
$("#hero-book").addEventListener("click", () => openBooking());
$("#banner-book").addEventListener("click", () => openBooking());

$("#filters").querySelectorAll("button").forEach((btn) => btn.addEventListener("click", () => {
  state.filter = btn.dataset.filter;
  document.querySelectorAll("#filters button").forEach((b) => {
    const on = b === btn;
    b.classList.toggle("selected", on);
    b.setAttribute("aria-pressed", String(on));
  });
  renderWeek(); renderMonth();
}));

$("#week-prev").addEventListener("click", () => { state.week = addDays(state.week, -7); renderWeek(); });
$("#week-next").addEventListener("click", () => { state.week = addDays(state.week, 7); renderWeek(); });
$("#week-today").addEventListener("click", () => { state.week = startOfWeek(state.today); renderWeek(); });
$("#month-prev").addEventListener("click", () => {
  const d = new Date(Date.UTC(state.year, state.month - 1, 1));
  state.month = d.getUTCMonth(); state.year = d.getUTCFullYear(); renderMonth();
});
$("#month-next").addEventListener("click", () => {
  const d = new Date(Date.UTC(state.year, state.month + 1, 1));
  state.month = d.getUTCMonth(); state.year = d.getUTCFullYear(); renderMonth();
});
$("#month-today").addEventListener("click", () => {
  const p = monthParts(state.today);
  state.year = p.year; state.month = p.month; renderMonth();
});

/* Nav activa según el scroll */
const navNodes = ["encuentros", "calendario", "vista-mes"].map((id) => document.getElementById(id)).filter(Boolean);
const observer = new IntersectionObserver((entries) => {
  const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  const id = visible.target.id;
  const active = id === "encuentros" ? "encuentros" : "calendario";
  document.querySelectorAll("#site-nav a[data-nav]").forEach((a) => {
    if (a.dataset.nav === active) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
}, { rootMargin: "-15% 0px -55% 0px", threshold: [0.15, 0.35, 0.6] });
navNodes.forEach((n) => observer.observe(n));

/* ---------- carga inicial ---------- */

async function load() {
  renderAll();
  try {
    const [evRes, avRes] = await Promise.all([fetch("/api/eventos"), fetch("/api/disponibilidad")]);
    if (!evRes.ok || !avRes.ok) throw new Error();
    const evJson = await evRes.json();
    const avJson = await avRes.json();
    if (!Array.isArray(evJson) || !Array.isArray(avJson)) throw new Error();
    state.events = evJson.length ? evJson : SAMPLE_EVENTS;
    state.reserved = avJson.map((item) => item.date);
    state.loaded = true;
    const requested = new URLSearchParams(location.search).get("evento");
    const match = state.events.find((item) => String(item.id) === requested);
    if (match) {
      state.month = match.month; state.year = match.year;
      state.week = startOfWeek(eventKey(match));
      renderAll();
      openEvent(match.id);
    }
  } catch {
    state.error = "No pudimos cargar la agenda. Recarga la página para consultar las fechas.";
    state.loaded = true;
  }
  renderAll();
}

load();
