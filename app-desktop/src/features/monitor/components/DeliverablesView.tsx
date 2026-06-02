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

  if (inVersion.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-mono text-xs font-medium text-meridian">{epic.id}</p>
        <p className={cn(typeScale.bodySm, "text-foreground")}>{epic.title}</p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Badge variant={epic.status === "active" ? "default" : "outline"}>
          {epic.status}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {done}/{inVersion.length} US
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

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-meridian" aria-hidden />
            <h3 className={typeScale.sectionTitle}>
              {version.id} — {version.title}
            </h3>
          </div>
          <p className={cn(typeScale.bodySm, "mt-1 max-w-2xl")}>{version.outcome}</p>
        </div>
        <Badge variant={version.status === "planned" ? "outline" : "secondary"}>
          {version.status}
        </Badge>
      </div>

      {versionSprints.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {versionSprints.map((sprint) => (
            <Badge key={sprint.id} variant="outline">
              {sprint.id}: {sprint.title}
            </Badge>
          ))}
        </div>
      ) : null}

      <p className={typeScale.caption}>
        {done}/{total} user stories nesta versão
      </p>

      {versionEpics.length > 0 ? (
        <div className="space-y-2">
          <p className={typeScale.label}>Épicos nesta versão</p>
          {versionEpics.map((epic) => (
            <EpicRow
              epic={epic}
              key={epic.id}
              stories={stories}
              versionId={version.id}
            />
          ))}
        </div>
      ) : null}
    </section>
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
    <div className="space-y-10">
      <p className={typeScale.bodySm}>
        Hierarquia <strong className="text-foreground">versão → epic → US</strong>.
        Releases em <code className="font-mono text-xs">docs/versions/</code>, épicos em{" "}
        <code className="font-mono text-xs">docs/epics/</code>.
      </p>

      {sortedVersions.map((version) => (
        <VersionSection
          epics={epics}
          key={version.id}
          sprints={sprints}
          stories={stories}
          version={version}
        />
      ))}

      {orphans.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-meridian" />
              <CardTitle className={typeScale.cardTitle}>Outros épicos</CardTitle>
            </div>
            <CardDescription>Épicos sem US na versões listadas acima</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {orphans.map((epic) => {
              const { total, done } = countStoriesByEpic(stories, epic.id)
              return (
                <div
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
                  key={epic.id}
                >
                  <div>
                    <p className="font-mono text-xs text-meridian">{epic.id}</p>
                    <p className={typeScale.bodySm}>{epic.title}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
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
