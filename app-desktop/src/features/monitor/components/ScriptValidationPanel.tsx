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
import { inlineCodeClass, monitorPanelClass } from "@/features/monitor/monitor-ui"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

const isDev = import.meta.env.DEV

export function ScriptValidationPanel({ folderName }: { folderName?: string }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScriptValidationResult | null>(null)

  async function handleValidate() {
    setLoading(true)
    setResult(null)
    const payload = await runValidateMeridianScript()
    setResult(payload)
    setLoading(false)
  }

  async function copyCommand() {
    await navigator.clipboard.writeText(validateScriptCommand)
  }

  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="px-2 pt-0">
        <CardTitle className={cn(typeScale.label, "flex items-center gap-2")}>
          <Terminal className="h-4 w-4" />
          Validação técnica (Python)
        </CardTitle>
        <CardDescription className={typeScale.caption}>
          Script <code className={inlineCodeClass}>validate_meridian.py</code> em{" "}
          <strong>pnpm dev</strong> — valida{" "}
          <code className={inlineCodeClass}>app-desktop/</code> no disco.
          {isDev ? (
            <>
              {" "}
              Use esta URL no navegador:{" "}
              <code className={inlineCodeClass}>{window.location.origin}</code>
            </>
          ) : null}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-2 pb-2">
        {folderName && folderName !== "app-desktop" ? (
          <p className={cn(typeScale.caption, "text-amber-800 dark:text-amber-300")}>
            Pasta aberta: <strong>{folderName}</strong>. O script no dev valida sempre{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs dark:bg-amber-950/50">
              app-desktop/
            </code>{" "}
            no disco (limitação do browser sem caminho absoluto).
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
          <p className={typeScale.caption}>
            Build de produção não executa Python. Use{" "}
            <code className={inlineCodeClass}>{validateScriptCommand}</code> no terminal
            na raiz do repositório.
          </p>
        ) : null}

        {result?.pythonMissing ? (
          <p className="text-sm text-destructive">
            {result.message} Veja pré-requisitos em{" "}
            <code className="rounded bg-destructive/10 px-1.5 py-0.5 font-mono text-xs">
              10_environments.md
            </code>{" "}
            (adicione Python 3).
          </p>
        ) : null}

        {result && !result.pythonMissing ? (
          <div className={cn(monitorPanelClass, "space-y-2 p-3 text-sm shadow-none")}>
            <div className="flex flex-wrap gap-2">
              <Badge
                className={
                  result.ok
                    ? "bg-meridian-success text-white"
                    : "bg-destructive text-white"
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
              <p className="text-xs text-destructive" key={item}>
                ERROR: {item}
              </p>
            ))}
            {result.warnings.map((item) => (
              <p className="text-xs text-amber-800 dark:text-amber-300" key={item}>
                WARN: {item}
              </p>
            ))}
            {result.output ? (
              <pre className="max-h-40 overflow-auto rounded-md border border-border bg-muted/40 p-2 font-mono text-xs text-foreground">
                {result.output.trim()}
              </pre>
            ) : null}
          </div>
        ) : null}

        {result?.message && !result.pythonMissing && !result.ok ? (
          <p className="text-sm text-destructive" role="alert">
            {result.message}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
