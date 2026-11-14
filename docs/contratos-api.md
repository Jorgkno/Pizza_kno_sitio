# Contratos de API

Origen en vivo: `https://mesa-calendario-catering.jdelsol-91.chatgpt.site`

Las respuestas públicas llevan `content-type: application/json` y `cache-control: no-store`.
Hoy, 13 de noviembre de 2026, `/api/eventos` y `/api/disponibilidad` responden `[]`.

El sitio no envía `Access-Control-Allow-Origin`. Un front en otro dominio no puede leer estas rutas desde el navegador si no hay un proxy. Un POST sin `Origin` de ese sitio, o con un origen distinto, responde `403`:

```json
{ "error": "Origen no válido." }
```

## `GET /api/eventos`

Arreglo de encuentros. Si el arreglo viene vacío, el cliente del sitio actual sustituye cuatro eventos de muestra (`sample: true`). Esa sustitución es del cliente, no del API.

```ts
type Evento = {
  id: number | string
  day: number          // 1–31
  month: number        // 0 = enero … 11 = diciembre
  year: number
  type: "popup" | "collab"
  title: string
  place: string
  time: string         // "HH:MM", 24 h
  end: string          // "HH:MM", mismo día
  description: string
  image?: string       // los publicados desde /gestion no traen imagen
  address?: string     // dirección para el mapa; las muestras no la usan
  sample?: boolean     // true solo en el fallback de ejemplo
}
```

`month` es índice de JavaScript. El panel admin muestra `month + 1`.

Métodos permitidos: `DELETE, GET, HEAD, OPTIONS, POST`.

`POST` y `DELETE` exigen la sesión propietaria. Sin ella responden `403`:

```json
{ "error": "Acceso privado." }
```

`DELETE /api/eventos?id=<id>`

`POST /api/eventos` recibe JSON armado desde el formulario del panel, todo como string:

`title` (máx. 120), `type` (`popup` | `collab`), `date` (`YYYY-MM-DD`), `place` (máx. 200), `address` (máx. 500), `time`, `end`, `description` (máx. 2000).

El servidor parte `date` en `day`, `month` y `year`. El cliente asume que el encuentro termina el mismo día, en hora de Monterrey.

## `GET /api/disponibilidad`

Arreglo de fechas con catering confirmado. El cliente solo lee `date`.

```ts
type Disponibilidad = { date: string }[]  // "YYYY-MM-DD"
```

Esas fechas se pintan como reservadas y el formulario no deja pedirlas.
Una solicitud pendiente no entra aquí: la reserva aparece cuando en el panel se marca como confirmada.

Métodos: `GET, HEAD, OPTIONS`. Ignora query string.

## `POST /api/solicitudes`

Único método público de escritura, además de `OPTIONS`.

Cuerpo JSON. `guests` tiene que ser número, no string. Si va como `"12"`, el servidor responde 400.

```ts
type Solicitud = {
  date: string       // YYYY-MM-DD, hoy o futuro en America/Monterrey
  time: string       // HH:MM
  guests: number     // entero 1–1000
  occasion: string
  location: string
  notes?: string     // opcional; 2001 caracteres ya fallan
  name: string
  email: string
  phone: string
}
```

El formulario no envía el checkbox de consentimiento: no tiene `name`.

Éxito `200`:

```json
{ "id": "8a42224e-24da-443e-b511-73c86ba71329", "reference": "KNO-8A42224E" }
```

`reference` es `KNO-` más los primeros 8 caracteres del uuid en mayúsculas. El cliente muestra `reference`.

Errores observados:

| Caso | Estado | `error` |
| --- | --- | --- |
| JSON inválido | 400 | `No pudimos guardar la solicitud. Intenta de nuevo; tus datos siguen en el formulario.` |
| Campos inválidos, fecha pasada, `guests` fuera de 1–1000, `guests` string, correo inválido, teléfono que no cumple `[+0-9 ()-]{7,25}` | 400 | `Revisa los datos de tu evento.` |
| Origen ausente o ajeno | 403 | `Origen no válido.` |

El servidor acepta más de lo que el formulario deja escribir. En el sondeo del 13 de noviembre de 2026 aceptó un nombre de 151 caracteres, un lugar de 251 y un `occasion` que no está en la lista (`Cumpleaños`). El formulario sí limita nombre a 150, lugar a 250 y el tipo a cuatro opciones. Notas de 2001 caracteres sí las rechaza.

Esas tres pruebas quedaron guardadas en el sitio real. Hay que cancelarlas desde `/gestion`:

- `KNO-8A42224E` (`8a42224e-24da-443e-b511-73c86ba71329`)
- `KNO-13FF075C` (`13ff075c-b0a5-49c2-99e9-356c56cc78ff`)
- `KNO-7421F635` (`7421f635-6a7c-405c-8ada-562a10dec486`)

Fecha de las tres: 2026-12-20. Correo usado: `ana@example.com`.

Si la fecha ya está en disponibilidad, el cliente no llega a hacer POST. Muestra: «Esta fecha ya tiene una reserva de catering confirmada. Elige otra fecha.» No se observó el mensaje del servidor para ese caso.

## `/gestion` y `/api/admin`

Existen y piden la cuenta propietaria de ChatGPT. Esta entrega no los reconstruye.

`GET /gestion` sin sesión muestra «Entrar con la cuenta propietaria», con enlace a `/signin-with-chatgpt?return_to=/gestion`.

`GET /api/admin` sin sesión:

```json
{ "error": "Inicia sesión con la cuenta propietaria para ver las solicitudes." }
```

`PATCH /api/admin` sin sesión: `403` `{ "error": "Acceso privado." }`

Métodos de `/api/admin`: `GET, HEAD, OPTIONS, PATCH`.

Con sesión, el cliente espera:

```ts
type SolicitudAdmin = {
  id: string
  name: string
  date: string
  time: string
  guests: number
  occasion: string
  location: string
  notes?: string
  email: string
  phone: string
  status: "pending" | "confirmed" | "cancelled"
}
```

`GET /api/admin` devuelve ese arreglo. `PATCH /api/admin` recibe `{ id, status }`.
El panel muestra la referencia como `KNO-` + `id.slice(0, 8)` en mayúsculas, igual que el POST público.

Los estados que el panel puede asignar son `confirmed` («Confirmar»), `cancelled` («Cancelar») y `pending` («Marcar pendiente»).
El propio panel avisa que no se envían correos automáticos.
