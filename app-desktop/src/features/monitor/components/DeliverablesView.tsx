import { GitBranch, Layers } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Epic, ProductVersion, Sprint, UserStory } from "@/domain/meridian/types"
import { countStoriesByEpic, countStoriesByVersion } from "@/domain/meridian/validators"
import { monitorPanelClass, ProgressBar } from "@/features/monitor/monitor-ui"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

function epicsForVersion(versionId: string, epics: Epic[], stories: UserStory[]) {
  const epicIdsWithStories = new Set(
    stories.filter((story) => story.version === versionId).map((story) => story.epic),
  )

  return epics.filter(
    (epic) => epic.versions.includes(versionId) || epicIdsWithStories.has(epic.id),
  )
}

function EpicRow({
  epic,
  stories,
  versionId,
}: {
  epic: Epic
  stories: UserStory[]
  versionId: string
}) {
  const inVersion = stories.filter(
    (story) => story.epic === epic.id && story.version === versionId,
  )
  const done = inVersion.filter((story) => story.status === "✅").length
  const progress =
    inVersion.length > 0 ? Math.round((done / inVersion.length) * 100) : 0

  if (inVersion.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/80 bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1 space-y-2">
        <div>
          <p className="font-mono text-xs font-semibold text-primary">{epic.id}</p>
          <p className={cn(typeScale.bodySm, "text-foreground")}>{epic.title}</p>
        </div>
        <ProgressBar className="max-w-xs" value={progress} />
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
        <Badge variant={epic.status === "active" ? "default" : "outline"}>
          {epic.status}
        </Badge>
        <span className={typeScale.caption}>
          {done}/{inVersion.length} US · {progress}%
        </span>
      </div>
    </div>
  )
}

function VersionSection({
  version,
  epics,
  sprints,
  stories,
}: {
  version: ProductVersion
  epics: Epic[]
  stories: UserStory[]
  sprints: Sprint[]
}) {
  const { total, done } = countStoriesByVersion(stories, version.id)
  const versionSprints = sprints.filter((sprint) => sprint.versionId === version.id)
  const versionEpics = epicsForVersion(version.id, epics, stories)
  const progress = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <Card className={cn(monitorPanelClass, "overflow-hidden shadow-sm")}>
      <CardHeader className="space-y-4 border-b border-border/60 bg-meridian-muted/30 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <CardTitle className={typeScale.sectionTitle}>
                {version.id} — {version.title}
              </CardTitle>
            </div>
            <CardDescription className={cn(typeScale.bodySm, "max-w-2xl text-pretty")}>
              {version.outcome}
            </CardDescription>
          </div>
          <Badge variant={version.status === "planned" ? "outline" : "secondary"}>
            {version.status}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className={typeScale.caption}>Progresso da versão</span>
            <span className={cn(typeScale.label, "tabular-nums")}>
              {done}/{total} US ({progress}%)
            </span>
          </div>
          <ProgressBar value={progress} />
        </div>

        {versionSprints.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {versionSprints.map((sprint) => (
              <Badge key={sprint.id} variant="outline">
                {sprint.id}: {sprint.title}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardHeader>

      {versionEpics.length > 0 ? (
        <CardContent className="space-y-3 pt-4">
          <p className={typeScale.label}>Épicos nesta versão</p>
          {versionEpics.map((epic) => (
            <EpicRow
              epic={epic}
              key={epic.id}
              stories={stories}
              versionId={version.id}
            />
          ))}
        </CardContent>
      ) : null}
    </Card>
  )
}

export function DeliverablesView({
  versions,
  epics,
  sprints,
  stories,
}: {
  versions: ProductVersion[]
  epics: Epic[]
  sprints: Sprint[]
  stories: UserStory[]
}) {
  const sortedVersions = [...versions].sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true }),
  )

  const orphans = epics.filter(
    (epic) =>
      !sortedVersions.some((version) =>
        epicsForVersion(version.id, [epic], stories).some(
          (item) => item.id === epic.id,
        ),
      ),
  )

  return (
    <div className="space-y-6">
      <div className={cn(monitorPanelClass, "p-4")}>
        <p className={typeScale.bodySm}>
          Hierarquia{" "}
          <strong className="font-medium text-foreground">versão → epic → US</strong>.
          Releases em{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            docs/versions/
          </code>
          , épicos em{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            docs/epics/
          </code>
          .
        </p>
      </div>

      <div className="space-y-6">
        {sortedVersions.map((version) => (
          <VersionSection
            epics={epics}
            key={version.id}
            sprints={sprints}
            stories={stories}
            version={version}
          />
        ))}
      </div>

      {orphans.length > 0 ? (
        <Card className={monitorPanelClass}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <CardTitle className={typeScale.cardTitle}>Outros épicos</CardTitle>
            </div>
            <CardDescription>Épicos sem US nas versões listadas acima</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {orphans.map((epic) => {
              const { total, done } = countStoriesByEpic(stories, epic.id)
              return (
                <div
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/80 bg-muted/20 p-3"
                  key={epic.id}
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
                </div>
              )
            })}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
