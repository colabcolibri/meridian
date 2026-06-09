import { AlertCircle, FolderOpen, Github, Loader2, Sparkles, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { countIssuesBySeverity } from "@/domain/meridian/protocol-validators"
import { useProjectData } from "@/features/folder/ProjectDataContext"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"
import { OpenFolderDialog } from "@/features/folder/OpenFolderDialog"
import { MONITOR_CONTAINER } from "@/features/monitor/monitor-layout"
import { MONITOR_HEADER_TABS, type MonitorView } from "@/features/monitor/monitor-views"
import { MERIDIAN_GITHUB_URL, publicAssetUrl } from "@/lib/site-urls"
import { cn } from "@/lib/utils"

export function MonitorHeader({
  active,
  onChange,
  isTabDisabled,
}: {
  active: MonitorView
  onChange: (view: MonitorView) => void
  isTabDisabled?: (view: MonitorView) => boolean
}) {
  const {
    status,
    folder,
    error,
    isDemoActive,
    isDemoBuild,
    clearFolder,
    openFolder,
    openFolderFromPath,
    storedPath,
  } = useProjectFolder()
  const { issues } = useProjectData()
  const { errors, warnings } = countIssuesBySeverity(issues)
  const isOpening = status === "opening"
  const problemCount = errors + warnings
  const activeTab = MONITOR_HEADER_TABS.find((tab) => tab.id === active)

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-sm">
      {/* Top row: identity + actions */}
      <div
        className={cn(
          MONITOR_CONTAINER,
          "flex items-center justify-between gap-3 py-2",
        )}
      >
        {/* Left: logo + breadcrumb */}
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-meridian-muted ring-1 ring-meridian-border">
            <img
              alt=""
              className="h-4 w-4"
              height={16}
              src={publicAssetUrl("favicon.svg")}
              width={16}
            />
          </div>
          <div className="flex min-w-0 items-center gap-1.5 text-sm">
            <span className="shrink-0 text-muted-foreground">Meridian</span>
            {!folder ? (
              <Badge className="ml-0.5" variant="secondary">
                Experiment
              </Badge>
            ) : null}
            {folder ? (
              <>
                <span className="text-muted-foreground/50">/</span>
                <span className="truncate font-semibold text-foreground">
                  {folder.name}
                </span>
                {isDemoActive ? (
                  <Badge className="ml-1" variant="secondary">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Demo
                  </Badge>
                ) : null}
              </>
            ) : null}
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

        {/* Right: actions */}
        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            asChild
            className="hidden gap-1.5 sm:inline-flex"
            size="sm"
            variant="ghost"
          >
            <a href={MERIDIAN_GITHUB_URL} rel="noopener noreferrer" target="_blank">
              <Github className="h-4 w-4" aria-hidden />
              GitHub
            </a>
          </Button>
          <Button asChild className="sm:hidden" size="sm" variant="ghost">
            <a
              aria-label="Meridian on GitHub"
              href={MERIDIAN_GITHUB_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
          {isDemoBuild ? (
            !folder ? (
              <Button
                disabled={isOpening}
                onClick={() => openFolder()}
                size="sm"
                variant="default"
              >
                {isOpening ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FolderOpen className="mr-1.5 h-3.5 w-3.5" />
                )}
                Load demo
              </Button>
            ) : null
          ) : (
            <OpenFolderDialog
              initialPath={storedPath ?? ""}
              onSubmit={openFolderFromPath}
              disabled={isOpening}
            >
              <Button
                size="sm"
                variant={folder ? "outline" : "default"}
                disabled={isOpening}
              >
                {isOpening ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FolderOpen className="mr-1.5 h-3.5 w-3.5" />
                )}
                {folder ? "Change folder" : "Open docs folder"}
              </Button>
            </OpenFolderDialog>
          )}
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

      {/* Error banner */}
      {error ? (
        <div
          className={cn(
            MONITOR_CONTAINER,
            "flex items-start gap-2 border-t border-red-100 bg-red-50/80 py-1.5 text-sm text-red-900",
          )}
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      {/* Tab row */}
      <nav
        aria-label="Monitor views"
        className={cn(
          MONITOR_CONTAINER,
          "flex gap-0 overflow-x-auto border-t border-border/50",
        )}
      >
        {MONITOR_HEADER_TABS.map((tab) => {
          const disabled = isTabDisabled?.(tab.id) ?? false
          return (
            <button
              aria-current={active === tab.id ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-none border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                disabled && "pointer-events-none opacity-40",
                active === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground",
              )}
              disabled={disabled}
              key={tab.id}
              onClick={() => onChange(tab.id)}
              title={tab.hint}
              type="button"
            >
              {tab.label}
            </button>
          )
        })}
      </nav>
      {activeTab?.hint ? (
        <p className={cn(MONITOR_CONTAINER, "py-1.5 text-xs text-muted-foreground")}>
          {activeTab.hint}
        </p>
      ) : null}
    </header>
  )
}
