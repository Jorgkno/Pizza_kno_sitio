import type { AgendaEvent } from "./types.ts"
import raw from "../data/ejemplos.json" with { type: "json" }

/** Los cuatro encuentros de muestra del sitio actual. Solo se usan si /api/eventos responde []. */
export const SAMPLE_EVENTS = raw as AgendaEvent[]
