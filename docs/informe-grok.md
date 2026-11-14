# Informe de la versión Grok

Rediseño mobile-first, editorial, con Fraunces y Nunito. Fondo crema `#FFFBF5`. La lavanda `#8E6BA1` se usa en el título grande y en el asterisco. Botones, enlaces y títulos de cuerpo usan `#5C3D78`, el mismo matiz oscurecido para pasar contraste con texto blanco o sobre crema. Menta para lo disponible y el filtro activo, cielo para colaboraciones, rosa para pop-ups, durazno para catering y para la fecha reservada. Cada color va con una palabra: Agendar, Reservado, Pop-up, Colaboración, Fecha pasada.

Las fechas se calculan en el cliente con `America/Monterrey`. El HTML inicial no trae un calendario, así que no aparece la semana de 1969 que el sitio en vivo pinta en el servidor.

## Qué se ve distinto

- Hero con el texto que ya existía y dos acciones: «Ver próximas fechas» y «Solicitar catering».
- Semana en lista a 390 px, domingo incluido. Desde 768 px, siete columnas que caben en el ancho.
- Mes con siete columnas también a 390 px, sin scroll horizontal. «Fecha pasada» y «Agendar» se leen enteros.
- Diálogo con indicador de paso y botones en una barra fija, para que no se corten. El select de tipo de evento va a ancho completo.
- La hora se escribe en 24 h (`14:00`). La fecha visible del formulario está en es-MX («15 de noviembre de 2026»), encima del control nativo.
- La navegación marca la sección según el scroll. Los anclas internos no llevan icono de enlace externo.
- Sección «Momentos para quedarse.» con tres marcos vacíos. No hay fotos de stock ni imágenes generadas ahí.
- Fechas pasadas en gris y con la etiqueta «Fecha pasada». Las abiertas usan menta y «Agendar».

## Lista de conservación

| Pieza | Estado |
| --- | --- |
| Ruta `/` y anclas `#encuentros`, `#calendario`, `#vista-mes` | Conservadas |
| `/gestion` | Enlace al sitio en vivo. El panel no se reconstruyó |
| `GET /api/eventos`, `GET /api/disponibilidad`, `POST /api/solicitudes` | Mismos caminos y el mismo cuerpo, con `guests` numérico |
| Fallback de 4 ejemplos si eventos viene `[]` | Igual al sitio actual, con la nota «Encuentros de ejemplo · Fechas y sedes ilustrativas.» |
| Filtros Todo, Catering, Pop-ups, Colaboraciones | Misma regla: Catering oculta pop-ups y colaboraciones; los otros filtran por `type` |
| Estados del día | pasada, reservada, abierta, consultando, no disponible, con los mismos textos y `aria-label` |
| Hoy, semana anterior/siguiente, mes anterior/siguiente | Conservados |
| Diálogo del evento | Maps solo si no es muestra, `.ics` con el mismo `VEVENT`, compartir `?evento=` |
| Formulario | Dos pasos, mismos campos, máximos, patrón de teléfono, consentimiento sin `name`, fecha reservada, éxito con referencia |
| Mensajes de error y éxito | Los del sitio actual, más el texto de formato 24 h en el campo de hora |

## Qué no quedó igual, y por qué

- El tar `uploads/knos-sitio-actual.tar.gz` y el `DIAGNOSTICO.md` adjunto no estaban en el entorno. `referencia/sitio-actual/` y `docs/DIAGNOSTICO.md` se armaron el 13 de noviembre de 2026 desde el sitio en vivo. Las capturas originales del tar no están.
- El POST al origen en vivo desde este front falla con «Origen no válido.» y el navegador bloquea el GET por falta de CORS. `npm run dev` usa un mock con los mismos contratos. `npm run dev:live` proxea el GET real.
- Para que «Agendar» y «Reservado» quepan en la celda del mes a 390 px, el botón lleva un guion blando. La palabra visible y el nombre accesible siguen siendo los del sitio.
- Textos nuevos, pedidos o necesarios para el rediseño: «Ver próximas fechas», «Solicitar catering», «Sin fotografía», «Elige una fecha», «Formato de 24 horas, por ejemplo 14:00.», «Saltar al contenido», «Menú» / «Cerrar». No hay horarios, sedes ni promesas nuevas.
- Las fotos de los cuatro ejemplos siguen siendo las URLs de Unsplash del fallback actual. Los marcos de experiencia están vacíos.
- Al documentar el contrato se crearon por error tres solicitudes reales. Están listadas en `docs/contratos-api.md` para cancelarlas en `/gestion`.

## Verificación

Con el mock vacío, en Chrome, a 390, 768 y 1280:

- no aparece 1969
- no hay scroll horizontal
- el mes muestra LUN–DOM dentro del ancho
- el domingo de la semana entra en el ancho
- el ancla `#encuentros` queda debajo del header
- el botón Continuar, el de éxito y el de la ficha quedan dentro del diálogo
- el select muestra «Selecciona una opción» sin recorte
- la hora por defecto es `14:00`
- un envío de prueba al mock devuelve `KNO-` + 8 hex
- la ficha de muestra no ofrece «Cómo llegar»

Las capturas están en `versiones/grok/capturas/`.
