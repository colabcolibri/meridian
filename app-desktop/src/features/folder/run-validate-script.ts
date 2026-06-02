export interface ScriptValidationResult {
  ok: boolean
  errors: string[]
  warnings: string[]
  output: string
  projectRoot?: string
  pythonMissing?: boolean
  message?: string
}

function devServerMismatchMessage(status: number): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "this URL"
  return (
    `The server at ${origin} responded ${status} on the validation route. ` +
    "Open in the browser exactly the URL the terminal showed when running " +
    "`cd app-desktop && pnpm dev` (if port 5173 is busy, Vite uses another, e.g. 5175)."
  )
}

export async function runValidateMeridianScript(): Promise<ScriptValidationResult> {
  const endpoint = "/api/meridian/validate"

  try {
    const response = await fetch(endpoint, { method: "POST" })

    const contentType = response.headers.get("content-type") ?? ""
    if (!contentType.includes("application/json")) {
      const text = await response.text()
      const snippet = text.replace(/\s+/g, " ").slice(0, 120)
      return {
        ok: false,
        errors: [],
        warnings: [],
        output: snippet,
        message: devServerMismatchMessage(response.status),
      }
    }

    const payload = (await response.json()) as ScriptValidationResult

    if (!response.ok && !payload.pythonMissing) {
      return {
        ok: false,
        errors: payload.errors ?? [],
        warnings: payload.warnings ?? [],
        output: payload.output ?? "",
        message: payload.message ?? "Validation failed.",
      }
    }

    return payload
  } catch {
    const origin = typeof window !== "undefined" ? window.location.origin : "localhost"
    return {
      ok: false,
      errors: [],
      warnings: [],
      output: "",
      message:
        `Could not reach ${origin}${endpoint}. ` +
        "Confirm `pnpm dev` in app-desktop/ and use the same URL from the terminal (port may not be 5173).",
    }
  }
}

export const validateScriptCommand = `python3 .agent/scripts/validate_meridian.py app-desktop`
