import { AlertCircle, AlertTriangle, ChevronDown } from "lucide-react"
import { useMemo, useState } from "react"

import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import { countIssuesBySeverity } from "@/domain/meridian/protocol-validators"
import { monitorPanelClass } from "@/features/monitor/monitor-ui"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

const SCOPE_LABELS: Record<MonitorIssue["scope"], string> = {
  parse: "Parse",
  doc: "Documents",
  us: "User stories",
  board: "Board",
}

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

function groupedIssues(issues: MonitorIssue[]) {
  const groups = new Map<MonitorIssue["scope"], MonitorIssue[]>()

  for (const issue of issues) {
    const bucket = groups.get(issue.scope) ?? []
    bucket.push(issue)
    groups.set(issue.scope, bucket)
  }

  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
}

export function MonitorIssuesBanner({ issues }: { issues: MonitorIssue[] }) {
  const { errors, warnings } = countIssuesBySeverity(issues)
  const [open, setOpen] = useState(false)

  const errorsList = useMemo(
    () => issues.filter((issue) => issue.severity === "error"),
    [issues],
  )
  const warningsList = useMemo(
    () => issues.filter((issue) => issue.severity === "warning"),
    [issues],
  )

  if (issues.length === 0) {
    return null
  }

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
              <div className="space-y-3">
                <p className={cn(typeScale.label, "text-destructive")}>
                  Issues ({errorsList.length})
                </p>
                {groupedIssues(errorsList).map(([scope, scopeIssues]) => (
                  <div className="space-y-2" key={`error-${scope}`}>
                    <p className="text-[10px] font-semibold tracking-wide text-destructive/80 uppercase">
                      {SCOPE_LABELS[scope]}
                    </p>
                    <IssueList items={scopeIssues} tone="error" />
                  </div>
                ))}
              </div>
            ) : null}
            {warningsList.length > 0 ? (
              <div className="space-y-3">
                <p
                  className={cn(typeScale.label, "text-amber-800 dark:text-amber-300")}
                >
                  Warnings ({warningsList.length})
                </p>
                {groupedIssues(warningsList).map(([scope, scopeIssues]) => (
                  <div className="space-y-2" key={`warn-${scope}`}>
                    <p className="text-[10px] font-semibold tracking-wide text-amber-800/80 uppercase dark:text-amber-300/80">
                      {SCOPE_LABELS[scope]}
                    </p>
                    <IssueList items={scopeIssues} tone="warning" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
