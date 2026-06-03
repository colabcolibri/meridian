import { useEffect, useMemo, useState } from "react"

import { ChevronDown, FileText, GitBranch } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import type { Epic, ProductVersion, Sprint, UserStory } from "@/domain/meridian/types"
import { countStoriesByEpic } from "@/domain/meridian/validators"
import {
  DeliverableDocSheet,
  type DeliverableSheetTarget,
} from "@/features/monitor/components/deliverable-doc-sheet"
import { EpicDeliverablesPanel } from "@/features/monitor/components/EpicDeliverablesPanel"
import { VersionFilterBar } from "@/features/monitor/components/VersionFilterBar"
import { useMonitorVersionFilter } from "@/features/monitor/MonitorVersionFilterContext"
import { filterChipClass } from "@/features/monitor/monitor-ui"
import { typeScale } from "@/features/monitor/monitor-typography"
import {
  countStoryProgress,
  epicsForVersionFilter,
  sortVersionsDesc,
} from "@/features/monitor/version-filter"
import { cn } from "@/lib/utils"

type DeliverablesLayout = "epic" | "version"

function VersionBlock({
  version,
  epics,
  sprints,
  stories,
  expanded,
  onToggleExpanded,
  onOpenVersion,
  onOpenSprint,
  onOpenEpic,
}: {
  version: ProductVersion
  epics: Epic[]
  stories: UserStory[]
  sprints: Sprint[]
  expanded: boolean
  onToggleExpanded: () => void
  onOpenVersion: (version: ProductVersion) => void
  onOpenSprint: (sprint: Sprint) => void
  onOpenEpic: (epic: Epic, versionId: string) => void
}) {
  const { done, total, progress } = countStoryProgress(
    stories.filter((story) => story.version === version.id),
  )
  const versionSprints = sprints.filter((sprint) => sprint.versionId === version.id)
  const versionEpics = epicsForVersionFilter(epics, stories, new Set([version.id]))

  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border bg-card transition-colors",
        version.status === "planned"
          ? "border-dashed border-border/60 opacity-70"
          : "border-border",
        !expanded && "bg-muted/20",
      )}
    >
      <div
        className={cn(
          "flex items-start justify-between gap-3 px-4 py-3",
          expanded && "border-b border-border/80",
        )}
      >
        <button
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 items-start gap-2 text-left transition-colors hover:opacity-90"
          onClick={onToggleExpanded}
          type="button"
        >
          <ChevronDown
            aria-hidden
            className={cn(
              "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              expanded ? "rotate-0" : "-rotate-90",
            )}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <GitBranch className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <h2 className={typeScale.sectionTitle}>
                {version.id} — {version.title}
              </h2>
            </div>
            {total > 0 ? (
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      progress === 100 ? "bg-meridian-success" : "bg-meridian",
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className={cn(typeScale.caption, "shrink-0 tabular-nums")}>
                  {done}/{total}
                </span>
              </div>
            ) : null}
          </div>
        </button>
        <div className="flex shrink-0 items-center gap-2">
          <Badge variant={version.status === "planned" ? "outline" : "secondary"}>
            {version.status}
          </Badge>
          <button
            aria-label={`Open document ${version.id}`}
            className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            onClick={(event) => {
              event.stopPropagation()
              onOpenVersion(version)
            }}
            type="button"
          >
            <FileText className="size-3.5" aria-hidden />
            Read doc
          </button>
        </div>
      </div>

      {expanded && versionSprints.length > 0 ? (
        <div className="border-b border-border/60 px-4 py-3">
          <p className={cn(typeScale.label, "mb-2")}>Sprints</p>
          <div className="flex flex-wrap gap-2">
            {versionSprints.map((sprint) => (
              <button
                className={cn(
                  "rounded-full border px-3 py-1.5 text-left text-xs font-medium transition-colors",
                  sprint.status === "complete"
                    ? "border-meridian-success/40 bg-meridian-success-muted text-meridian-success-foreground hover:bg-meridian-success-muted/80"
                    : sprint.status === "active"
                      ? "border-meridian-border bg-meridian-muted text-meridian hover:bg-meridian-muted/80"
                      : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/60",
                )}
                key={sprint.id}
                onClick={() => onOpenSprint(sprint)}
                type="button"
              >
                <span className="font-mono">{sprint.id}</span>
                <span className="opacity-70"> · {sprint.status}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {expanded && versionEpics.length > 0 ? (
        <div className="px-2 py-2">
          <p className={cn(typeScale.label, "px-2 pb-1")}>Epics</p>
          {versionEpics.map((epic) => {
            const scoped = stories.filter(
              (story) => story.epic === epic.id && story.version === version.id,
            )
            const {
              done: epicDone,
              total: epicTotal,
              progress: epicProgressPct,
            } = countStoryProgress(scoped)

            if (epicTotal === 0) {
              return null
            }

            return (
              <button
                className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-muted/40"
                key={epic.id}
                onClick={() => onOpenEpic(epic, version.id)}
                type="button"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs font-semibold text-primary">
                    {epic.id}
                  </p>
                  <p className={cn(typeScale.bodySm, "truncate text-foreground")}>
                    {epic.title}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        epicProgressPct === 100 ? "bg-meridian-success" : "bg-meridian",
                      )}
                      style={{ width: `${epicProgressPct}%` }}
                    />
                  </div>
                  <span
                    className={cn(typeScale.caption, "w-16 text-right tabular-nums")}
                  >
                    {epicDone}/{epicTotal}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}

function VersionDeliverablesPanel({
  versions,
  epics,
  sprints,
  stories,
  issues,
}: {
  versions: ProductVersion[]
  epics: Epic[]
  sprints: Sprint[]
  stories: UserStory[]
  issues: MonitorIssue[]
}) {
  const { selectedVersionIds } = useMonitorVersionFilter()
  const [expandedVersionIds, setExpandedVersionIds] = useState<Set<string>>(
    () => new Set(selectedVersionIds),
  )
  const [sheetTarget, setSheetTarget] = useState<DeliverableSheetTarget | null>(null)

  const filteredVersions = useMemo(
    () =>
      sortVersionsDesc(versions).filter((version) =>
        selectedVersionIds.has(version.id),
      ),
    [selectedVersionIds, versions],
  )

  useEffect(() => {
    setExpandedVersionIds((previous) => {
      const pruned = new Set(
        [...previous].filter((versionId) => selectedVersionIds.has(versionId)),
      )

      if (pruned.size > 0) {
        return pruned
      }

      return new Set(selectedVersionIds)
    })
  }, [selectedVersionIds])

  const orphans = epics.filter((epic) => {
    const { total } = countStoriesByEpic(stories, epic.id)
    return (
      total > 0 &&
      !filteredVersions.some((version) =>
        stories.some((story) => story.epic === epic.id && story.version === version.id),
      )
    )
  })

  if (selectedVersionIds.size === 0) {
    return (
      <p
        className={cn(
          typeScale.bodySm,
          "rounded-xl border border-dashed border-border px-4 py-8 text-center text-muted-foreground",
        )}
      >
        Select at least one version in the filter above.
      </p>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {filteredVersions.map((version) => (
          <VersionBlock
            epics={epics}
            expanded={expandedVersionIds.has(version.id)}
            key={version.id}
            onOpenEpic={(epic, versionId) =>
              setSheetTarget({ kind: "epic", item: epic, versionId })
            }
            onOpenSprint={(sprint) => setSheetTarget({ kind: "sprint", item: sprint })}
            onOpenVersion={(item) => setSheetTarget({ kind: "version", item })}
            onToggleExpanded={() => {
              setExpandedVersionIds((previous) => {
                const next = new Set(previous)
                if (next.has(version.id)) {
                  next.delete(version.id)
                } else {
                  next.add(version.id)
                }
                return next
              })
            }}
            sprints={sprints}
            stories={stories}
            version={version}
          />
        ))}

        {orphans.length > 0 ? (
          <section className="rounded-xl border border-border bg-card px-2 py-2">
            <p className={cn(typeScale.label, "px-2 py-2")}>
              Epics outside selected versions
            </p>
            {orphans.map((epic) => {
              const { total, done } = countStoriesByEpic(stories, epic.id)

              return (
                <button
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-muted/40"
                  key={epic.id}
                  onClick={() =>
                    setSheetTarget({ kind: "epic", item: epic, versionId: "—" })
                  }
                  type="button"
                >
                  <div>
                    <p className="font-mono text-xs font-semibold text-primary">
                      {epic.id}
                    </p>
                    <p className={typeScale.bodySm}>{epic.title}</p>
                  </div>
                  <span className={typeScale.caption}>
                    {done}/{total} US
                  </span>
                </button>
              )
            })}
          </section>
        ) : null}
      </div>

      <DeliverableDocSheet
        epics={epics}
        issues={issues}
        onOpenChange={(open) => {
          if (!open) {
            setSheetTarget(null)
          }
        }}
        open={sheetTarget !== null}
        stories={stories}
        target={sheetTarget}
      />
    </>
  )
}

export function DeliverablesView({
  versions,
  epics,
  sprints,
  stories,
  issues,
}: {
  versions: ProductVersion[]
  epics: Epic[]
  sprints: Sprint[]
  stories: UserStory[]
  issues: MonitorIssue[]
}) {
  const [layout, setLayout] = useState<DeliverablesLayout>("epic")

  return (
    <div className="space-y-5">
      <div className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h2 className={typeScale.sectionTitle}>Deliverables</h2>
            <p className={typeScale.bodySm}>
              Product capabilities from{" "}
              <code className="font-mono text-xs">docs/epics/</code>, filtered by
              release. Default view is by epic — switch to by version for release
              planning.
            </p>
          </div>
          <div
            aria-label="Deliverables layout"
            className="flex shrink-0 flex-wrap gap-2"
            role="group"
          >
            <button
              aria-pressed={layout === "epic"}
              className={filterChipClass(layout === "epic")}
              onClick={() => setLayout("epic")}
              type="button"
            >
              By epic
            </button>
            <button
              aria-pressed={layout === "version"}
              className={filterChipClass(layout === "version")}
              onClick={() => setLayout("version")}
              type="button"
            >
              By version
            </button>
          </div>
        </div>
        <VersionFilterBar contextLabel="deliverables" versions={versions} />
      </div>

      {layout === "epic" ? (
        <EpicDeliverablesPanel
          epics={epics}
          issues={issues}
          sprints={sprints}
          stories={stories}
          versions={versions}
        />
      ) : (
        <VersionDeliverablesPanel
          epics={epics}
          issues={issues}
          sprints={sprints}
          stories={stories}
          versions={versions}
        />
      )}
    </div>
  )
}
