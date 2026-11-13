# Diagnóstico del sitio actual

El archivo adjunto no estaba en el entorno. Este inventario se reconstruyó el 13 de noviembre de 2026 a partir del HTML, el CSS y los bundles de

https://mesa-calendario-catering.jdelsol-91.chatgpt.site

La copia cruda está en `referencia/sitio-actual/`. Los contratos van aparte, en `contratos-api.md`.

Título: «Kno’s Pizzas · Calendario, catering y pop-ups».
Descripción: «Consulta nuestra agenda, descubre pop-ups y colaboraciones y solicita catering para tu próxima celebración.»
Idioma del documento: `es`. Tipografías: Fraunces y Nunito.
Zona de las fechas: `America/Monterrey`.

## Rutas

| Ruta | Quién la ve |
| --- | --- |
| `/` | Público. Calendario, encuentros y solicitud de catering |
| `/gestion` | Dueño, con login de ChatGPT. No se reimplementa |
| `/signin-with-chatgpt?return_to=/gestion` | Entrada al panel |
| `GET /api/eventos` | Público. Hoy responde `[]` |
| `GET /api/disponibilidad` | Público. Hoy responde `[]` |
| `POST /api/solicitudes` | Público, con `Origin` del propio sitio |
| `POST` y `DELETE /api/eventos`, `GET` y `PATCH /api/admin` | Sesión propietaria |

Anclas de la home: `#calendario`, `#encuentros`, `#vista-mes`.

## Home

Barra fija: «Kno’s ✳» y «PIZZAS · CATERING & POP-UPS». Enlace con nombre accesible «Kno’s Pizzas, inicio».
Navegación: «Calendario», «Pop-ups & colaboraciones», botón «Planeemos tu evento». En móvil, botón «Abrir menú».

Hero actual (también es el bloque de encuentros):

- Ceja: «SIEMPRE HAY ALGO COCINÁNDOSE»
- Título: «Pop-ups & colaboraciones.»
- «Pizza para compartir. Descubre dónde nos encontramos.»
- Enlace: «Ver semana y agendar catering» hacia `#calendario`
- Título accesible de la sección: «Próximos pop-ups y colaboraciones»

Cada tarjeta próxima (fecha ≥ hoy) muestra mes abreviado, día, día de la semana, tipo («Pop-up» o «Colaboración», y « · Ejemplo» si es muestra), título, fecha larga, hora de inicio y cierre, lugar y «Ver detalles».
Vacío: «Aún no hay próximos encuentros. Consulta las fechas de catering en la semana.»
Cargando: «Cargando encuentros…»
Error de red: «No pudimos cargar la agenda. Recarga la página para consultar las fechas.»
Si hay alguna muestra: «Encuentros de ejemplo · Fechas y sedes ilustrativas.» Si no: «Horarios locales de Monterrey.»

Los cuatro ejemplos, en ese orden, cuando `/api/eventos` viene vacío:

1. Pop-up, 14 nov 2026, 13:00–19:00, «Un sábado para compartir», «Patio de temporada · sede por confirmar».
2. Colaboración, 20 nov 2026, 19:00–23:00, «Pizza & vino», «Cocina invitada · sede por confirmar».
3. Pop-up, 28 nov 2026, 10:00–15:00, «Sábado de pizza», «Jardín de temporada · sede por confirmar».
4. Colaboración, 5 dic 2026, 18:00–22:00, «La última pizza del año», «Espacio colaborador · sede por confirmar».

`month` va en base 0 (noviembre = 10). Las descripciones están en el bundle `page.js`.

### Semana

Ceja «TU PRÓXIMA PIZZA YA TIENE FECHA», título «Vista por semana», rango en es-MX (por ejemplo «9 al 15 de noviembre de 2026»).
Botones: «Semana anterior», «Semana siguiente», «Hoy».
Filtros con `aria-pressed`: Todo, Catering, Pop-ups, Colaboraciones.
La regla del sitio: `all` muestra todo; `popup` y `collab` dejan solo ese `type`; `catering` no muestra ningún encuentro y deja solo el estado de catering del día. Las tarjetas de arriba no se filtran.

Cada día, de lunes a domingo:

- Si hay encuentros que pasan el filtro: miniatura, tipo (« · Ejemplo» si aplica), título y horario. El botón de catering sigue ahí.
- Si no: «Fecha pasada», «Catering reservado», «Fecha para catering» + «Sujeto a confirmación», «Consultando…» o «Agenda no disponible».
- Botón: «Agendar», «Reservado», «Fecha pasada», «Consultando» o «No disponible». Deshabilitado salvo en día abierto.
- Nombre accesible del botón: «Agendar catering», «Catering reservado», «Fecha pasada, catering no disponible», «Agenda no disponible» o «Consultando disponibilidad», más «el» y la fecha larga.

Leyenda: «Pop-up», «Colaboración», «Catering sujeto a confirmación».
El día de hoy lleva la marca «Hoy». Un día es pasado solo si es anterior a hoy en Monterrey.

### Mes

Ceja «EXPLORA TODAS LAS FECHAS», título «Vista por mes».
Encabezados: LUN MAR MIÉ JUE VIE SÁB DOM. La semana empieza en lunes.
Botones: «Mes anterior», «Mes siguiente», «Hoy» (vuelve al mes de hoy, no mueve la semana).
Celdas de otros meses solo muestran el número.
En el mes: número, chips «Pop-up» o «Colab.» si hay encuentro, y el mismo botón de catering.
Leyenda: «Pop-ups», «Colaboraciones», «Solicitar catering», «Reservado».
Nota: «Las fechas de catering se confirman después de revisar tu solicitud.»

### Cierre y pie

«NOSOTROS LLEVAMOS LAS PIZZAS», «Tú pones el motivo.», «Celebraciones, equipos y momentos que merecen buena comida.», botón «Cuéntanos tu idea».
Pie: «Kno’s Pizzas✳», «Pizza para compartir. Momentos para quedarse.», «Gestionar agenda ↗» hacia `/gestion`.

## Diálogo del encuentro

Pastilla «Pop-up» o «Colaboración», y « · Muestra» si es ejemplo.
Fecha «14 de noviembre de 2026», horario «13:00 — 19:00 · Hora de Monterrey», lugar y descripción.
Si es muestra: «Fecha y sede ilustrativas. Este encuentro todavía no tiene ubicación confirmada ni admite reservas.» No hay mapa.
Si no: dirección y «Cómo llegar» a `https://www.google.com/maps/search/?api=1&query=` con la dirección o, si falta, el lugar. Se abre en otra pestaña.
Botones: «Guardar fecha de muestra» o «Añadir a mi calendario», y «Compartir».
Cerrar con «Cerrar», Escape o clic en el fondo.

El `.ics` se llama `knos-evento.ics`. Calendario `PRODID:-//Knos Pizzas//Agenda//ES`, zona `America/Monterrey`, UID `knos-` + `example-` si es muestra + id + `@knos-pizzas.local`. El título de la muestra va con prefijo `[MUESTRA] `. La descripción de muestra es «Evento de muestra. Fecha y sede pendientes de confirmación.» y siempre cierra con «Horario local de Monterrey.»

Toasts, 3.5 s: «Evento de muestra descargado», «Evento descargado», «Enlace copiado», «No se pudo compartir. Puedes copiar el enlace del navegador.»
Compartir usa `navigator.share` con título, texto «Evento de muestra · » o «Kno’s Pizzas · » más el nombre, y la URL con `?evento=<id>`. Si no hay share, copia el enlace. Al abrir la home con `?evento=`, se abre esa ficha y el calendario salta a su semana y mes.

## Solicitud de catering

Ceja «UNA MESA A TU MEDIDA».
Título del paso 1 y 2: «Planeemos algo rico.»
Texto: «Cuéntanos lo esencial. La fecha se confirma después de revisar tu solicitud.»
Pasos: «01 Tu evento», «02 Tus datos».

Paso 1:

| Campo | Regla |
| --- | --- |
| Fecha | `date`, obligatorio, mínimo hoy. Al abrir desde un día, viene esa fecha |
| Hora | `time`, obligatorio, valor inicial `14:00` |
| Invitados | número, obligatorio, 1–1000, inicial 30 |
| Tipo de evento | obligatorio. Vacío «Selecciona una opción», luego «Celebración privada», «Evento de empresa», «Boda», «Otro encuentro» |
| ¿Dónde será? | texto, obligatorio, máximo 250. Placeholder «Ciudad, zona o lugar del evento» |
| Algo que debamos saber (opcional) | textarea, máximo 2000. Placeholder «Tu idea, estilo de menú, restricciones alimentarias…» |

Nota: «Cuéntanos cuántas personas asistirán. Sujeto a cobertura y disponibilidad.»
Botón «Continuar». Si la fecha está en disponibilidad: «Esta fecha ya tiene una reserva de catering confirmada. Elige otra fecha.» y no avanza.

Paso 2. Resumen «20 de diciembre de 2026 · 30 personas».
Nombre (máx. 150, `autocomplete=name`), correo (`email`, máx. 200), teléfono (`tel`, patrón `[+0-9 ()-]{7,25}`, placeholder «+52 81 1234 5678»).
Checkbox obligatorio, sin `name`: «Acepto que utilicen estos datos para gestionar y responder esta solicitud de catering.»
«Enviar solicitud». Mientras guarda: «Guardando solicitud…». «Volver a mi evento» regresa al paso 1 con lo escrito.

POST `/api/solicitudes` con los campos de ambos pasos y `guests` convertido a número.

Paso 3. Título «Ya estamos cocinando tu idea.»
«Tu solicitud se guardó correctamente.», la referencia, «Conserva tu referencia. Es una solicitud pendiente; aún no confirma la fecha ni el servicio.», botón «Volver al calendario».

Si el POST falla, se muestra `error` del JSON. Si el fallo no es un `Error`: «Intenta de nuevo.»

## Panel `/gestion` (solo inventario, no se reconstruye)

Sin sesión: «KNO’S PIZZAS · PANEL PRIVADO», «Tu agenda, en tus manos.», «Gestiona solicitudes y publica dónde estará Kno’s Pizzas.», «Entrar con la cuenta propietaria».
Con sesión: pestañas «Solicitudes (n)» y «Pop-ups y colaboraciones (n)».
Aviso: «Las solicitudes no envían correos automáticos. Contacta al cliente para cotizar y confirmar los detalles antes de marcar la reserva como confirmada.»
Vacío: «Aún no hay solicitudes. Aparecerán aquí cuando un cliente envíe el formulario.»
Estados: Pendiente, Confirmada, Cancelada. Acciones: Confirmar, Cancelar, Marcar pendiente.
Tras cambiar: «Estado actualizado. La confirmación al cliente debe enviarse por separado.»
Publicar encuentro: Título, Tipo, Fecha, Sede, Dirección completa («Calle, número, ciudad y estado»), Hora de inicio, Hora de cierre, Descripción. Nota: «Hora local de Monterrey. Los encuentros terminan el mismo día.» Botón «Publicar en calendario» / «Guardando…». Éxito: «Encuentro publicado en el calendario.»
Lista vacía: «La agenda muestra ejemplos hasta que publiques tu primer encuentro real.»
Borrar pide confirmación: «¿Eliminar este encuentro del calendario?» Error: «No se pudo eliminar.»
Volver: «← Volver al calendario».

## Problemas de la interfaz actual

1. El HTML del servidor pinta la semana «29 dic 1969 a 4 ene 1970» y «Diciembre 1969». El reloj del render no es Monterrey. Al hidratar, el cliente lo corrige y la fecha parpadea.
2. En móvil el mes tiene `min-width: 560px` y scroll horizontal. A 390 px se cortan sábado y domingo.
3. Hay `scroll-margin`, pero el header fijo puede tapar el ancla. La nav marca «Calendario» siempre, no según el scroll.
4. «Pop-ups & colaboraciones» y «Planeemos tu evento» usan el icono de enlace externo aunque son anclas o botones de la misma página.
5. `input type="time"` y `type="date"` siguen el idioma del sistema. En un navegador en inglés se ve «02:00 PM» y «11/13/2026», no 24 h ni día-mes-año.
6. En pantallas bajas el diálogo recorta el botón principal. El select «Selecciona una opción» se corta cuando fecha/hora e invitados/tipo van en dos columnas.
7. El día pasado y el disponible se distinguen poco si uno solo mira el color. El pasado tiene que leerse como no disponible también en el texto, y verse claramente distinto.

## Qué no inventar

No hay carta, precios, horarios de atención, cobertura prometida ni fotos reales de la casa. Las imágenes de los cuatro ejemplos son URLs de muestra del propio bundle. Un encuentro publicado desde el panel no trae foto.
