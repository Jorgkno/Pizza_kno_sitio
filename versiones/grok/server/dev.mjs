import { spawn } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const proxy = process.env.API_PROXY_TARGET || "http://127.0.0.1:4318"
const useMock = /127\.0\.0\.1:4318|localhost:4318/.test(proxy)
const children = []

function start(command, args, env) {
  const child = spawn(command, args, {
    cwd: appRoot,
    stdio: "inherit",
    env: { ...process.env, ...env },
  })
  children.push(child)
  child.on("exit", (code, signal) => {
    if (signal) return
    if (code && code !== 0) shutdown(code)
  })
}

function shutdown(code = 0) {
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM")
  }
  setTimeout(() => process.exit(code), 50)
}

process.on("SIGINT", () => shutdown(0))
process.on("SIGTERM", () => shutdown(0))

if (useMock) {
  start(process.execPath, ["server/mock.mjs"], {
    PORT: "4318",
    FIXTURES: process.env.FIXTURES || "",
  })
}

const viteBin = path.join(appRoot, "node_modules", "vite", "bin", "vite.js")
start(process.execPath, [viteBin, "--port", "4317", "--host", "127.0.0.1", "--strictPort"], {
  API_PROXY_TARGET: proxy,
  VITE_API_BASE: process.env.VITE_API_BASE ?? "",
})
