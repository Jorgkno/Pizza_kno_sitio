# Kno’s Pizzas · versión Muse

Rediseño del calendario de pop-ups, colaboraciones y catering, en HTML, CSS y JavaScript sin build y sin dependencias. Conserva los textos, campos, validaciones y contratos del sitio en vivo (`docs/DIAGNOSTICO.md` y `docs/contratos-api.md`).

Las fechas se calculan en el navegador con zona `America/Monterrey`, así que el HTML inicial no trae un calendario y no aparece la semana de 1969 que el sitio en vivo pinta en el servidor.

## Arranque

```bash
cd versiones/muse
npm run dev
```

Abre http://127.0.0.1:4327

El servidor de desarrollo no tiene dependencias de ejecución; `npm install` solo hace falta para generar las capturas (Playwright, devDependency). Ese comando levanta dos procesos:

- el front en el puerto 4327
- un mock en el puerto 4328, con `/api/eventos` y `/api/disponibilidad` en `[]`

Como la API real hoy responde vacía, la página muestra los cuatro encuentros de ejemplo del sitio actual, marcados como muestra.

## API

El front llama a `/api/...` con rutas relativas. En local, el servidor de desarrollo las proxea al mock; si la versión se publica en el mismo origen que la API, las llamadas llegan directas.

| Comando | Qué consulta |
| --- | --- |
| `npm run dev` | Mock local, arreglos vacíos |
| `npm run dev:ejemplo` | Mock con datos de ejemplo (reservas y un encuentro con sede). No son eventos reales |
| `npm run dev:live` | Proxy al sitio en vivo. GET funciona. POST de solicitudes responde `Origen no válido.` |

El enlace «Gestionar agenda» abre `/gestion` en el sitio en vivo. Este proyecto no reconstruye el panel.

Nunca se hace POST al sitio en vivo desde el dev normal: el mock responde en local y devuelve la referencia `KNO-` + 8 hex.

## Qué se conserva

- Ruta `/` con anclas `#encuentros`, `#calendario` y `#vista-mes`. `/gestion` es un enlace al sitio en vivo, no se reimplementa.
- `GET /api/eventos`, `GET /api/disponibilidad` y `POST /api/solicitudes`, con `guests` numérico.
- Fallback a los 4 ejemplos si eventos viene `[]`, con la nota «Encuentros de ejemplo · Fechas y sedes ilustrativas.»
- Filtros Todo, Catering, Pop-ups, Colaboraciones. Misma regla: Catering oculta pop-ups y colaboraciones; los otros filtran por `type`.
- Estados del día: pasada, reservada, abierta, consultando, no disponible, con los mismos textos y `aria-label`.
- Hoy, semana anterior/siguiente, mes anterior/siguiente.
- Diálogo del evento: Maps solo si no es muestra, `.ics` con el mismo `VEVENT` (`knos-evento.ics`), compartir `?evento=`.
- Formulario de catering en dos pasos, mismos campos, máximos, patrón de teléfono, consentimiento sin `name`, fecha reservada, éxito con referencia.
- Mensajes de error y éxito del sitio actual, más el texto de formato 24 h en el campo de hora.

## Qué se ve distinto

- Sin build y sin React: una sola página con `index.html`, `styles.css` y `app.js`.
- Tarjetas de encuentros en carril horizontal en móvil y en dos columnas desde 768 px.
- Semana en lista a 390 px, con el domingo incluido. Desde 768 px, siete columnas que caben en el ancho.
- Mes con siete columnas también a 390 px, sin scroll horizontal.
- Diálogo con botones en una barra fija, para que no se corten. El select de tipo de evento va a ancho completo.
- La hora se escribe en 24 h (`14:00`). La fecha visible del formulario está en es-MX («15 de noviembre de 2026»), encima del control nativo.
- La navegación marca la sección según el scroll. Los anclas internos no llevan icono de enlace externo.
- Sección «Momentos para quedarse.» con tres marcos vacíos. No hay fotos de stock ni imágenes generadas ahí.
- Fechas pasadas en gris y con la etiqueta «Fecha pasada». Las abiertas usan menta y «Agendar».
- Textos nuevos, pedidos o necesarios para el rediseño: «Ver próximas fechas», «Solicitar catering», «Sin fotografía», «Elige una fecha», «Formato de 24 horas, por ejemplo 14:00.», «Saltar al contenido», «Menú» / «Cerrar». No hay horarios, sedes ni promesas nuevas.
- Las fotos de los cuatro ejemplos siguen siendo las URLs de Unsplash del fallback actual. Los marcos de experiencia están vacíos.

## Capturas

Están en `capturas/`: inicio a 390 y 1280, y los diálogos de evento y de catering a 390. Para repetirlas, con el dev server arriba:

```bash
npm install
npx playwright install chromium
npm run capturas
```
