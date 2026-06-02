import { AlertCircle, AlertTriangle, ChevronDown } from "lucide-react"
import { useState } from "react"

import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import { countIssuesBySeverity } from "@/domain/meridian/protocol-validators"
import { monitorPanelClass } from "@/features/monitor/monitor-ui"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

function IssueList({
  items,
  tone,
}: {
  items: MonitorIssue[]
  tone: "error" | "warning"
}) {
  if (items.length === 0) {
    return null
  }

  return (
    <ul
      className={cn(
        "space-y-2 text-xs",
        tone === "error" ? "text-destructive" : "text-amber-800 dark:text-amber-300",
      )}
    >
      {items.map((issue, index) => (
        <li
          className="leading-5 break-words"
          key={`${issue.file}-${issue.targetId ?? "—"}-${index}`}
        >
          <span className="font-mono text-[10px] opacity-80">{issue.file}</span>
          {" · "}
          <span className="font-medium">{issue.targetId ?? "—"}</span>
          {" — "}
          {issue.message}
        </li>
      ))}
    </ul>
  )
}

export function MonitorIssuesBanner({ issues }: { issues: MonitorIssue[] }) {
  const { errors, warnings } = countIssuesBySeverity(issues)
  const [open, setOpen] = useState(() => errors > 0)

  if (issues.length === 0) {
    return null
  }

  const errorsList = issues.filter((issue) => issue.severity === "error")
  const warningsList = issues.filter((issue) => issue.severity === "warning")

  return (
    <div className={cn(monitorPanelClass, "overflow-hidden")}>
      <button
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="font-medium text-foreground">
          {errors > 0 ? (
            <span className="inline-flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              {errors} issue{errors === 1 ? "" : "s"} to fix
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              {warnings} warning{warnings === 1 ? "" : "s"}
            </span>
          )}
          {errors > 0 && warnings > 0 ? (
            <span className="text-xs font-normal text-muted-foreground">
              + {warnings} warning{warnings === 1 ? "" : "s"}
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
        <div className="max-h-[min(50vh,420px)] overflow-y-auto overscroll-contain border-t border-border">
          <div className="space-y-4 px-4 py-3">
            {errorsList.length > 0 ? (
              <div className="space-y-2">
                <p className={cn(typeScale.label, "text-destructive")}>
                  Issues ({errorsList.length})
                </p>
                <IssueList items={errorsList} tone="error" />
              </div>
            ) : null}
            {warningsList.length > 0 ? (
              <div className="space-y-2">
                <p
                  className={cn(typeScale.label, "text-amber-800 dark:text-amber-300")}
                >
                  Warnings ({warningsList.length})
                </p>
                <IssueList items={warningsList} tone="warning" />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
