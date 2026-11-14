# Kno’s Pizzas · versión ChatGPT

Una agenda tipográfica en crema, lavanda y menta, con Fraunces y Nunito. Las tarjetas dan prioridad a fecha, tipo y sede; la semana usa siete columnas en escritorio y una lista completa en móvil. El mes conserva los siete días a 390 px. No se añadieron fotografías, carta, precios, horarios ni promesas de cobertura.

## Ejecutar

Requisitos: Node.js 22.14 o posterior y npm.

```sh
cd versiones/chatgpt
npm ci
npm run dev
```

Abrir http://127.0.0.1:4317. Un solo comando inicia Vite y la API local. Las solicitudes se guardan **solo en memoria local** y se pierden al detener el proceso; no son reservas reales. Los GET locales responden `[]`, activando exactamente los cuatro ejemplos documentados, identificados como ejemplos. Se conservaron fechas, textos y descripciones del bundle de referencia. Se reutilizó y revisó la lógica React de la versión Grok; esta variante cambia composición, estilos y conexión segura.

Para consultar eventos y disponibilidad reales, exclusivamente por GET:

```sh
LIVE_READ=1 npm run dev
```

Los POST siguen siendo locales incluso en ese modo. El servidor no contiene un proxy de escritura al sitio en vivo. No se hizo ningún POST al sitio en vivo durante esta entrega.

## API y rutas

El cliente llama a `/api/eventos`, `/api/disponibilidad` y `/api/solicitudes` en su propio origen, sin saltarse CORS. El servidor local respeta las formas documentadas: `guests` numérico, referencia `KNO-` + ocho hexadecimales, errores JSON y consentimiento sin enviar. Las fechas reservadas no avanzan al paso de contacto; tampoco se envía con disponibilidad sin cargar o fallida. Nombre, correo, teléfono, lugar, notas, fechas y cantidades conservan sus límites y validaciones.

`/gestion` redirige al panel propietario del sitio actual. No se reconstruyen el panel, el login ni `/api/admin`. Se conservan `/`, `#encuentros`, `#calendario`, `#vista-mes` y enlaces `?evento=<id>`.

`npm run build` produce `dist/`. Para un despliegue real, el alojamiento debe servir esos archivos y conectar las tres rutas API a un backend del mismo origen que implemente `../../docs/contratos-api.md`, además de redirigir `/gestion` al panel existente. El mock es una herramienta de desarrollo, no un backend persistente. Esta entrega no despliega el sitio ni cambia producción.

## Comprobaciones y capturas

```sh
npm run build
npm test
```

Para las pruebas debe estar activo `npm run dev`. `npm test` usa Chrome instalado; en macOS detecta la ruta estándar. En otro sistema indicar `CHROME=/ruta/a/chrome npm test`.

Las pruebas usan exclusivamente localhost, bloquean POST externos y fijan el reloj del navegador al **14 de noviembre de 2026, mediodía de Monterrey** para que las capturas sean reproducibles. El sitio usa la fecha real de Monterrey, sin ese reloj de prueba. Las fechas reservadas inyectadas en pruebas son fixtures aisladas y no aparecen en la agenda ni en las capturas.

Se comprueban 390, 768 y 1280 px, ausencia de desbordamiento, siete columnas, domingo semanal, anclas, filtros, éxito local, formato de referencia, fecha reservada, enlace compartido, ruta de gestión y fallos de red. Los diálogos nativos conservan foco, Escape y cierre con fondo; tienen contenido desplazable y acciones visibles. Se respeta reducción de movimiento.

- [Home · 390 px](capturas/home-390.png)
- [Home · 1280 px](capturas/home-1280.png)
- [Home · 768 px](capturas/home-768.png)
- [Catering · paso 1 · 390 px](capturas/dialogo-paso1-390.png)
- [Catering · paso 1 · 1280 px](capturas/dialogo-paso1-1280.png)
- [Catering · paso 2 · 390 px](capturas/dialogo-paso2-390.png)
- [Éxito local · 390 px](capturas/dialogo-exito-390.png)
- [Detalle de muestra · 390 px](capturas/dialogo-evento-390.png)

No se verificaron login propietario ni persistencia de solicitudes en producción. Las fuentes se descargan de Google Fonts; hay sustitutos locales si la red no está disponible.
