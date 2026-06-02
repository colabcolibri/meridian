import { useMemo, useState } from "react"

import { ChevronDown, FileText, Layers, PauseCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { Epic, ProductVersion, Sprint, UserStory } from "@/domain/meridian/types"
import {
  DeliverableDocSheet,
  type DeliverableSheetTarget,
} from "@/features/monitor/components/deliverable-doc-sheet"
import { useMonitorVersionFilter } from "@/features/monitor/MonitorVersionFilterContext"
import { ProgressBar } from "@/features/monitor/monitor-ui"
import { typeScale } from "@/features/monitor/monitor-typography"
import {
  countStoryProgress,
  epicsVisibleInVersions,
  groupEpicsByStatus,
  storiesForEpic,
  versionIdsForEpicInScope,
} from "@/features/monitor/version-filter"
import { cn } from "@/lib/utils"

function EpicBlock({
  epic,
  stories,
  sprints,
  versions,
  selectedVersionIds,
  expanded,
  onToggleExpanded,
  onOpenEpic,
  onOpenVersion,
  onOpenSprint,
}: {
  epic: Epic
  stories: UserStory[]
  sprints: Sprint[]
  versions: ProductVersion[]
  selectedVersionIds: ReadonlySet<string>
  expanded: boolean
  onToggleExpanded: () => void
  onOpenEpic: (epic: Epic, versionId: string) => void
  onOpenVersion: (version: ProductVersion) => void
  onOpenSprint: (sprint: Sprint) => void
}) {
  const epicStories = storiesForEpic(stories, epic.id, selectedVersionIds)
  const overall = countStoryProgress(epicStories)
  const versionIds = versionIdsForEpicInScope(epic, stories, selectedVersionIds)
  const notReadyCount = epicStories.filter(
    (story) => story.status === "❌" && story.ready !== true,
  ).length

  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card transition-colors",
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
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Layers className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <h2 className={typeScale.sectionTitle}>
                {epic.id} — {epic.title}
              </h2>
            </div>
            <p className={cn(typeScale.caption, "tabular-nums")}>
              {overall.done}/{overall.total} US · {overall.progress}% · {epic.status}
              {notReadyCount > 0 ? ` · ${notReadyCount} need /refine-us` : null}
            </p>
            <ProgressBar className="max-w-md" value={overall.progress} />
          </div>
        </button>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Badge variant={epic.status === "active" ? "default" : "outline"}>
            {epic.status === "paused" ? (
              <span className="inline-flex items-center gap-1">
                <PauseCircle className="h-3 w-3" />
                paused
              </span>
            ) : (
              epic.status
            )}
          </Badge>
          <button
            aria-label={`Open document ${epic.id}`}
            className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            onClick={(event) => {
              event.stopPropagation()
              onOpenEpic(epic, "—")
            }}
            type="button"
          >
            <FileText className="size-3.5" aria-hidden />
            Read epic
          </button>
        </div>
      </div>

      {expanded ? (
        <div className="space-y-1 px-2 py-2">
          <p className={cn(typeScale.label, "px-2 pb-1")}>By version (filtered)</p>
          {versionIds.length === 0 ? (
            <p className={cn(typeScale.caption, "px-2 py-2 text-muted-foreground")}>
              No stories in the selected versions for this epic.
            </p>
          ) : (
            versionIds.map((versionId) => {
              const version = versions.find((item) => item.id === versionId)
              const scoped = storiesForEpic(stories, epic.id, new Set([versionId]))
              const { done, total, progress } = countStoryProgress(scoped)
              const versionSprints = sprints.filter(
                (sprint) =>
                  sprint.versionId === versionId &&
                  sprint.storyIds.some((storyId) =>
                    scoped.some((story) => story.id === storyId),
                  ),
              )

              if (total === 0 && versionSprints.length === 0) {
                return null
              }

              return (
                <div
                  className="rounded-lg border border-border/60 bg-muted/10 px-2 py-2"
                  key={versionId}
                >
                  <div className="flex items-center justify-between gap-3 px-2 py-1.5">
                    <button
                      className="min-w-0 flex-1 rounded-md text-left hover:bg-muted/40"
                      onClick={() => {
                        if (version) {
                          onOpenVersion(version)
                        }
                      }}
                      type="button"
                    >
                      <p className="font-mono text-xs font-semibold text-primary">
                        {versionId}
                      </p>
                      <p className={cn(typeScale.bodySm, "truncate")}>
                        {version?.title ?? "Release"}
                      </p>
                    </button>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className={typeScale.caption}>
                        {done}/{total} · {progress}%
                      </span>
                      <button
                        className="rounded-md border border-border px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-muted/60"
                        onClick={() => onOpenEpic(epic, versionId)}
                        type="button"
                      >
                        Epic in {versionId}
                      </button>
                    </div>
                  </div>
                  {versionSprints.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2 px-2 pb-1">
                      {versionSprints.map((sprint) => (
                        <button
                          className="rounded-full border border-border bg-background px-3 py-1 text-left text-[11px] font-medium transition-colors hover:bg-muted/60"
                          key={sprint.id}
                          onClick={() => onOpenSprint(sprint)}
                          type="button"
                        >
                          <span className="font-mono">{sprint.id}</span>
                          <span className="text-muted-foreground">
                            {" "}
                            · {sprint.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })
          )}
          {epic.profiles.length > 0 ? (
            <div className="flex flex-wrap gap-2 px-2 pt-2">
              {epic.profiles.map((profile) => (
                <Badge key={profile} variant="secondary">
                  {profile}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

function EpicSection({
  title,
  epics,
  ...blockProps
}: {
  title: string
  epics: Epic[]
  stories: UserStory[]
  sprints: Sprint[]
  versions: ProductVersion[]
  selectedVersionIds: ReadonlySet<string>
  expandedEpicIds: Set<string>
  onToggleEpic: (epicId: string) => void
  onOpenEpic: (epic: Epic, versionId: string) => void
  onOpenVersion: (version: ProductVersion) => void
  onOpenSprint: (sprint: Sprint) => void
}) {
  if (epics.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <h3 className={typeScale.cardTitle}>{title}</h3>
      <div className="space-y-3">
        {epics.map((epic) => (
          <EpicBlock
            epic={epic}
            expanded={blockProps.expandedEpicIds.has(epic.id)}
            key={epic.id}
            onToggleExpanded={() => blockProps.onToggleEpic(epic.id)}
            {...blockProps}
          />
        ))}
      </div>
    </div>
  )
}

export function EpicDeliverablesPanel({
  epics,
  sprints,
  stories,
  versions,
}: {
  epics: Epic[]
  sprints: Sprint[]
  stories: UserStory[]
  versions: ProductVersion[]
}) {
  const { selectedVersionIds } = useMonitorVersionFilter()
  const [expandedEpicIds, setExpandedEpicIds] = useState<Set<string>>(() => new Set())
  const [sheetTarget, setSheetTarget] = useState<DeliverableSheetTarget | null>(null)

  const visibleEpics = useMemo(
    () => epicsVisibleInVersions(epics, stories, selectedVersionIds),
    [epics, selectedVersionIds, stories],
  )

  const grouped = useMemo(() => groupEpicsByStatus(visibleEpics), [visibleEpics])

  const toggleEpic = (epicId: string) => {
    setExpandedEpicIds((previous) => {
      const next = new Set(previous)

      if (next.has(epicId)) {
        next.delete(epicId)
        return next
      }

      next.add(epicId)
      return next
    })
  }

  if (selectedVersionIds.size === 0) {
    return (
      <p
        className={cn(
          typeScale.bodySm,
          "rounded-xl border border-dashed border-border px-4 py-8 text-center text-muted-foreground",
        )}
      >
        Select at least one version in the filter above to see epics and progress.
      </p>
    )
  }

  if (visibleEpics.length === 0) {
    return (
      <p
        className={cn(
          typeScale.bodySm,
          "rounded-xl border border-dashed border-border px-4 py-8 text-center text-muted-foreground",
        )}
      >
        No epics with stories in the selected versions.
      </p>
    )
  }

  const sectionProps = {
    stories,
    sprints,
    versions,
    selectedVersionIds,
    expandedEpicIds,
    onToggleEpic: toggleEpic,
    onOpenEpic: (epic: Epic, versionId: string) =>
      setSheetTarget({ kind: "epic", item: epic, versionId }),
    onOpenVersion: (version: ProductVersion) =>
      setSheetTarget({ kind: "version", item: version }),
    onOpenSprint: (sprint: Sprint) => setSheetTarget({ kind: "sprint", item: sprint }),
  }

  return (
    <>
      <div className="space-y-6">
        <EpicSection epics={grouped.active} title="Active epics" {...sectionProps} />
        <EpicSection
          epics={grouped.complete}
          title="Complete epics"
          {...sectionProps}
        />
        <EpicSection epics={grouped.paused} title="Paused epics" {...sectionProps} />
      </div>

      <DeliverableDocSheet
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
