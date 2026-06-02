import { useState } from "react"

import { ClipboardCopy, Loader2, Terminal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  runValidateMeridianScript,
  validateScriptCommand,
  type ScriptValidationResult,
} from "@/features/folder/run-validate-script"

const isDev = import.meta.env.DEV

export function ScriptValidationPanel({ folderName }: { folderName?: string }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScriptValidationResult | null>(null)

  async function handleValidate() {
    setLoading(true)
    setResult(null)
    try {
      const payload = await runValidateMeridianScript()
      setResult(payload)
    } catch {
      setResult({
        ok: false,
        errors: [],
        warnings: [],
        output: "",
        message: "Não foi possível contactar o servidor de validação. Rode `pnpm dev`.",
      })
    } finally {
      setLoading(false)
    }
  }

  async function copyCommand() {
    await navigator.clipboard.writeText(validateScriptCommand)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Terminal className="h-4 w-4" />
          Validação Python (kit Meridian)
        </CardTitle>
        <CardDescription>
          Mesmo script que os agents usam:{" "}
          <code className="rounded bg-zinc-100 px-1">validate_meridian.py</code>. No
          browser, disponível em <strong>pnpm dev</strong> para a pasta{" "}
          <code className="rounded bg-zinc-100 px-1">app-desktop/</code> (projeto com
          subpasta <code className="rounded bg-zinc-100 px-1">docs/</code>),
          independente da pasta docs que você abriu no navegador.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {folderName && folderName !== "app-desktop" ? (
          <p className="text-xs text-amber-800">
            Pasta aberta: <strong>{folderName}</strong>. O script no dev valida sempre{" "}
            <code className="rounded bg-amber-100 px-1">app-desktop/</code> no disco
            (limitação do browser sem caminho absoluto).
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            disabled={!isDev || loading}
            onClick={() => void handleValidate()}
            size="sm"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Terminal className="mr-2 h-4 w-4" />
            )}
            Validar pasta
          </Button>
          <Button onClick={() => void copyCommand()} size="sm" variant="outline">
            <ClipboardCopy className="mr-2 h-4 w-4" />
            Copiar comando
          </Button>
        </div>

        {!isDev ? (
          <p className="text-xs text-zinc-600">
            Build de produção não executa Python. Use{" "}
            <code className="rounded bg-zinc-100 px-1">{validateScriptCommand}</code> no
            terminal na raiz do repositório.
          </p>
        ) : null}

        {result?.pythonMissing ? (
          <p className="text-sm text-red-800">
            {result.message} Veja pré-requisitos em{" "}
            <code className="rounded bg-red-100 px-1">10_environments.md</code>{" "}
            (adicione Python 3).
          </p>
        ) : null}

        {result && !result.pythonMissing ? (
          <div className="space-y-2 rounded-md border bg-zinc-50 p-3 text-sm">
            <div className="flex flex-wrap gap-2">
              <Badge
                className={
                  result.ok ? "bg-emerald-700 text-white" : "bg-red-700 text-white"
                }
              >
                {result.ok ? "passou" : "falhou"}
              </Badge>
              {result.errors.length > 0 ? (
                <Badge variant="outline">{result.errors.length} erros</Badge>
              ) : null}
              {result.warnings.length > 0 ? (
                <Badge variant="outline">{result.warnings.length} avisos</Badge>
              ) : null}
            </div>
            {result.errors.map((item) => (
              <p className="text-xs text-red-800" key={item}>
                ERROR: {item}
              </p>
            ))}
            {result.warnings.map((item) => (
              <p className="text-xs text-amber-800" key={item}>
                WARN: {item}
              </p>
            ))}
            {result.output ? (
              <pre className="max-h-40 overflow-auto rounded border bg-white p-2 font-mono text-xs text-zinc-700">
                {result.output.trim()}
              </pre>
            ) : null}
          </div>
        ) : null}

        {result?.message && !result.pythonMissing ? (
          <p className="text-sm text-red-800">{result.message}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
