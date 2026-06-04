import fs from "node:fs/promises"
import type { IncomingMessage, ServerResponse } from "node:http"
import path from "node:path"

import type { Connect, Plugin } from "vite"

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173")
  res.end(JSON.stringify(body))
}

function resolveSafe(root: string, rel: string): string | null {
  const resolved = path.resolve(root, rel)
  return resolved.startsWith(root + path.sep) || resolved === root ? resolved : null
}

async function handleList(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? "", "http://localhost")
  const dir = url.searchParams.get("dir")
  if (!dir) {
    sendJson(res, 400, { error: "Missing ?dir=" })
    return
  }
  const safe = resolveSafe(dir, ".")
  if (!safe) {
    sendJson(res, 403, { error: "Forbidden" })
    return
  }
  try {
    const entries = await fs.readdir(safe, { withFileTypes: true })
    const names = entries.map((e) => e.name)
    sendJson(res, 200, names)
  } catch {
    sendJson(res, 404, { error: "Directory not found" })
  }
}

async function handleFiles(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? "", "http://localhost")
  const filePath = url.searchParams.get("path")
  if (!filePath) {
    sendJson(res, 400, { error: "Missing ?path=" })
    return
  }
  const dir = path.dirname(filePath)
  const safe = resolveSafe(dir, path.basename(filePath))
  if (!safe) {
    sendJson(res, 403, { error: "Forbidden" })
    return
  }
  try {
    const text = await fs.readFile(safe, "utf-8")
    res.statusCode = 200
    res.setHeader("Content-Type", "text/plain; charset=utf-8")
    res.end(text)
  } catch {
    sendJson(res, 404, { error: "File not found" })
  }
}

function createFileServerMiddleware(): Connect.NextHandleFunction {
  return (req, res, next) => {
    const pathname = req.url?.split("?")[0] ?? ""

    if (req.method === "HEAD" && pathname === "/api/list") {
      res.statusCode = 200
      res.end()
      return
    }

    if (req.method === "GET" && pathname === "/api/list") {
      void handleList(req, res)
      return
    }

    if (req.method === "GET" && pathname === "/api/files") {
      void handleFiles(req, res)
      return
    }

    next()
  }
}

export function meridianFileServerPlugin(): Plugin {
  return {
    name: "meridian-file-server",
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use(createFileServerMiddleware())
    },
  }
}
