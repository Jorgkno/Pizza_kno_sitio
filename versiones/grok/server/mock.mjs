import { createServer } from "node:http"
import { readFileSync } from "node:fs"
import { randomUUID } from "node:crypto"
import path from "node:path"
import { fileURLToPath } from "node:url"

const port = Number(process.env.PORT || 4318)
const fixtures = process.env.FIXTURES === "1" || process.env.FIXTURES === "true"
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const samples = JSON.parse(readFileSync(path.join(root, "src/data/ejemplos.json"), "utf8"))

const fixtureEvent = {
  sample: false,
  id: "ejemplo-sede",
  day: 22,
  month: 10,
  year: 2026,
  type: "collab",
  title: "Ejemplo con sede (dato de prueba)",
  place: "Sede de ejemplo",
  address: "Calle Ejemplo 100, Monterrey, Nuevo León",
  time: "18:00",
  end: "21:00",
  description:
    "Dato de ejemplo del mock local para revisar el enlace a mapas. No es un evento real.",
}

const fixtureReserved = ["2026-11-18", "2026-12-02"]
const allowedOrigins = new Set([
  "http://127.0.0.1:4317",
  "http://localhost:4317",
  "https://mesa-calendario-catering.jdelsol-91.chatgpt.site",
])

const solicitudes = []

function monterreyToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Monterrey",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date())
  const bag = {}
  for (const part of parts) if (part.type !== "literal") bag[part.type] = part.value
  return `${bag.year}-${bag.month}-${bag.day}`
}

function send(res, status, body, extra = {}) {
  const payload = body === undefined ? "" : JSON.stringify(body)
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    ...extra,
  })
  res.end(payload)
}

function originOk(req) {
  const origin = req.headers.origin
  if (!origin) return true
  return allowedOrigins.has(origin)
}

function validate(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return "Revisa los datos de tu evento."
  const { date, time, guests, occasion, location, name, email, phone, notes } = body
  if (typeof guests !== "number" || !Number.isInteger(guests) || guests < 1 || guests > 1000) {
    return "Revisa los datos de tu evento."
  }
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) || date < monterreyToday()) {
    return "Revisa los datos de tu evento."
  }
  if (typeof time !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return "Revisa los datos de tu evento."
  }
  for (const value of [occasion, location, name, email, phone]) {
    if (typeof value !== "string" || !value.trim()) return "Revisa los datos de tu evento."
  }
  if (notes != null && (typeof notes !== "string" || notes.length > 2000)) {
    return "Revisa los datos de tu evento."
  }
  if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Revisa los datos de tu evento."
  }
  if (!/^[+0-9 ()-]{7,25}$/.test(phone)) return "Revisa los datos de tu evento."
  return ""
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on("data", (chunk) => chunks.push(chunk))
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
    req.on("error", reject)
  })
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://127.0.0.1")
  const pathName = url.pathname
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      allow:
        pathName === "/api/solicitudes"
          ? "OPTIONS, POST"
          : pathName === "/api/eventos"
            ? "DELETE, GET, HEAD, OPTIONS, POST"
            : pathName === "/api/admin"
              ? "GET, HEAD, OPTIONS, PATCH"
              : "GET, HEAD, OPTIONS",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "content-type",
      "access-control-allow-methods": "GET, POST, PATCH, DELETE, OPTIONS",
    })
    res.end()
    return
  }

  if (!originOk(req) && req.method !== "GET" && req.method !== "HEAD") {
    send(res, 403, { error: "Origen no válido." })
    return
  }

  if (pathName === "/api/eventos" && (req.method === "GET" || req.method === "HEAD")) {
    const body = fixtures ? [...samples, fixtureEvent] : []
    send(res, 200, req.method === "HEAD" ? undefined : body)
    return
  }
  if (pathName === "/api/eventos" && (req.method === "POST" || req.method === "DELETE")) {
    send(res, 403, { error: "Acceso privado." })
    return
  }
  if (pathName === "/api/disponibilidad" && (req.method === "GET" || req.method === "HEAD")) {
    const body = fixtures ? fixtureReserved.map((date) => ({ date })) : []
    send(res, 200, req.method === "HEAD" ? undefined : body)
    return
  }
  if (pathName === "/api/admin" && req.method === "GET") {
    send(res, 403, { error: "Inicia sesión con la cuenta propietaria para ver las solicitudes." })
    return
  }
  if (pathName === "/api/admin" && req.method === "PATCH") {
    send(res, 403, { error: "Acceso privado." })
    return
  }
  if (pathName === "/api/solicitudes" && req.method === "POST") {
    const raw = await readBody(req)
    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      send(res, 400, {
        error: "No pudimos guardar la solicitud. Intenta de nuevo; tus datos siguen en el formulario.",
      })
      return
    }
    const problem = validate(parsed)
    if (problem) {
      send(res, 400, { error: problem })
      return
    }
    const id = randomUUID()
    const reference = `KNO-${id.slice(0, 8).toUpperCase()}`
    solicitudes.push({ id, reference, ...parsed, status: "pending" })
    send(res, 200, { id, reference })
    return
  }

  send(res, 405, { error: "Método no disponible." })
})

server.listen(port, "127.0.0.1", () => {
  const mode = fixtures
    ? "FIXTURES=1 · datos de ejemplo (no son eventos reales)"
    : "arreglos vacíos, como el sitio en vivo hoy"
  console.log(`Mock de Kno’s en http://127.0.0.1:${port} · ${mode}`)
})
