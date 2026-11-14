/* Capturas de la versión Muse.
   Requiere el servidor de desarrollo arriba (npm run dev).
   Usa Playwright (devDependency). La primera vez:
   npm install && npx playwright install chromium
   Salida: capturas/home-390.png, capturas/home-1280.png,
   capturas/dialogo-evento-390.png y capturas/dialogo-paso1-390.png. */

import { chromium } from "playwright-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = process.env.BASE_URL || "http://127.0.0.1:4327";
const outDir = path.join(root, "capturas");

const shots = [
  { name: "home-390.png", width: 390, height: 844, url: `${base}/`, click: null },
  { name: "home-1280.png", width: 1280, height: 900, url: `${base}/`, click: null },
  { name: "dialogo-evento-390.png", width: 390, height: 844, url: `${base}/?evento=1`, click: null },
  { name: "dialogo-paso1-390.png", width: 390, height: 844, url: `${base}/`, click: "#hero-book" },
];

const browser = await chromium.launch();
for (const shot of shots) {
  const page = await browser.newPage({ viewport: { width: shot.width, height: shot.height } });
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  await page.goto(shot.url, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  if (shot.click) {
    await page.click(shot.click);
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: path.join(outDir, shot.name) });
  console.log(`capturas/${shot.name} · ${shot.width}px${errors.length ? ` · errores JS: ${errors.join("; ")}` : ""}`);
  await page.close();
}
await browser.close();
