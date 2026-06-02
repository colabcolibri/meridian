import { useEffect, useMemo, useState } from "react"

import { AlertCircle, ChevronRight, Info } from "lucide-react"
import { Popover } from "radix-ui"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import type { KanbanColumnId } from "@/domain/meridian/kanban-columns"
import { groupStoriesForKanban } from "@/domain/meridian/kanban-columns"
import type { Epic, ProductVersion, UserStory } from "@/domain/meridian/types"
import { issuesForTarget } from "@/domain/meridian/protocol-validators"
import { useMonitorVersionFilter } from "@/features/monitor/MonitorVersionFilterContext"
import { StoryDetailSheet } from "@/features/monitor/components/StoryDetailSheet"
import { VersionFilterBar } from "@/features/monitor/components/VersionFilterBar"
import { filterChipClass } from "@/features/monitor/monitor-ui"
import { typeScale } from "@/features/monitor/monitor-typography"
import {
  epicsForVersionFilter,
  filterStoriesByVersions,
} from "@/features/monitor/version-filter"
import { cn } from "@/lib/utils"

const columnMeta: Record<KanbanColumnId, { title: string; description: string }> = {
  "❌": {
    title: "Pending",
    description: "Status ❌ in frontmatter — not started or not complete.",
  },
  "🔶": {
    title: "In progress",
    description:
      'Status 🔶 — partially done; Acceptance must include "Missing:" explaining what is left.',
  },
  "🧪": {
    title: "Awaiting tests",
    description:
      "Derived column: status ✅ in frontmatter, but tests_status still pending (or Tests without evidence).",
  },
  "✅": {
    title: "Complete",
    description: "Status ✅ with acceptance criteria and tests verified in the files.",
  },
  "🧊": {
    title: "Frozen",
    description: "Status 🧊 — paused on purpose; not in the flow now.",
  },
}

function KanbanColumnHeader({
  columnId,
  count,
}: {
  columnId: KanbanColumnId
  count: number
}) {
  const meta = columnMeta[columnId]

  return (
    <header className="shrink-0 border-b border-border/80 bg-muted/40 px-3 py-3">
      <div className="flex items-center gap-1.5">
        <h2 className="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold text-foreground">
          <span aria-hidden>{columnId}</span>
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

function epicFilterLabel(epic: Epic) {
  const short =
    epic.title.length > 24 ? `${epic.title.slice(0, 21).trim()}…` : epic.title
  return `${epic.id} · ${short}`
}

function KanbanStoryCard({
  story,
  epicTitle,
  storyIssues,
  showVersion,
  onSelect,
}: {
  story: UserStory
  epicTitle: string | undefined
  storyIssues: MonitorIssue[]
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
}: {
  stories: UserStory[]
  epics: Epic[]
  issues: MonitorIssue[]
  versions: ProductVersion[]
}) {
  const { selectedVersionIds } = useMonitorVersionFilter()
  const [epicFilter, setEpicFilter] = useState<string | "all">("all")
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null)

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

  const columns = groupStoriesForKanban(filtered)
  const totalVisible = filtered.length
  const showVersionOnCards = selectedVersionIds.size !== 1
  const selectedLabel = [...selectedVersionIds]
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
    .join(", ")

  return (
    <div className="space-y-4">
      {versions.length > 0 ? (
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <VersionFilterBar versions={versions} />
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="space-y-3 border-b border-border/80 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className={typeScale.label}>Filter by epic</p>
            <p className={typeScale.caption}>
              {totalVisible} visible stor{totalVisible === 1 ? "y" : "ies"}
              {selectedVersionIds.size > 0
                ? ` · ${selectedLabel}`
                : " · no version selected"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className={filterChipClass(epicFilter === "all")}
              onClick={() => setEpicFilter("all")}
              type="button"
            >
              All
            </button>
            {availableEpics.map((epic) => (
              <button
                className={cn(
                  filterChipClass(epicFilter === epic.id),
                  "max-w-[220px] truncate",
                )}
                key={epic.id}
                onClick={() => setEpicFilter(epic.id)}
                title={`${epic.id} — ${epic.title}`}
                type="button"
              >
                {epicFilterLabel(epic)}
              </button>
            ))}
          </div>
          {selectedVersionIds.size === 0 ? (
            <p className={cn(typeScale.caption, "text-destructive")}>
              Select at least one version above.
            </p>
          ) : null}
        </div>

        <div className="-mx-px flex overflow-x-auto lg:grid lg:grid-cols-5 lg:overflow-visible">
          {columns.map(({ columnId, stories: columnStories }) => (
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
                    <p className={cn(typeScale.caption, "px-1 py-10 text-center")}>
                      No stories in this column
                    </p>
                  ) : (
                    columnStories.map((story) => (
                      <KanbanStoryCard
                        epicTitle={epicById[story.epic]?.title}
                        key={story.id}
                        onSelect={() => setSelectedStory(story)}
                        showVersion={showVersionOnCards}
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
