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
  const origin = typeof window !== "undefined" ? window.location.origin : "esta URL"
  return (
    `O servidor em ${origin} respondeu ${status} na rota de validação. ` +
    "Abra no navegador exatamente a URL que o terminal mostrou ao rodar " +
    "`cd app-desktop && pnpm dev` (se a porta 5173 estiver ocupada, o Vite usa outra, ex.: 5175)."
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
        message: payload.message ?? "Validação falhou.",
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
        `Não foi possível contactar ${origin}${endpoint}. ` +
        "Confirme `pnpm dev` em app-desktop/ e use a mesma URL do terminal (porta pode não ser 5173).",
    }
  }
}

export const validateScriptCommand = `python3 .agent/scripts/validate_meridian.py app-desktop`
