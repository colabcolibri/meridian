import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import type { Epic, UserStory } from "@/domain/meridian/types"
import { issuesForTarget } from "@/domain/meridian/protocol-validators"
import { groupStoriesByStatus } from "@/domain/meridian/validators"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

const columnMeta: Record<UserStory["status"], { title: string }> = {
  "❌": { title: "Pendente" },
  "🔶": { title: "Em andamento" },
  "✅": { title: "Concluída" },
  "🧊": { title: "Congelada" },
}

function epicFilterLabel(epic: Epic) {
  const short =
    epic.title.length > 28 ? `${epic.title.slice(0, 25).trim()}…` : epic.title
  return `${epic.id} · ${short}`
}

function StoryCard({
  story,
  epic,
  storyIssues,
}: {
  story: UserStory
  epic: Epic | undefined
  storyIssues: MonitorIssue[]
}) {
  const hasError = storyIssues.some((issue) => issue.severity === "error")

  return (
    <article
      className={cn(
        "rounded-lg border bg-white p-3 shadow-sm",
        hasError && "border-red-300",
      )}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="font-mono text-[11px] font-medium text-zinc-700">
          {story.id}
        </span>
        <Badge className="h-5 text-[10px]" variant="outline">
          {story.version}
        </Badge>
        <Badge className="h-5 text-[10px]" variant="secondary">
          {story.moscow}
        </Badge>
      </div>

      <h3 className="mt-1.5 text-sm font-medium leading-snug text-zinc-950">
        {story.title}
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge className="font-mono text-[10px]" variant="outline">
          {story.epic}
        </Badge>
        {epic ? (
          <span className={cn(typeScale.caption, "min-w-0 truncate")}>
            {epic.title}
          </span>
        ) : null}
      </div>

      {storyIssues.length > 0 ? (
        <p className="mt-2 text-xs text-red-800">{storyIssues[0]?.message}</p>
      ) : null}

      <details className="mt-2 text-xs text-zinc-600">
        <summary className="cursor-pointer select-none text-zinc-500 hover:text-zinc-800">
          Detalhes
        </summary>
        <p className="mt-2 leading-5">{story.doneWhen}</p>
        {story.dependsOn.length > 0 ? (
          <p className="mt-1 text-zinc-500">Depende de: {story.dependsOn.join(", ")}</p>
        ) : null}
      </details>
    </article>
  )
}

export function KanbanView({
  stories,
  epics,
  issues,
}: {
  stories: UserStory[]
  epics: Epic[]
  issues: MonitorIssue[]
}) {
  const [epicFilter, setEpicFilter] = useState<string | "all">("all")
  const [versionFilter, setVersionFilter] = useState<string | "all">("all")

  const epicById = useMemo(
    () => Object.fromEntries(epics.map((epic) => [epic.id, epic])),
    [epics],
  )

  const versionIds = useMemo(
    () =>
      [...new Set(stories.map((story) => story.version))].sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true }),
      ),
    [stories],
  )

  const filtered = stories.filter((story) => {
    if (epicFilter !== "all" && story.epic !== epicFilter) {
      return false
    }
    if (versionFilter !== "all" && story.version !== versionFilter) {
      return false
    }
    return true
  })

  const columns = groupStoriesByStatus(filtered)

  const filterButtonClass = (active: boolean) =>
    cn(
      "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
      active
        ? "bg-meridian text-meridian-foreground"
        : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50",
    )

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className={typeScale.caption}>Versão</p>
        <div className="flex flex-wrap gap-2">
          <button
            className={filterButtonClass(versionFilter === "all")}
            onClick={() => setVersionFilter("all")}
            type="button"
          >
            Todas
          </button>
          {versionIds.map((versionId) => (
            <button
              className={filterButtonClass(versionFilter === versionId)}
              key={versionId}
              onClick={() => setVersionFilter(versionId)}
              type="button"
            >
              {versionId}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className={typeScale.caption}>Epic</p>
        <div className="flex flex-wrap gap-2">
          <button
            className={filterButtonClass(epicFilter === "all")}
            onClick={() => setEpicFilter("all")}
            type="button"
          >
            Todos
          </button>
          {epics.map((epic) => (
            <button
              className={cn(
                filterButtonClass(epicFilter === epic.id),
                "max-w-[240px] truncate",
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
      </div>

      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible">
        {columns.map(({ status, stories: columnStories }) => (
          <section
            className="flex w-[min(280px,85vw)] shrink-0 flex-col rounded-xl border border-zinc-200 bg-zinc-50/80 lg:w-auto"
            key={status}
          >
            <header className="border-b border-zinc-200/80 px-3 py-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                <span aria-hidden>{status}</span>
                {columnMeta[status].title}
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                {columnStories.length} item{columnStories.length === 1 ? "" : "s"}
              </p>
            </header>
            <div className="flex min-h-[120px] flex-1 flex-col gap-2 p-2">
              {columnStories.length === 0 ? (
                <p className="px-1 py-4 text-center text-xs text-zinc-400">Vazio</p>
              ) : (
                columnStories.map((story) => (
                  <StoryCard
                    epic={epicById[story.epic]}
                    key={story.id}
                    story={story}
                    storyIssues={issuesForTarget(issues, story.id)}
                  />
                ))
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
