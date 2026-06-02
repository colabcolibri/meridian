import { execFile } from "node:child_process"
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

function createValidateMiddleware(): Connect.NextHandleFunction {
  return async (req, res, next) => {
    if (req.url !== "/api/meridian/validate" || req.method !== "POST") {
      next()
      return
    }

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
      res.setHeader("Content-Type", "application/json")
      res.end(
        JSON.stringify({
          ok: parsed.passed && parsed.errors.length === 0,
          errors: parsed.errors,
          warnings: parsed.warnings,
          output,
          projectRoot: appDesktopRoot,
        }),
      )
    } catch (error) {
      const execError = error as NodeJS.ErrnoException & {
        stdout?: string
        stderr?: string
        code?: number | string
      }

      if (execError.code === "ENOENT") {
        res.statusCode = 503
        res.setHeader("Content-Type", "application/json")
        res.end(
          JSON.stringify({
            ok: false,
            pythonMissing: true,
            errors: [],
            warnings: [],
            output: "",
            message: "python3 não encontrado. Instale Python 3 e tente novamente.",
          }),
        )
        return
      }

      const output = [execError.stdout, execError.stderr].filter(Boolean).join("\n")
      const parsed = parseValidateOutput(output)
      res.statusCode = parsed.passed ? 200 : 422
      res.setHeader("Content-Type", "application/json")
      res.end(
        JSON.stringify({
          ok: false,
          errors: parsed.errors,
          warnings: parsed.warnings,
          output,
          projectRoot: appDesktopRoot,
        }),
      )
    }
  }
}

export function meridianValidateApi(): Plugin {
  const attach = (server: { middlewares: Connect.Server }) => {
    server.middlewares.use(createValidateMiddleware())
  }

  return {
    name: "meridian-validate-api",
    configureServer: attach,
    configurePreviewServer: attach,
  }
}
