# Kno’s Pizzas

Repositorio para rediseñar el sitio de Kno’s Pizzas, catering y pop-ups en Monterrey.
Todo el texto de la interfaz va en español (es-MX).

El sitio que está en línea es [mesa-calendario-catering.jdelsol-91.chatgpt.site](https://mesa-calendario-catering.jdelsol-91.chatgpt.site). No tenemos su código fuente. La referencia de comportamiento, textos y contratos está en `referencia/sitio-actual/` y en `docs/`.

## Las tres versiones

La idea es juntar después lo mejor de tres frentes en una sola versión final.

| Carpeta | Qué es | Cómo correrla |
| --- | --- | --- |
| `versiones/grok` | Rediseño de esta entrega. Vite + React | `cd versiones/grok && npm install && npm run dev` |
| `versiones/chatgpt` | Variante hecha con ChatGPT. Todavía vacía | Ver el README de esa carpeta cuando haya código |
| `versiones/muse` | Variante hecha con Muse. Todavía vacía | Ver el README de esa carpeta cuando haya código |

Cada versión debe poder arrancar con un comando documentado en su README y debe respetar `docs/contratos-api.md` y el inventario de `docs/DIAGNOSTICO.md`.

## Mapa del repo

- `docs/DIAGNOSTICO.md` — inventario de rutas, secciones, textos, campos, validaciones y problemas de la interfaz actual.
- `docs/contratos-api.md` — formas de `/api/eventos`, `/api/disponibilidad` y `/api/solicitudes`, y la nota de que `/gestion` y `/api/admin` viven detrás del login de ChatGPT.
- `docs/informe-grok.md` — qué cambió en la versión Grok y qué se conservó.
- `referencia/sitio-actual/` — copia de lectura del sitio en vivo (HTML, CSS, bundles y respuestas de API). No se edita para construir.

## Lista para fusionar

Al comparar las tres versiones, revisar punto por punto:

1. Rutas públicas: `/` con anclas `#encuentros`, `#calendario` y `#vista-mes`. `/gestion` sigue en el sitio en vivo, no se reimplementa.
2. Contratos: GET de eventos y disponibilidad, POST de solicitudes con `guests` numérico, referencia `KNO-` + 8 hex, y errores documentados.
3. Textos: hero, tarjetas, semana, mes, leyendas, diálogo del evento, los dos pasos del catering, éxito, toasts y pie.
4. Campos y límites: fecha mínima hoy, hora, invitados 1–1000, tipo de evento, lugar 250, notas 2000, nombre 150, correo 200, teléfono, consentimiento.
5. Validaciones y mensajes: fecha ya reservada, error de red o de API, agenda no disponible, estados del día (pasada, reservada, abierta, consultando, no disponible).
6. Interacciones: filtros Todo / Catering / Pop-ups / Colaboraciones, Hoy, semana anterior y siguiente, mes anterior y siguiente, diálogo con Maps, `.ics`, compartir `?evento=`, formulario de dos pasos y fallback a los 4 ejemplos si `/api/eventos` viene vacío.
7. Responsive: 390, 768 y 1280. El mes muestra los 7 días en 390. La semana no corta el domingo.
8. Accesibilidad: contraste, foco visible, objetivos de 44 px, etiquetas, `prefers-reduced-motion`, estados de carga, error y vacío.
9. Personalidad: Fraunces y Nunito, paleta crema / lavanda / menta / cielo / rosa / durazno, y color siempre acompañado de texto.
