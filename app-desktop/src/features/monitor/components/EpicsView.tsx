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
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

function epicStatusLabel(status: Epic["status"]) {
  if (status === "complete") return "concluído"
  if (status === "paused") return "pausado"
  return "ativo"
}

function EpicCard({ epic, stories }: { epic: Epic; stories: UserStory[] }) {
  const { total, done } = countStoriesByEpic(stories, epic.id)
  const paused = epic.status === "paused"

  return (
    <Card className={paused ? "opacity-75" : undefined}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-meridian" />
            <CardTitle className={typeScale.cardTitle}>{epic.id}</CardTitle>
          </div>
          <Badge variant={paused ? "outline" : "default"}>
            {paused ? (
              <span className="flex items-center gap-1">
                <PauseCircle className="h-3 w-3" />
                pausado
              </span>
            ) : (
              epicStatusLabel(epic.status)
            )}
          </Badge>
        </div>
        <CardDescription className={cn(typeScale.label, "text-foreground")}>
          {epic.title}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className={typeScale.bodySm}>
          <span className="font-medium text-foreground">Outcome: </span>
          {epic.outcome}
        </p>
        <p className={typeScale.bodySm}>{epic.description}</p>
        {epic.scopeOut ? (
          <p className={typeScale.bodySm}>
            <span className="font-medium text-foreground">Fora deste epic: </span>
            {epic.scopeOut}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {epic.profiles.map((profile) => (
            <Badge key={profile} variant="secondary">
              {profile}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {epic.versions.map((version) => (
            <Badge key={version} variant="outline">
              {version}
            </Badge>
          ))}
        </div>
        <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
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
      <p className={typeScale.bodySm}>
        Capacidades de produto lidas de{" "}
        <code className="font-mono text-xs">docs/epics/</code>. Cada card corresponde a
        um arquivo EPIC-XX.md e mostra quantas user stories estão ligadas.
      </p>
      <div>
        <h2 className={cn(typeScale.sectionTitle, "mb-4")}>Ativos</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {active.map((epic) => (
            <EpicCard epic={epic} key={epic.id} stories={stories} />
          ))}
        </div>
      </div>
      {complete.length > 0 ? (
        <div>
          <h2 className={cn(typeScale.sectionTitle, "mb-4")}>Concluídos</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {complete.map((epic) => (
              <EpicCard epic={epic} key={epic.id} stories={stories} />
            ))}
          </div>
        </div>
      ) : null}
      {paused.length > 0 ? (
        <div>
          <h2 className={cn(typeScale.sectionTitle, "mb-4")}>Pausados</h2>
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
