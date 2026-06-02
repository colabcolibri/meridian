import { GitBranch, Rocket } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ProductVersion, Sprint, UserStory } from "@/domain/meridian/types"
import { countStoriesByVersion } from "@/domain/meridian/validators"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

function releaseStatusLabel(status: ProductVersion["status"]) {
  if (status === "complete") return "concluída"
  if (status === "active") return "ativa"
  return "planejada"
}

function VersionCard({
  version,
  stories,
  sprints,
}: {
  version: ProductVersion
  stories: UserStory[]
  sprints: Sprint[]
}) {
  const { total, done } = countStoriesByVersion(stories, version.id)
  const versionSprints = sprints.filter((sprint) => sprint.versionId === version.id)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-meridian" />
            <CardTitle className={typeScale.cardTitle}>{version.id}</CardTitle>
          </div>
          <Badge variant={version.status === "planned" ? "outline" : "default"}>
            {releaseStatusLabel(version.status)}
          </Badge>
        </div>
        <CardDescription className={cn(typeScale.label, "text-foreground")}>
          {version.title}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className={typeScale.bodySm}>
          <span className="font-medium text-foreground">Outcome: </span>
          {version.outcome}
        </p>
        {version.objective ? (
          <p className={typeScale.bodySm}>{version.objective}</p>
        ) : null}
        {versionSprints.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {versionSprints.map((sprint) => (
              <Badge key={sprint.id} variant="secondary">
                {sprint.id}
              </Badge>
            ))}
          </div>
        ) : null}
        <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            {done}/{total}
          </span>{" "}
          user stories nesta versão
        </div>
      </CardContent>
    </Card>
  )
}

export function VersionsView({
  versions,
  sprints,
  stories,
}: {
  versions: ProductVersion[]
  sprints: Sprint[]
  stories: UserStory[]
}) {
  const complete = versions.filter((version) => version.status === "complete")
  const active = versions.filter((version) => version.status === "active")
  const planned = versions.filter((version) => version.status === "planned")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <GitBranch className="h-5 w-5 text-meridian" aria-hidden />
        <h2 className={typeScale.sectionTitle}>Versões (releases)</h2>
      </div>
      <p className={typeScale.bodySm}>
        Releases lidos de <code className="font-mono text-xs">docs/versions/</code>.
        Sprints em <code className="font-mono text-xs">docs/sprints/</code>. Cada US
        referencia <code className="font-mono text-xs">version: vX</code> no
        frontmatter.
      </p>
      {active.length > 0 ? (
        <div>
          <h3 className={cn(typeScale.label, "mb-4 text-foreground")}>Ativas</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {active.map((version) => (
              <VersionCard
                key={version.id}
                sprints={sprints}
                stories={stories}
                version={version}
              />
            ))}
          </div>
        </div>
      ) : null}
      {complete.length > 0 ? (
        <div>
          <h3 className={cn(typeScale.label, "mb-4 text-foreground")}>Concluídas</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {complete.map((version) => (
              <VersionCard
                key={version.id}
                sprints={sprints}
                stories={stories}
                version={version}
              />
            ))}
          </div>
        </div>
      ) : null}
      {planned.length > 0 ? (
        <div>
          <h3 className={cn(typeScale.label, "mb-4 text-foreground")}>Planejadas</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {planned.map((version) => (
              <VersionCard
                key={version.id}
                sprints={sprints}
                stories={stories}
                version={version}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
