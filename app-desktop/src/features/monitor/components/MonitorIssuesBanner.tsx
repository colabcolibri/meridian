import { AlertCircle, AlertTriangle, ChevronDown } from "lucide-react"
import { useState } from "react"

import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import { countIssuesBySeverity } from "@/domain/meridian/protocol-validators"
import { monitorPanelClass } from "@/features/monitor/monitor-ui"
import { cn } from "@/lib/utils"

export function MonitorIssuesBanner({ issues }: { issues: MonitorIssue[] }) {
  const { errors, warnings } = countIssuesBySeverity(issues)
  const [open, setOpen] = useState(() => errors > 0)

  if (issues.length === 0) {
    return null
  }

  const errorsList = issues.filter((issue) => issue.severity === "error")
  const warningsList = issues.filter((issue) => issue.severity === "warning")

  return (
    <div className={monitorPanelClass}>
      <button
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="font-medium text-foreground">
          {errors > 0 ? (
            <span className="inline-flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              {errors} problema{errors === 1 ? "" : "s"} a corrigir
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              {warnings} aviso{warnings === 1 ? "" : "s"}
            </span>
          )}
          {errors > 0 && warnings > 0 ? (
            <span className="text-xs font-normal text-muted-foreground">
              + {warnings} aviso{warnings === 1 ? "" : "s"}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className="space-y-3 border-t border-border px-4 py-3">
          {errorsList.length > 0 ? (
            <ul className="space-y-2 text-xs text-destructive">
              {errorsList.slice(0, 8).map((issue) => (
                <li className="leading-5" key={`${issue.file}-${issue.message}`}>
                  <span className="font-mono text-[10px] opacity-80">{issue.file}</span>
                  {" · "}
                  <span className="font-medium">{issue.targetId ?? "—"}</span>
                  {" — "}
                  {issue.message}
                </li>
              ))}
            </ul>
          ) : null}
          {warningsList.length > 0 ? (
            <ul className="space-y-2 text-xs text-amber-800 dark:text-amber-300">
              {warningsList.slice(0, 6).map((issue) => (
                <li className="leading-5" key={`${issue.file}-${issue.message}`}>
                  <span className="font-mono text-[10px] opacity-80">{issue.file}</span>
                  {" · "}
                  <span className="font-medium">{issue.targetId ?? "—"}</span>
                  {" — "}
                  {issue.message}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
