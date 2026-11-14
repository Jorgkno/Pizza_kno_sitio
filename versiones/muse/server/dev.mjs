/* Servidor de desarrollo de la versión Muse.
   Sirve los archivos estáticos de esta carpeta y proxea
   /api al mock local (puerto 4328) o al objetivo que se
   indique con API_PROXY_TARGET.
   El front llama a /api/... con rutas relativas, así que
   no hay problema de CORS en local. */

import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const frontPort = Number(process.env.PORT || 4327);
const proxyTarget = process.env.API_PROXY_TARGET || "http://127.0.0.1:4328";
const useMock = /127\.0\.0\.1:4328|localhost:4328/.test(proxyTarget);
const children = [];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
};

function startMock() {
  const child = spawn(process.execPath, ["server/mock.mjs"], {
    cwd: appRoot,
    stdio: "inherit",
    env: { ...process.env, PORT: "4328", FIXTURES: process.env.FIXTURES || "" },
  });
  children.push(child);
  child.on("exit", (code, signal) => {
    if (!signal && code && code !== 0) shutdown(code);
  });
}

function shutdown(code = 0) {
  for (const child of children) if (!child.killed) child.kill("SIGTERM");
  setTimeout(() => process.exit(code), 50);
}
process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

async function proxy(req, res) {
  try {
    const target = new URL(req.url || "/", proxyTarget);
    const headers = { ...req.headers };
    delete headers.host;
    const upstream = await fetch(target, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method || "GET") ? undefined : await readBody(req),
      redirect: "manual",
    });
    const body = await upstream.arrayBuffer();
    res.writeHead(upstream.status, {
      "content-type": upstream.headers.get("content-type") || "application/json",
      "cache-control": "no-store",
    });
    res.end(Buffer.from(body));
  } catch {
    res.writeHead(502, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "No pudimos cargar la agenda. Recarga la página para consultar las fechas." }));
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://127.0.0.1");
  if (url.pathname.startsWith("/api/")) {
    await proxy(req, res);
    return;
  }
  const rel = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\/+/, "");
  const safe = path.normalize(rel).replace(/^(\.\.[/\\])+/, "");
  const file = path.join(appRoot, safe);
  if (!file.startsWith(appRoot)) {
    res.writeHead(403);
    res.end();
    return;
  }
  try {
    const data = await readFile(file);
    res.writeHead(200, {
      "content-type": MIME[path.extname(file)] || "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(data);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("No encontrado");
  }
});

if (useMock) startMock();

server.listen(frontPort, "127.0.0.1", () => {
  console.log(`Kno’s Pizzas · versión Muse en http://127.0.0.1:${frontPort}`);
  console.log(`API: ${useMock ? "mock local en http://127.0.0.1:4328" : proxyTarget}`);
});
