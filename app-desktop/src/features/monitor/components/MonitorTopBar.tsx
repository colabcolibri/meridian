import { AlertCircle, FolderOpen, Loader2, Sparkles, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { countIssuesBySeverity } from "@/domain/meridian/protocol-validators"
import { useProjectData } from "@/features/folder/ProjectDataContext"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"
import { MONITOR_CONTAINER } from "@/features/monitor/monitor-layout"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

export function MonitorTopBar() {
  const {
    status,
    folder,
    error,
    fsAccessSupported,
    isDemoActive,
    openFolder,
    clearFolder,
  } = useProjectFolder()
  const { issues } = useProjectData()
  const { errors, warnings } = countIssuesBySeverity(issues)
  const isOpening = status === "opening"
  const problemCount = errors + warnings

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-sm">
      <div
        className={cn(
          MONITOR_CONTAINER,
          "flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-meridian-muted ring-1 ring-meridian-border">
            <img alt="" className="h-6 w-6" height={24} src="/favicon.svg" width={24} />
          </div>
          <div className="min-w-0">
            <p className={typeScale.label}>Meridian</p>
            {folder ? (
              <p className={cn(typeScale.caption, "truncate")}>
                Project:{" "}
                <span className="font-medium text-foreground">{folder.name}</span>
                {isDemoActive ? (
                  <Badge className="ml-2 align-middle" variant="secondary">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Demo
                  </Badge>
                ) : null}
              </p>
            ) : (
              <p className={typeScale.caption}>No project open</p>
            )}
          </div>
          {folder && problemCount > 0 ? (
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                errors > 0 ? "bg-red-100 text-red-900" : "bg-amber-100 text-amber-900",
              )}
              title={`${errors} critical, ${warnings} warning(s)`}
            >
              {problemCount} alert{problemCount === 1 ? "" : "s"}
            </span>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            disabled={isOpening || !fsAccessSupported}
            onClick={() => void openFolder()}
            size="sm"
            variant={folder ? "outline" : "default"}
          >
            {isOpening ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FolderOpen className="mr-2 h-4 w-4" />
            )}
            {folder
              ? isDemoActive
                ? "Open local folder"
                : "Change folder"
              : "Open folder"}
          </Button>
          {folder ? (
            <Button
              aria-label="Close project"
              disabled={isOpening}
              onClick={() => void clearFolder()}
              size="sm"
              variant="ghost"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>

      {error ? (
        <div
          className={cn(
            MONITOR_CONTAINER,
            "flex items-start gap-2 border-t border-red-100 bg-red-50/80 py-2 text-sm text-red-900",
          )}
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}
    </header>
  )
}
