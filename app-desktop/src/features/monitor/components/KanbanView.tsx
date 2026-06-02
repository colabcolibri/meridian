import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import type { Epic, UserStory } from "@/domain/meridian/types"
import { issuesForTarget } from "@/domain/meridian/protocol-validators"
import { groupStoriesByStatus } from "@/domain/meridian/validators"

const columnMeta: Record<UserStory["status"], { title: string; description: string }> =
  {
    "❌": { title: "Pendente", description: "Ainda não iniciada" },
    "🔶": { title: "Em andamento", description: "Exige Falta: no aceite" },
    "✅": { title: "Concluída", description: "Aceite com evidência" },
    "🧊": { title: "Congelada", description: "Fora do sprint atual" },
  }

function StoryCard({
  story,
  epicTitle,
  storyIssues,
}: {
  story: UserStory
  epicTitle: string
  storyIssues: MonitorIssue[]
}) {
  const hasError = storyIssues.some((issue) => issue.severity === "error")

  return (
    <article
      className={cn(
        "rounded-md border bg-white p-3 shadow-sm",
        hasError && "border-red-300 ring-1 ring-red-200",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-zinc-500">{story.id}</span>
        <Badge variant="outline">{story.epic}</Badge>
        <Badge variant="secondary">{story.version}</Badge>
      </div>
      <h3 className="mt-2 text-sm font-medium leading-5 text-zinc-950">
        {story.title}
      </h3>
      <p className="mt-2 text-xs text-zinc-500">{epicTitle}</p>
      <p className="mt-2 text-xs leading-5 text-zinc-600">{story.doneWhen}</p>
      <div className="mt-2 flex justify-between text-xs text-zinc-500">
        <span>{story.moscow}</span>
        {story.dependsOn.length > 0 ? (
          <span>deps: {story.dependsOn.join(", ")}</span>
        ) : null}
      </div>
      {storyIssues.length > 0 ? (
        <ul className="mt-2 space-y-1 text-xs text-red-800">
          {storyIssues.map((issue) => (
            <li key={issue.message}>{issue.message}</li>
          ))}
        </ul>
      ) : null}
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

  const epicTitles = useMemo(
    () => Object.fromEntries(epics.map((epic) => [epic.id, epic.title])),
    [epics],
  )

  const filtered =
    epicFilter === "all"
      ? stories
      : stories.filter((story) => story.epic === epicFilter)

  const columns = groupStoriesByStatus(filtered)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            epicFilter === "all"
              ? "border-teal-700 bg-teal-700 text-white"
              : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
          )}
          onClick={() => setEpicFilter("all")}
          type="button"
        >
          Todos os epics
        </button>
        {epics.map((epic) => (
          <button
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              epicFilter === epic.id
                ? "border-teal-700 bg-teal-700 text-white"
                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
            )}
            key={epic.id}
            onClick={() => setEpicFilter(epic.id)}
            type="button"
          >
            {epic.id}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {columns.map(({ status, stories: columnStories }) => (
          <Card className="flex flex-col" key={status}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <span aria-hidden>{status}</span>
                {columnMeta[status].title}
              </CardTitle>
              <CardDescription>
                {columnMeta[status].description} · {columnStories.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
              {columnStories.length === 0 ? (
                <p className="text-xs text-zinc-400">Nenhuma US nesta coluna.</p>
              ) : (
                columnStories.map((story) => (
                  <StoryCard
                    epicTitle={epicTitles[story.epic] ?? story.epic}
                    key={story.id}
                    story={story}
                    storyIssues={issuesForTarget(issues, story.id)}
                  />
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
