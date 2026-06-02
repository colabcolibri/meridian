import { AlertCircle, AlertTriangle } from "lucide-react"

import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import { countIssuesBySeverity } from "@/domain/meridian/protocol-validators"

export function MonitorIssuesBanner({ issues }: { issues: MonitorIssue[] }) {
  if (issues.length === 0) {
    return null
  }

  const { errors, warnings } = countIssuesBySeverity(issues)
  const errorsList = issues.filter((issue) => issue.severity === "error")
  const warningsList = issues.filter((issue) => issue.severity === "warning")

  return (
    <div className="space-y-3">
      {errors > 0 ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-950">
          <div className="mb-2 flex items-center gap-2 font-medium">
            <AlertCircle className="h-4 w-4" />
            {errors} problema{errors === 1 ? "" : "s"} crítico{errors === 1 ? "" : "s"}
          </div>
          <ul className="list-inside list-disc space-y-1 text-xs">
            {errorsList.slice(0, 8).map((issue) => (
              <li key={`${issue.file}-${issue.message}`}>
                <span className="font-mono">{issue.file}</span>
                {issue.targetId ? ` (${issue.targetId})` : null} — {issue.message}
              </li>
            ))}
          </ul>
          {errorsList.length > 8 ? (
            <p className="mt-2 text-xs">+ {errorsList.length - 8} outros</p>
          ) : null}
        </div>
      ) : null}

      {warnings > 0 ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <div className="mb-2 flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4" />
            {warnings} aviso{warnings === 1 ? "" : "s"}
          </div>
          <ul className="list-inside list-disc space-y-1 text-xs">
            {warningsList.slice(0, 6).map((issue) => (
              <li key={`${issue.file}-${issue.message}`}>
                <span className="font-mono">{issue.file}</span>
                {issue.targetId ? ` (${issue.targetId})` : null} — {issue.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
