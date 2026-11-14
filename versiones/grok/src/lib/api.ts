export const LIVE_ORIGIN =
  "https://mesa-calendario-catering.jdelsol-91.chatgpt.site"

/**
 * Base del API.
 * Sin variable, el build apunta al sitio en vivo.
 * `npm run dev` define VITE_API_BASE vacío para usar el proxy local (el sitio
 * en vivo no envía CORS).
 */
export function apiBase(): string {
  const configured = import.meta.env.VITE_API_BASE
  if (configured === undefined) return LIVE_ORIGIN
  return String(configured).replace(/\/$/, "")
}

export function apiUrl(path: string): string {
  return `${apiBase()}${path}`
}

export function gestionUrl(): string {
  return `${LIVE_ORIGIN}/gestion`
}
