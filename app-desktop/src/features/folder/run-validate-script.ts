export interface ScriptValidationResult {
  ok: boolean
  errors: string[]
  warnings: string[]
  output: string
  projectRoot?: string
  pythonMissing?: boolean
  message?: string
}

export async function runValidateMeridianScript(): Promise<ScriptValidationResult> {
  const response = await fetch("/api/meridian/validate", { method: "POST" })

  const payload = (await response.json()) as ScriptValidationResult

  if (!response.ok && !payload.pythonMissing) {
    return {
      ok: false,
      errors: payload.errors ?? [],
      warnings: payload.warnings ?? [],
      output: payload.output ?? "",
      message: payload.message ?? "Validação falhou.",
    }
  }

  return payload
}

export const validateScriptCommand = `python3 .agent/scripts/validate_meridian.py app-desktop`
