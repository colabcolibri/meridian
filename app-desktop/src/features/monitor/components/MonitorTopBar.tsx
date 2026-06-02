import { AlertCircle, Blocks, FolderOpen, Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { countIssuesBySeverity } from "@/domain/meridian/protocol-validators"
import { useProjectData } from "@/features/folder/ProjectDataContext"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"
import { MONITOR_CONTAINER } from "@/features/monitor/monitor-layout"
import { cn } from "@/lib/utils"

export function MonitorTopBar() {
  const { status, folder, error, fsAccessSupported, openFolder, clearFolder } =
    useProjectFolder()
  const { issues } = useProjectData()
  const { errors, warnings } = countIssuesBySeverity(issues)
  const isOpening = status === "opening"
  const problemCount = errors + warnings

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/95 backdrop-blur-sm">
      <div
        className={cn(
          MONITOR_CONTAINER,
          "flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-700 text-white">
            <Blocks className="h-4 w-4" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-950">Meridian</p>
            {folder ? (
              <p className="truncate text-xs text-zinc-500">
                Projeto:{" "}
                <span className="font-medium text-zinc-700">{folder.name}</span>
              </p>
            ) : (
              <p className="text-xs text-zinc-500">Nenhum projeto aberto</p>
            )}
          </div>
          {folder && problemCount > 0 ? (
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                errors > 0 ? "bg-red-100 text-red-900" : "bg-amber-100 text-amber-900",
              )}
              title={`${errors} crítico(s), ${warnings} aviso(s)`}
            >
              {problemCount} alerta{problemCount === 1 ? "" : "s"}
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
            {folder ? "Trocar pasta" : "Abrir pasta"}
          </Button>
          {folder ? (
            <Button
              aria-label="Fechar projeto"
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
