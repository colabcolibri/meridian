import { AlertCircle, FolderOpen, Loader2, Sparkles, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { countIssuesBySeverity } from "@/domain/meridian/protocol-validators"
import { useProjectData } from "@/features/folder/ProjectDataContext"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"
import { OpenFolderButton } from "@/features/monitor/components/OpenFolderButton"
import { MONITOR_CONTAINER } from "@/features/monitor/monitor-layout"
import { typeScale } from "@/features/monitor/monitor-typography"
import { publicAssetUrl } from "@/lib/site-urls"
import { cn } from "@/lib/utils"

export function MonitorTopBar() {
  const { status, folder, error, isDemoActive, clearFolder } = useProjectFolder()
  const { issues } = useProjectData()
  const { errors, warnings } = countIssuesBySeverity(issues)
  const isOpening = status === "opening"
  const problemCount = errors + warnings

  return (
    <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-sm">
      {/* Identity + actions row */}
      <div
        className={cn(
          MONITOR_CONTAINER,
          "flex items-center justify-between gap-3 py-2.5",
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-meridian-muted ring-1 ring-meridian-border">
            <img
              alt=""
              className="h-5 w-5"
              height={20}
              src={publicAssetUrl("favicon.svg")}
              width={20}
            />
          </div>
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="text-xs text-muted-foreground shrink-0">Meridian</span>
            {folder ? (
              <>
                <span className="text-muted-foreground text-xs">/</span>
                <span className={cn(typeScale.label, "truncate font-semibold")}>
                  {folder.name}
                </span>
                {isDemoActive ? (
                  <Badge className="ml-1" variant="secondary">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Demo
                  </Badge>
                ) : null}
              </>
            ) : (
              <span className={typeScale.caption}>No project open</span>
            )}
          </div>
          {folder && problemCount > 0 ? (
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                errors > 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700",
              )}
              title={`${errors} error(s), ${warnings} warning(s)`}
            >
              {problemCount} alert{problemCount === 1 ? "" : "s"}
            </span>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <OpenFolderButton size="sm" variant={folder ? "outline" : "default"}>
            {isOpening ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : (
              <FolderOpen className="mr-2 h-3.5 w-3.5" />
            )}
            {folder
              ? isDemoActive
                ? "Open local folder"
                : "Change folder"
              : "Open folder"}
          </OpenFolderButton>
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
    </div>
  )
}
