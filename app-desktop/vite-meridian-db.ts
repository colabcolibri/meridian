import { execFile } from "node:child_process"
import type { IncomingMessage, ServerResponse } from "node:http"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"

import type { Connect, Plugin } from "vite"

const execFileAsync = promisify(execFile)

const appDesktopRoot = path.dirname(fileURLToPath(import.meta.url))
const exportScript = path.resolve(
  appDesktopRoot,
  "../.agent/scripts/meridian_db_export.py",
)

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173")
  res.end(JSON.stringify(body))
}

async function handleDbRequest(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? "", "http://localhost")
  const packageRoot = url.searchParams.get("packageRoot")
  const probe = url.searchParams.get("probe") === "1"

  if (!packageRoot) {
    sendJson(res, 400, { error: "Missing ?packageRoot=" })
    return
  }

  const resolvedRoot = path.resolve(packageRoot)
  const args = probe
    ? [exportScript, resolvedRoot, "--probe"]
    : [exportScript, resolvedRoot]

  try {
    const { stdout } = await execFileAsync("python3", args, {
      cwd: appDesktopRoot,
      maxBuffer: 16 * 1024 * 1024,
    })
    if (probe) {
      sendJson(res, 200, { ok: true })
      return
    }
    const payload = JSON.parse(stdout) as unknown
    sendJson(res, 200, payload)
  } catch (error) {
    const execError = error as NodeJS.ErrnoException & {
      stdout?: string
      stderr?: string
      code?: number
    }
    if (probe && execError.code === 1) {
      sendJson(res, 200, { ok: false })
      return
    }
    sendJson(res, 500, {
      error: execError.message,
      stderr: execError.stderr ?? "",
      stdout: execError.stdout ?? "",
    })
  }
}

function createDbMiddleware(): Connect.NextHandleFunction {
  return (req, res, next) => {
    const pathname = req.url?.split("?")[0] ?? ""
    if (req.method !== "GET" || pathname !== "/api/meridian/db") {
      next()
      return
    }
    void handleDbRequest(req, res)
  }
}

export function meridianDbApi(): Plugin {
  const attach = (server: { middlewares: Connect.Server }) => {
    server.middlewares.use(createDbMiddleware())
  }

  return {
    name: "meridian-db-api",
    enforce: "pre",
    configureServer: attach,
    configurePreviewServer: attach,
  }
}
