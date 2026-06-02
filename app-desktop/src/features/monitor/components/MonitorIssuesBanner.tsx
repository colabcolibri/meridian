import { AlertCircle, AlertTriangle, ChevronDown } from "lucide-react"
import { useState } from "react"

import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import { countIssuesBySeverity } from "@/domain/meridian/protocol-validators"
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
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
      <button
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="font-medium text-zinc-900">
          {errors > 0 ? (
            <span className="inline-flex items-center gap-2 text-red-900">
              <AlertCircle className="h-4 w-4" />
              {errors} problema{errors === 1 ? "" : "s"} a corrigir
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 text-amber-900">
              <AlertTriangle className="h-4 w-4" />
              {warnings} aviso{warnings === 1 ? "" : "s"}
            </span>
          )}
          {errors > 0 && warnings > 0 ? (
            <span className="text-xs font-normal text-zinc-500">
              + {warnings} aviso{warnings === 1 ? "" : "s"}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-zinc-500 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className="space-y-3 border-t border-zinc-100 px-4 py-3">
          {errorsList.length > 0 ? (
            <ul className="space-y-2 text-xs text-red-950">
              {errorsList.slice(0, 8).map((issue) => (
                <li className="leading-5" key={`${issue.file}-${issue.message}`}>
                  <span className="font-mono text-[10px] text-red-800/80">
                    {issue.file}
                  </span>
                  {" · "}
                  <span className="font-medium">{issue.targetId ?? "—"}</span>
                  {" — "}
                  {issue.message}
                </li>
              ))}
            </ul>
          ) : null}
          {warningsList.length > 0 ? (
            <ul className="space-y-2 text-xs text-amber-950">
              {warningsList.slice(0, 6).map((issue) => (
                <li className="leading-5" key={`${issue.file}-${issue.message}`}>
                  <span className="font-mono text-[10px] text-amber-900/80">
                    {issue.file}
                  </span>
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
