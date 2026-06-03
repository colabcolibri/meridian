import React, { useEffect, useMemo, useState } from "react"

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleX,
  FlaskConical,
  Info,
  Layers,
  LayoutGrid,
  Snowflake,
} from "lucide-react"
import { Popover } from "radix-ui"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import type { KanbanColumnId } from "@/domain/meridian/kanban-columns"
import {
  countFrozenStories,
  frozenCountByVersion,
  groupStoriesForKanban,
  visibleKanbanColumns,
} from "@/domain/meridian/kanban-columns"
import { type StoryDocumentationBadge } from "@/domain/meridian/story-body"
import type { Epic, ProductVersion, UserStory } from "@/domain/meridian/types"
import { issuesForTarget } from "@/domain/meridian/protocol-validators"
import { useMonitorVersionFilter } from "@/features/monitor/MonitorVersionFilterContext"
import { StoryDetailSheet } from "@/features/monitor/components/StoryDetailSheet"
import { VersionFilterBar } from "@/features/monitor/components/VersionFilterBar"
import { filterChipClass } from "@/features/monitor/monitor-ui"
import { typeScale } from "@/features/monitor/monitor-typography"
import {
  countStoryProgress,
  epicsForVersionFilter,
  filterStoriesByVersions,
  sortVersionIdsDesc,
} from "@/features/monitor/version-filter"
import { cn } from "@/lib/utils"

type BoardLayout = "columns" | "byEpic"

const columnMeta: Record<
  KanbanColumnId,
  {
    title: string
    description: string
    emptyHint: string
    icon: React.ElementType
    iconClass: string
  }
> = {
  "❌": {
    title: "Pending",
    description: "Status ❌ in frontmatter — not started or not complete.",
    emptyHint: "No pending stories — all work is in progress or done.",
    icon: CircleX,
    iconClass: "text-muted-foreground",
  },
  "🔶": {
    title: "In progress",
    description:
      'Status 🔶 — partially done; Acceptance must include "Missing:" explaining what is left.',
    emptyHint: "No stories in progress right now.",
    icon: AlertTriangle,
    iconClass: "text-amber-500",
  },
  "🧪": {
    title: "Awaiting tests",
    description:
      "Derived column: status ✅ in frontmatter, but tests_status still pending.",
    emptyHint: "No stories awaiting test verification.",
    icon: FlaskConical,
    iconClass: "text-blue-500",
  },
  "✅": {
    title: "Complete",
    description: "Status ✅ with acceptance criteria and tests verified in the files.",
    emptyHint: "No completed stories yet — keep going.",
    icon: CheckCircle2,
    iconClass: "text-meridian-success",
  },
  "🧊": {
    title: "Frozen",
    description: "Status 🧊 — paused on purpose; not in the flow now.",
    emptyHint: "No frozen stories in this view.",
    icon: Snowflake,
    iconClass: "text-sky-400",
  },
}

const kanbanGridColsClass: Record<number, string> = {
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
}

function KanbanColumnHeader({
  columnId,
  count,
}: {
  columnId: KanbanColumnId
  count: number
}) {
  const meta = columnMeta[columnId]
  const Icon = meta.icon

  return (
    <header className="shrink-0 border-b border-border/80 bg-muted/40 px-3 py-3">
      <div className="flex items-center gap-1.5">
        <h2 className="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold text-foreground">
          <Icon aria-hidden className={cn("size-4 shrink-0", meta.iconClass)} />
          <span className="truncate">{meta.title}</span>
        </h2>
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button
              aria-label={`About the ${meta.title} column`}
              className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <Info aria-hidden className="size-3.5" />
            </Button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              align="start"
              className={cn(
                "z-50 w-[min(280px,calc(100vw-2rem))] rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md",
                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
              )}
              side="bottom"
              sideOffset={6}
            >
              <p className={typeScale.label}>{meta.title}</p>
              <p className={cn(typeScale.bodySm, "mt-1.5 text-muted-foreground")}>
                {meta.description}
              </p>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
      <p className={cn(typeScale.caption, "mt-1 text-muted-foreground")}>{count} US</p>
    </header>
  )
}

function EmptyColumnState({ columnId }: { columnId: KanbanColumnId }) {
  const meta = columnMeta[columnId]
  const Icon = meta.icon
  return (
    <div className="flex flex-col items-center gap-2 px-2 py-10 text-center">
      <Icon aria-hidden className={cn("size-5 opacity-30", meta.iconClass)} />
      <p className={cn(typeScale.caption, "text-muted-foreground/60")}>
        {meta.emptyHint}
      </p>
    </div>
  )
}

function KanbanColumnsGrid({
  stories,
  issues,
  documentationBadges,
  epicById,
  showVersion,
  showFrozen,
  onSelectStory,
}: {
  stories: UserStory[]
  issues: MonitorIssue[]
  documentationBadges: ReadonlyMap<string, StoryDocumentationBadge | null>
  epicById: Record<string, Epic>
  showVersion: boolean
  showFrozen: boolean
  onSelectStory: (story: UserStory) => void
}) {
  const allColumns = useMemo(() => groupStoriesForKanban(stories), [stories])
  const frozenCount = useMemo(() => countFrozenStories(stories), [stories])
  const visibleColumns = useMemo(
    () => visibleKanbanColumns(allColumns, { showFrozen }),
    [allColumns, showFrozen],
  )
  const gridColumnCount = showFrozen && frozenCount > 0 ? 5 : 4

  return (
    <div
      className={cn(
        "-mx-px flex overflow-x-auto lg:grid lg:overflow-visible",
        kanbanGridColsClass[gridColumnCount],
      )}
    >
      {visibleColumns.map(({ columnId, stories: columnStories }) => (
        <section
          className={cn(
            "flex w-[min(300px,88vw)] shrink-0 flex-col border-r border-border/80 last:border-r-0 lg:w-auto",
            columnStories.length === 0 ? "min-h-[180px]" : "min-h-[260px]",
          )}
          key={columnId}
        >
          <KanbanColumnHeader columnId={columnId} count={columnStories.length} />
          <ScrollArea className="min-h-0 flex-1 lg:max-h-[min(70vh,680px)]">
            <div className="flex flex-col gap-3 p-3">
              {columnStories.length === 0 ? (
                <EmptyColumnState columnId={columnId} />
              ) : (
                columnStories.map((story) => (
                  <KanbanStoryCard
                    documentationBadge={documentationBadges.get(story.id) ?? null}
                    epicTitle={epicById[story.epic]?.title}
                    key={story.id}
                    onSelect={() => onSelectStory(story)}
                    showVersion={showVersion}
                    story={story}
                    storyIssues={issuesForTarget(issues, story.id)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </section>
      ))}
    </div>
  )
}

function EpicKanbanGroup({
  epic,
  stories,
  issues,
  documentationBadges,
  epicById,
  showVersion,
  showFrozen,
  onSelectStory,
}: {
  epic: Epic
  stories: UserStory[]
  issues: MonitorIssue[]
  documentationBadges: ReadonlyMap<string, StoryDocumentationBadge | null>
  epicById: Record<string, Epic>
  showVersion: boolean
  showFrozen: boolean
  onSelectStory: (story: UserStory) => void
}) {
  const epicStories = useMemo(
    () => stories.filter((s) => s.epic === epic.id),
    [stories, epic.id],
  )
  const { done, total } = useMemo(() => countStoryProgress(epicStories), [epicStories])
  const allDone = total > 0 && done === total
  const [open, setOpen] = useState(!allDone)

  return (
    <Collapsible
      className="overflow-hidden rounded-xl border border-border bg-card"
      onOpenChange={setOpen}
      open={open}
    >
      <CollapsibleTrigger className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40 data-[state=open]:border-b data-[state=open]:border-border/80">
        <ChevronDown
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-0 group-data-[state=closed]:-rotate-90"
        />
        <span className="font-mono text-xs font-semibold text-primary">{epic.id}</span>
        <span className={cn(typeScale.label, "min-w-0 flex-1 truncate")}>
          {epic.title}
        </span>
        <span className={cn(typeScale.caption, "shrink-0 tabular-nums")}>
          {done}/{total}
        </span>
        {allDone ? (
          <CheckCircle2 aria-hidden className="size-4 shrink-0 text-meridian-success" />
        ) : null}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <KanbanColumnsGrid
          documentationBadges={documentationBadges}
          epicById={epicById}
          issues={issues}
          onSelectStory={onSelectStory}
          showFrozen={showFrozen}
          showVersion={showVersion}
          stories={epicStories}
        />
      </CollapsibleContent>
    </Collapsible>
  )
}

function epicFilterLabel(epic: Epic) {
  const short =
    epic.title.length > 24 ? `${epic.title.slice(0, 21).trim()}…` : epic.title
  return `${epic.id} · ${short}`
}

function StoryImplementationBadge({
  kind,
}: {
  kind: Exclude<StoryDocumentationBadge, null>
}) {
  if (kind === "impl-ok") {
    return (
      <span
        aria-label="Technical implementation recorded in the US"
        className="max-w-full shrink-0 truncate rounded-full bg-meridian-success-muted px-1.5 py-0.5 text-[10px] font-medium text-meridian-success-foreground"
        title="## Technical implementation filled with ### Files and paths (/complete-us)"
      >
        Impl. OK
      </span>
    )
  }

  return (
    <span
      aria-label="Missing technical implementation record in the US"
      className="max-w-full shrink-0 truncate rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 dark:text-amber-300"
      title="Missing ## Technical implementation with ### Files and real paths — use /complete-us when closing the US"
    >
      Missing impl.
    </span>
  )
}

function KanbanStoryCard({
  story,
  epicTitle,
  storyIssues,
  documentationBadge,
  showVersion,
  onSelect,
}: {
  story: UserStory
  epicTitle: string | undefined
  storyIssues: MonitorIssue[]
  documentationBadge: StoryDocumentationBadge
  showVersion: boolean
  onSelect: () => void
}) {
  const hasError = storyIssues.some((issue) => issue.severity === "error")
  const hasWarning = storyIssues.some((issue) => issue.severity === "warning")

  return (
    <button
      className={cn(
        "group flex w-full flex-col gap-2.5 rounded-xl border border-border/80 bg-background p-3 text-left shadow-sm transition-all",
        "hover:border-meridian-border hover:bg-muted/20 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        hasError && "border-destructive/60",
        hasWarning && !hasError && "border-amber-500/50",
      )}
      onClick={onSelect}
      type="button"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <span className="font-mono text-xs font-semibold text-primary">
            {story.id}
          </span>
          {showVersion ? (
            <span className="rounded-full bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-foreground">
              {story.version}
            </span>
          ) : null}
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            {story.moscow}
          </span>
          {documentationBadge ? (
            <StoryImplementationBadge kind={documentationBadge} />
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {(hasError || hasWarning) && (
            <AlertCircle
              className={cn(
                "size-4",
                hasError ? "text-destructive" : "text-amber-600 dark:text-amber-400",
              )}
              aria-hidden
            />
          )}
          <ChevronRight
            className="size-4 opacity-40 transition-opacity group-hover:opacity-100"
            aria-hidden
          />
        </div>
      </div>

      <div className="min-w-0 space-y-1.5">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
          {story.title}
        </p>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {story.doneWhen}
        </p>
      </div>

      <p className={cn(typeScale.caption, "truncate border-t border-border/60 pt-2")}>
        <span className="font-mono font-medium text-foreground/90">{story.epic}</span>
        {epicTitle ? ` · ${epicTitle}` : null}
      </p>
    </button>
  )
}

export function KanbanView({
  stories,
  epics,
  issues,
  versions,
  documentationBadges,
}: {
  stories: UserStory[]
  epics: Epic[]
  issues: MonitorIssue[]
  versions: ProductVersion[]
  documentationBadges: ReadonlyMap<string, StoryDocumentationBadge | null>
}) {
  const { selectedVersionIds, toggleVersion } = useMonitorVersionFilter()
  const [boardLayout, setBoardLayout] = useState<BoardLayout>("columns")
  const [epicFilter, setEpicFilter] = useState<string | "all">("all")
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null)
  const [showFrozen, setShowFrozen] = useState(false)

  const epicById = useMemo(
    () => Object.fromEntries(epics.map((epic) => [epic.id, epic])),
    [epics],
  )

  const availableEpics = useMemo(
    () => epicsForVersionFilter(epics, stories, selectedVersionIds),
    [epics, selectedVersionIds, stories],
  )

  useEffect(() => {
    setEpicFilter("all")
    setShowFrozen(false)
  }, [selectedVersionIds])

  useEffect(() => {
    if (
      epicFilter !== "all" &&
      !availableEpics.some((epic) => epic.id === epicFilter)
    ) {
      setEpicFilter("all")
    }
  }, [availableEpics, epicFilter])

  const filtered = useMemo(() => {
    const byVersion = filterStoriesByVersions(stories, selectedVersionIds)

    return byVersion.filter((story) => {
      if (epicFilter !== "all" && story.epic !== epicFilter) {
        return false
      }

      return true
    })
  }, [epicFilter, selectedVersionIds, stories])

  const frozenCount = useMemo(() => countFrozenStories(filtered), [filtered])
  const frozenInSelectedVersions = useMemo(
    () => countFrozenStories(filterStoriesByVersions(stories, selectedVersionIds)),
    [selectedVersionIds, stories],
  )
  const hiddenFrozenVersions = useMemo(() => {
    const byVersion = frozenCountByVersion(stories)
    return sortVersionIdsDesc(
      [...byVersion.keys()].filter((versionId) => !selectedVersionIds.has(versionId)),
    ).map((versionId) => ({
      versionId,
      count: byVersion.get(versionId) ?? 0,
    }))
  }, [selectedVersionIds, stories])

  useEffect(() => {
    if (frozenCount === 0) {
      setShowFrozen(false)
    }
  }, [frozenCount])

  const totalVisible = filtered.length
  const showVersionOnCards = selectedVersionIds.size !== 1
  const selectedLabel = [...selectedVersionIds]
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
    .join(", ")

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {versions.length > 0 ? (
          <div className="border-b border-border/80 px-4 py-3">
            <VersionFilterBar versions={versions} />
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 border-b border-border/80 px-4 py-2.5">
          <button
            className={cn(
              filterChipClass(boardLayout === "columns"),
              "shrink-0 whitespace-nowrap",
            )}
            onClick={() => setBoardLayout("columns")}
            type="button"
          >
            <LayoutGrid className="mr-1 inline size-3.5" aria-hidden />
            Columns
          </button>
          <button
            className={cn(
              filterChipClass(boardLayout === "byEpic"),
              "shrink-0 whitespace-nowrap",
            )}
            onClick={() => setBoardLayout("byEpic")}
            type="button"
          >
            <Layers className="mr-1 inline size-3.5" aria-hidden />
            By epic
          </button>

          {boardLayout === "columns" ? (
            <>
              <span
                aria-hidden
                className="hidden h-4 w-px shrink-0 bg-border sm:block"
              />
              <button
                className={cn(filterChipClass(epicFilter === "all"), "shrink-0")}
                onClick={() => setEpicFilter("all")}
                type="button"
              >
                All
              </button>
              {availableEpics.map((epic) => (
                <button
                  className={cn(
                    filterChipClass(epicFilter === epic.id),
                    "max-w-[200px] shrink-0 truncate",
                  )}
                  key={epic.id}
                  onClick={() => setEpicFilter(epic.id)}
                  title={`${epic.id} — ${epic.title}`}
                  type="button"
                >
                  {epicFilterLabel(epic)}
                </button>
              ))}
            </>
          ) : null}

          {frozenInSelectedVersions > 0 ? (
            <button
              className={cn(filterChipClass(showFrozen), "shrink-0 whitespace-nowrap")}
              onClick={() => setShowFrozen((value) => !value)}
              type="button"
            >
              <Snowflake className="mr-1 inline size-3.5 text-sky-500" aria-hidden />
              {frozenCount} frozen · {showFrozen ? "hide" : "show"}
            </button>
          ) : null}
          {hiddenFrozenVersions.map(({ versionId, count }) => (
            <button
              className={cn(filterChipClass(false), "shrink-0 whitespace-nowrap")}
              key={versionId}
              onClick={() => toggleVersion(versionId)}
              title={`Include ${versionId} — ${count} frozen stor${count === 1 ? "y" : "ies"}`}
              type="button"
            >
              <Snowflake className="mr-1 inline size-3.5 opacity-60" aria-hidden />
              <span className="font-mono">{versionId}</span> ({count})
            </button>
          ))}

          <p
            className={cn(
              typeScale.caption,
              "ms-auto min-w-0 shrink-0 text-muted-foreground",
            )}
          >
            {totalVisible} stor{totalVisible === 1 ? "y" : "ies"}
            {selectedVersionIds.size > 0 ? ` · ${selectedLabel}` : ""}
          </p>
        </div>

        {selectedVersionIds.size === 0 ? (
          <p className={cn(typeScale.caption, "px-4 py-2 text-destructive")}>
            Select at least one version above.
          </p>
        ) : null}

        {boardLayout === "columns" ? (
          <KanbanColumnsGrid
            documentationBadges={documentationBadges}
            epicById={epicById}
            issues={issues}
            onSelectStory={setSelectedStory}
            showFrozen={showFrozen}
            showVersion={showVersionOnCards}
            stories={filtered}
          />
        ) : (
          <div className="space-y-2 p-3 pt-0">
            {availableEpics.length === 0 ? (
              <p
                className={cn(
                  typeScale.caption,
                  "py-8 text-center text-muted-foreground/60",
                )}
              >
                No epics visible for the current filter.
              </p>
            ) : (
              availableEpics.map((epic) => (
                <EpicKanbanGroup
                  documentationBadges={documentationBadges}
                  epic={epic}
                  epicById={epicById}
                  issues={issues}
                  key={epic.id}
                  onSelectStory={setSelectedStory}
                  showFrozen={showFrozen}
                  showVersion={showVersionOnCards}
                  stories={filtered}
                />
              ))
            )}
          </div>
        )}
      </div>

      <StoryDetailSheet
        epic={selectedStory ? epicById[selectedStory.epic] : undefined}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedStory(null)
          }
        }}
        open={selectedStory !== null}
        story={selectedStory}
        storyIssues={selectedStory ? issuesForTarget(issues, selectedStory.id) : []}
      />
    </div>
  )
}
