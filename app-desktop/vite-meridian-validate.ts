import { execFile } from "node:child_process"
import type { IncomingMessage, ServerResponse } from "node:http"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"

import type { Connect, Plugin } from "vite"

const execFileAsync = promisify(execFile)

const appDesktopRoot = path.dirname(fileURLToPath(import.meta.url))
const scriptPath = path.resolve(
  appDesktopRoot,
  "../.agent/scripts/validate_meridian.py",
)

function validateApiPathname(url: string | undefined): boolean {
  const pathname = url?.split("?")[0]?.replace(/\/$/, "") ?? ""
  return pathname === "/api/meridian/validate"
}

function parseValidateOutput(output: string) {
  const errors: string[] = []
  const warnings: string[] = []

  for (const line of output.split("\n")) {
    if (line.startsWith("ERROR: ")) {
      errors.push(line.slice(7).trim())
    }
    if (line.startsWith("WARN: ")) {
      warnings.push(line.slice(6).trim())
    }
  }

  const passed = output.includes("Meridian validation passed.")
  return { errors, warnings, passed }
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify(body))
}

async function handleValidateRequest(_req: IncomingMessage, res: ServerResponse) {
  try {
    const { stdout, stderr } = await execFileAsync(
      "python3",
      [scriptPath, appDesktopRoot],
      {
        cwd: appDesktopRoot,
        maxBuffer: 1024 * 1024,
      },
    )
    const output = [stdout, stderr].filter(Boolean).join("\n")
    const parsed = parseValidateOutput(output)
    sendJson(res, 200, {
      ok: parsed.passed && parsed.errors.length === 0,
      errors: parsed.errors,
      warnings: parsed.warnings,
      output,
      projectRoot: appDesktopRoot,
    })
  } catch (error) {
    const execError = error as NodeJS.ErrnoException & {
      stdout?: string
      stderr?: string
      code?: number | string
    }

    if (execError.code === "ENOENT") {
      sendJson(res, 503, {
        ok: false,
        pythonMissing: true,
        errors: [],
        warnings: [],
        output: "",
        message: "python3 not found. Install Python 3 and try again.",
      })
      return
    }

    const output = [execError.stdout, execError.stderr].filter(Boolean).join("\n")
    const parsed = parseValidateOutput(output)
    sendJson(res, parsed.passed ? 200 : 422, {
      ok: false,
      errors: parsed.errors,
      warnings: parsed.warnings,
      output,
      projectRoot: appDesktopRoot,
    })
  }
}

function createValidateMiddleware(): Connect.NextHandleFunction {
  return (req, res, next) => {
    if (!validateApiPathname(req.url) || req.method !== "POST") {
      next()
      return
    }

    void handleValidateRequest(req, res)
  }
}

export function meridianValidateApi(): Plugin {
  const attach = (server: { middlewares: Connect.Server }) => {
    server.middlewares.use(createValidateMiddleware())
  }

  return {
    name: "meridian-validate-api",
    enforce: "pre",
    configureServer: attach,
    configurePreviewServer: attach,
  }
}
