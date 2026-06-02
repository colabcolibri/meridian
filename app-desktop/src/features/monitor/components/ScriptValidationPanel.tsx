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
          Technical validation (Python)
        </CardTitle>
        <CardDescription className={typeScale.caption}>
          Script <code className={inlineCodeClass}>validate_meridian.py</code> in{" "}
          <strong>pnpm dev</strong> — validates{" "}
          <code className={inlineCodeClass}>app-desktop/</code> on disk.
          {isDev ? (
            <>
              {" "}
              Use this URL in the browser:{" "}
              <code className={inlineCodeClass}>{window.location.origin}</code>
            </>
          ) : null}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-2 pb-2">
        {folderName && folderName !== "app-desktop" ? (
          <p className={cn(typeScale.caption, "text-amber-800 dark:text-amber-300")}>
            Open folder: <strong>{folderName}</strong>. The dev script always validates{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs dark:bg-amber-950/50">
              app-desktop/
            </code>{" "}
            on disk (browser limitation without absolute path).
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
            Validate folder
          </Button>
          <Button onClick={() => void copyCommand()} size="sm" variant="outline">
            <ClipboardCopy className="mr-2 h-4 w-4" />
            Copy command
          </Button>
        </div>

        {!isDev ? (
          <p className={typeScale.caption}>
            Production build does not run Python. Use{" "}
            <code className={inlineCodeClass}>{validateScriptCommand}</code> in the
            terminal at the repository root.
          </p>
        ) : null}

        {result?.pythonMissing ? (
          <p className="text-sm text-destructive">
            {result.message} See prerequisites in{" "}
            <code className="rounded bg-destructive/10 px-1.5 py-0.5 font-mono text-xs">
              08_environments.md
            </code>{" "}
            (add Python 3).
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
                {result.ok ? "passed" : "failed"}
              </Badge>
              {result.errors.length > 0 ? (
                <Badge variant="outline">{result.errors.length} errors</Badge>
              ) : null}
              {result.warnings.length > 0 ? (
                <Badge variant="outline">{result.warnings.length} warnings</Badge>
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
