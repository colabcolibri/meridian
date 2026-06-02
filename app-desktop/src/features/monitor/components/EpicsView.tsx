import { Layers, PauseCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Epic, UserStory } from "@/domain/meridian/types"
import { countStoriesByEpic } from "@/domain/meridian/validators"

function EpicCard({ epic, stories }: { epic: Epic; stories: UserStory[] }) {
  const { total, done } = countStoriesByEpic(stories, epic.id)
  const paused = epic.status === "paused"

  return (
    <Card className={paused ? "opacity-75" : undefined}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-teal-700" />
            <CardTitle className="text-base">{epic.id}</CardTitle>
          </div>
          <Badge variant={paused ? "outline" : "default"}>
            {paused ? (
              <span className="flex items-center gap-1">
                <PauseCircle className="h-3 w-3" />
                pausado
              </span>
            ) : (
              "ativo"
            )}
          </Badge>
        </div>
        <CardDescription className="text-sm font-medium text-zinc-800">
          {epic.title}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="leading-6 text-zinc-600">{epic.description}</p>
        <div className="flex flex-wrap gap-2">
          {epic.versions.map((version) => (
            <Badge key={version} variant="outline">
              {version}
            </Badge>
          ))}
        </div>
        <div className="rounded-md border bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
          <span className="font-medium text-zinc-800">
            {done}/{total}
          </span>{" "}
          user stories concluídas neste epic
        </div>
      </CardContent>
    </Card>
  )
}

export function EpicsView({ epics, stories }: { epics: Epic[]; stories: UserStory[] }) {
  const active = epics.filter((epic) => epic.status === "active")
  const complete = epics.filter((epic) => epic.status === "complete")
  const paused = epics.filter((epic) => epic.status === "paused")

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-600">
        Épicos vêm de <code className="rounded bg-zinc-100 px-1">04_epics.md</code> na
        pasta docs aberta. Cada card resume quantas US do kanban pertencem ao epic.
      </p>
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Ativos
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {active.map((epic) => (
            <EpicCard epic={epic} key={epic.id} stories={stories} />
          ))}
        </div>
      </div>
      {complete.length > 0 ? (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Concluídos
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {complete.map((epic) => (
              <EpicCard epic={epic} key={epic.id} stories={stories} />
            ))}
          </div>
        </div>
      ) : null}
      {paused.length > 0 ? (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Pausados
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {paused.map((epic) => (
              <EpicCard epic={epic} key={epic.id} stories={stories} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
