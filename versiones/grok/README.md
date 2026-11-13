# Kno’s Pizzas · versión Grok

Rediseño mobile-first del calendario de pop-ups, colaboraciones y catering.
Conserva los textos, campos, validaciones y contratos del sitio en vivo.
La interfaz es solo de cliente (Vite + React), así que las fechas se calculan en el navegador con zona `America/Monterrey` y no hay flash de 1969.

## Arranque

```bash
cd versiones/grok
npm install
npm run dev
```

Abre http://127.0.0.1:4317

Ese comando levanta dos procesos:

- el front en el puerto 4317
- un mock en el puerto 4318, con `/api/eventos` y `/api/disponibilidad` en `[]`

Como la API real hoy responde vacía, la página muestra los cuatro encuentros de ejemplo del sitio actual, marcados como muestra.

## API

El código usa `VITE_API_BASE`. Si no está definida, el build apunta a:

`https://mesa-calendario-catering.jdelsol-91.chatgpt.site`

`npm run dev` la deja vacía y Vite hace de proxy hacia el mock, porque el sitio en vivo no envía CORS y rechaza POST de otro origen con `Origen no válido.`

| Comando | Qué consulta |
| --- | --- |
| `npm run dev` | Mock local, arreglos vacíos |
| `npm run dev:ejemplo` | Mock con datos de ejemplo (reservas y un encuentro con sede). No son eventos reales |
| `npm run dev:live` | Proxy al sitio en vivo. GET funciona. POST de solicitudes responde `Origen no válido.` |

El enlace «Gestionar agenda» abre `/gestion` en el sitio en vivo. Este proyecto no reconstruye el panel.

## Capturas

Están en `capturas/`: inicio a 390, 768 y 1280, y los diálogos de catering y de evento.
Para repetirlas, con el dev server arriba:

```bash
node scripts/capturas.mjs
```
