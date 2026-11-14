import puppeteer from "puppeteer-core"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const out = path.join(root, "capturas")
const base = process.env.APP_URL || "http://127.0.0.1:4317/"
const chrome = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars", "--lang=es-MX"],
})

const failures = []
function check(name, ok, detail) {
  if (!ok) failures.push(`${name}: ${detail}`)
  else console.log("ok", name)
}

async function prepare(page) {
  await page.goto(base, { waitUntil: "networkidle0" })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForFunction(() => document.body.innerText.includes("Vista por semana"))
}

async function layout(page) {
  return page.evaluate(() => {
    const headers = [...document.querySelectorAll(".weekdays span")]
    const days = [...document.querySelectorAll(".week-day")]
    const monthLast = headers[6]?.getBoundingClientRect()
    const sunday = days[6]?.getBoundingClientRect()
    return {
      has1969: document.body.innerText.includes("1969"),
      scrollWidth: document.documentElement.scrollWidth,
      inner: window.innerWidth,
      monthRight: monthLast?.right ?? -1,
      monthLeft: headers[0]?.getBoundingClientRect().left ?? -1,
      sundayRight: sunday?.right ?? -1,
      sundayLeft: sunday?.left ?? -1,
      weekCount: days.length,
      weekdayCount: headers.length,
      sample: document.body.innerText.includes("Encuentros de ejemplo"),
      past: document.body.innerText.includes("Fecha pasada"),
      agendar: document.body.innerText.replace(/\u00AD/g, "").includes("Agendar"),
    }
  })
}

const page = await browser.newPage()
await page.setRequestInterception(true)
page.on('request',request=>{
  if (request.method() === 'POST' && new URL(request.url()).hostname !== '127.0.0.1') {
    failures.push('POST externo bloqueado'); return request.abort()
  }
  request.continue()
})
await page.evaluateOnNewDocument(() => {
 const OriginalDate=Date
 window.Date=class extends OriginalDate {
  constructor(...args){super(...(args.length?args:['2026-11-14T18:00:00Z']))}
  static now(){return new OriginalDate('2026-11-14T18:00:00Z').getTime()}
 }
})

for (const width of [390, 768, 1280]) {
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 })
  await prepare(page)
  const box = await layout(page)
  check(`${width} sin 1969`, !box.has1969, "apareció 1969")
  check(`${width} sin scroll horizontal`, box.scrollWidth <= box.inner + 1, `${box.scrollWidth} > ${box.inner}`)
  check(`${width} siete columnas del mes`, box.weekdayCount === 7 && box.monthLeft >= -1 && box.monthRight <= box.inner + 1, JSON.stringify(box))
  check(`${width} domingo de la semana dentro`, box.weekCount === 7 && box.sundayLeft >= -1 && box.sundayRight <= box.inner + 1, JSON.stringify(box))
  check(`${width} ejemplos y estados`, box.sample && box.past && box.agendar, JSON.stringify(box))
  await page.screenshot({ path: path.join(out, `home-${width}.png`), fullPage: true })
}

await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
await prepare(page)
await page.evaluate(() => {
  document.querySelector('a[href="#encuentros"]')?.click()
})
await new Promise((resolve) => setTimeout(resolve, 400))
const anchor = await page.evaluate(() => {
  const el = document.getElementById("encuentros")
  const header = document.querySelector(".site-header").getBoundingClientRect().height
  return { top: el.getBoundingClientRect().top, header }
})
check("ancla bajo el header", anchor.top >= anchor.header - 2, JSON.stringify(anchor))

await page.evaluate(() => {
  const button = [...document.querySelectorAll("button")].find((item) => item.textContent.includes("Planeemos"))
  button?.click()
})
await page.waitForSelector("dialog[open] #dialog-title")
await page.screenshot({ path: path.join(out, "dialogo-paso1-390.png") })
const dialog = await page.evaluate(() => {
  const root = document.querySelector("dialog[open]")
  const button = [...root.querySelectorAll("button")].find((item) => item.textContent.includes("Continuar"))
  const select = root.querySelector("select")
  const buttonBox = button.getBoundingClientRect()
  const dialogBox = root.getBoundingClientRect()
  const selectBox = select.getBoundingClientRect()
  return {
    buttonInside: buttonBox.top >= dialogBox.top && buttonBox.bottom <= dialogBox.bottom + 1 && buttonBox.bottom <= window.innerHeight + 1,
    selectText: select.options[0].text,
    selectFits: select.scrollWidth <= select.clientWidth + 2,
    face: root.querySelector(".date-face")?.textContent ?? "",
    time: root.querySelector('input[name="time"]').value,
    selectWidth: selectBox.width,
    titleTop: root.querySelector("h2").getBoundingClientRect().top,
    dialogTop: dialogBox.top,
  }
})
check("botón continuar visible", dialog.buttonInside && dialog.titleTop >= 0 && dialog.titleTop < 200, JSON.stringify(dialog))
check("select completo", dialog.selectFits && dialog.selectText === "Selecciona una opción", JSON.stringify(dialog))
check("hora 24h", dialog.time === "14:00", dialog.time)

await page.evaluate(() => {
  const input = document.querySelector('dialog[open] input[name="date"]')
  const proto = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")
  proto.set.call(input, "2026-12-20")
  input.dispatchEvent(new Event("input", { bubbles: true }))
  input.dispatchEvent(new Event("change", { bubbles: true }))
  const select = document.querySelector('dialog[open] select')
  select.value = "Boda"
  select.dispatchEvent(new Event("change", { bubbles: true }))
  const place = document.querySelector('dialog[open] input[name="location"]')
  proto.set.call(place, "San Pedro Garza García")
  place.dispatchEvent(new Event("input", { bubbles: true }))
})
await page.evaluate(() => {
  document.querySelector('dialog[open] button[type="submit"]').click()
})
await page.waitForSelector('dialog[open] input[name="email"]')
await page.screenshot({ path: path.join(out, "dialogo-paso2-390.png") })

await page.evaluate(() => {
  const proto = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")
  const root = document.querySelector("dialog[open]")
  for (const [name, value] of [
    ["name", "Ana López"],
    ["email", "ana@example.com"],
    ["phone", "+52 81 1234 5678"],
  ]) {
    const input = root.querySelector(`[name="${name}"]`)
    proto.set.call(input, value)
    input.dispatchEvent(new Event("input", { bubbles: true }))
  }
  const box = root.querySelector('input[type="checkbox"]')
  box.checked = true
  box.dispatchEvent(new Event("change", { bubbles: true }))
  root.querySelector('button[type="submit"]').click()
})
await page.waitForFunction(() => document.body.innerText.includes("Ya estamos cocinando tu idea."))
const success = await page.evaluate(() => {
  const root = document.querySelector("dialog[open]")
  const button = [...root.querySelectorAll("button")].find((item) => item.textContent.includes("Volver al calendario"))
  const buttonBox = button.getBoundingClientRect()
  const dialogBox = root.getBoundingClientRect()
  return {
    reference: /KNO-[0-9A-F]{8}/.test(root.innerText),
    buttonInside: buttonBox.bottom <= dialogBox.bottom + 1 && buttonBox.bottom <= window.innerHeight + 1,
  }
})
check("referencia de éxito", success.reference, JSON.stringify(success))
check("botón de éxito visible", success.buttonInside, JSON.stringify(success))
await page.screenshot({ path: path.join(out, "dialogo-exito-390.png") })
await page.evaluate(() => {
  document.querySelector('dialog[open] button.btn.primary')?.click()
})

await page.evaluate(() => {
  const card = document.querySelector(".event-card")
  card?.click()
})
await page.waitForSelector("dialog[open] #event-dialog-title")
await page.screenshot({ path: path.join(out, "dialogo-evento-390.png") })
const eventDialog = await page.evaluate(() => {
  const root = document.querySelector("dialog[open]")
  const button = [...root.querySelectorAll("button")].find((item) => item.textContent.includes("Guardar fecha de muestra"))
  const buttonBox = button.getBoundingClientRect()
  return {
    sample: root.innerText.includes("Fecha y sede ilustrativas"),
    buttonInside: buttonBox.bottom <= window.innerHeight + 1 && buttonBox.bottom <= root.getBoundingClientRect().bottom + 1,
    noMaps: !root.innerText.includes("Cómo llegar"),
  }
})
check("evento de muestra", eventDialog.sample && eventDialog.noMaps && eventDialog.buttonInside, JSON.stringify(eventDialog))

await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 })
await prepare(page)
await page.evaluate(() => {
  const button = [...document.querySelectorAll("button")].find((item) => item.textContent.includes("Planeemos tu evento"))
  button?.click()
})
await page.waitForSelector("dialog[open]")
await page.screenshot({ path: path.join(out, "dialogo-paso1-1280.png") })

// Filters affect both calendars, while encounter cards stay visible.
await page.evaluate(() => document.querySelector('dialog[open] .close').click())
await page.evaluate(() => [...document.querySelectorAll('.filters button')].find(b=>b.textContent==='Catering').click())
check('filtro catering',await page.$eval('.filters button.selected',b=>b.getAttribute('aria-pressed'))==='true' && (await page.$$('.mini-event,.month-chip')).length===0,'encuentros visibles en calendario')
await page.evaluate(() => [...document.querySelectorAll('.filters button')].find(b=>b.textContent==='Todo').click())
check('cuatro muestras conservadas',(await page.$$('.event-card')).length===4,'cantidad incorrecta')
const gestion=await fetch(base+'gestion',{redirect:'manual'})
check('ruta gestion',gestion.status===302 && gestion.headers.get('location').endsWith('/gestion'),'no redirige al panel')
const invalid=await fetch(base+'api/solicitudes',{method:'POST',headers:{'Content-Type':'application/json',Origin:'http://127.0.0.1:4317'},body:JSON.stringify({guests:'30'})})
check('guests string rechazado',invalid.status===400,'contrato inválido')
await page.goto(base+'?evento=2',{waitUntil:'networkidle0'})
check('enlace compartido',await page.$eval('dialog[open] #event-dialog-title',n=>n.textContent)==='Pizza & vino','ficha no abierta')
await page.keyboard.press('Escape')
// Inject only the documented reservation shape; no requests go to production.
await page.setRequestInterception(false)
await page.setRequestInterception(true)
page.removeAllListeners('request')
page.on('request',r=>r.url().endsWith('/api/disponibilidad') ? r.respond({status:200,contentType:'application/json',body:JSON.stringify([{date:'2026-12-20'}])}) : r.continue())
await prepare(page)
await page.evaluate(()=>document.querySelector('.nav-book').click())
await page.evaluate(()=>{
 const form=document.querySelector('dialog[open] form')
 const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set
 for(const [name,value] of [['date','2026-12-20'],['location','Prueba local']]){const i=form.querySelector(`[name="${name}"]`);setter.call(i,value);i.dispatchEvent(new Event('input',{bubbles:true}));i.dispatchEvent(new Event('change',{bubbles:true}))}
 form.querySelector('select').value='Boda';form.querySelector('[type="submit"]').click()
})
await page.waitForSelector('.form-error')
check('fecha reservada bloqueada',await page.$eval('.form-error',n=>n.textContent.includes('Esta fecha ya tiene una reserva')),'avanzó a datos')
await page.keyboard.press('Escape')
page.removeAllListeners('request')
page.on('request',r=>r.url().includes('/api/') ? r.abort() : r.continue())
await prepare(page)
check('error de agenda visible',await page.$eval('body',n=>n.innerText.includes('No pudimos cargar la agenda.')),'sin error')
check('sin agendar ante error',(await page.$$('.book-open')).length===0,'agenda abierta sin disponibilidad')
await browser.close()

if (failures.length) {
  console.error(failures.join("\n"))
  process.exit(1)
}
console.log("capturas listas")
