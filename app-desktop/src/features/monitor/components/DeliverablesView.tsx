import { useEffect, useMemo, useState } from "react"

import { ChevronDown, ChevronRight, FileText, GitBranch, Layers } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { Epic, ProductVersion, Sprint, UserStory } from "@/domain/meridian/types"
import { countStoriesByEpic, countStoriesByVersion } from "@/domain/meridian/validators"
import { MarkdownDocSheet } from "@/features/monitor/components/MarkdownDocSheet"
import { typeScale } from "@/features/monitor/monitor-typography"
import {
  epicsForVersionFilter,
  resolveDefaultSelectedVersions,
  sortVersionsDesc,
} from "@/features/monitor/version-filter"
import { cn } from "@/lib/utils"

type DeliverableSheetTarget =
  | { kind: "version"; item: ProductVersion }
  | { kind: "epic"; item: Epic; versionId: string }
  | { kind: "sprint"; item: Sprint }

function epicsForVersion(versionId: string, epics: Epic[], stories: UserStory[]) {
  return epicsForVersionFilter(epics, stories, new Set([versionId]))
}

function epicProgress(stories: UserStory[], epicId: string, versionId: string) {
  const inVersion = stories.filter(
    (story) => story.epic === epicId && story.version === versionId,
  )
  const done = inVersion.filter((story) => story.status === "✅").length
  const total = inVersion.length
  const progress = total > 0 ? Math.round((done / total) * 100) : 0

  return { done, total, progress }
}

function DeliverableSheet({
  target,
  stories,
  open,
  onOpenChange,
}: {
  target: DeliverableSheetTarget | null
  stories: UserStory[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!target) {
    return null
  }

  if (target.kind === "version") {
    const version = target.item
    const { total, done } = countStoriesByVersion(stories, version.id)
    const progress = total > 0 ? Math.round((done / total) * 100) : 0

    return (
      <MarkdownDocSheet
        badges={
          <Badge variant={version.status === "planned" ? "outline" : "secondary"}>
            {version.status}
          </Badge>
        }
        docPath={`versions/${version.id}.md`}
        onOpenChange={onOpenChange}
        open={open}
        subtitle={version.id}
        summary={
          <div className="space-y-3">
            <p className={typeScale.bodySm}>{version.outcome}</p>
            <p className={typeScale.caption}>
              Progresso: {done}/{total} US ({progress}%)
            </p>
          </div>
        }
        title={`${version.id} — ${version.title}`}
      />
    )
  }

  if (target.kind === "sprint") {
    const sprint = target.item

    return (
      <MarkdownDocSheet
        badges={<Badge variant="outline">{sprint.status}</Badge>}
        docPath={`sprints/${sprint.id}.md`}
        onOpenChange={onOpenChange}
        open={open}
        subtitle={sprint.versionId}
        summary={
          sprint.storyIds.length > 0 ? (
            <p className={typeScale.bodySm}>US: {sprint.storyIds.join(", ")}</p>
          ) : undefined
        }
        title={`${sprint.id} — ${sprint.title}`}
      />
    )
  }

  const epic = target.item
  const stats =
    target.versionId === "—"
      ? countStoriesByEpic(stories, epic.id)
      : epicProgress(stories, epic.id, target.versionId)
  const { done, total } = stats
  const progress =
    "progress" in stats
      ? stats.progress
      : total > 0
        ? Math.round((done / total) * 100)
        : 0

  return (
    <MarkdownDocSheet
      badges={
        <Badge variant={epic.status === "active" ? "default" : "outline"}>
          {epic.status}
        </Badge>
      }
      docPath={`epics/${epic.id}.md`}
      onOpenChange={onOpenChange}
      open={open}
      subtitle={target.versionId === "—" ? undefined : target.versionId}
      summary={
        <div className="space-y-2">
          <p className={typeScale.bodySm}>{epic.outcome}</p>
          <p className={typeScale.caption}>
            {target.versionId === "—"
              ? `Total: ${done}/${total} US (${progress}%)`
              : `Nesta versão: ${done}/${total} US (${progress}%)`}
          </p>
        </div>
      }
      title={`${epic.id} — ${epic.title}`}
    />
  )
}

function VersionBlock({
  version,
  epics,
  sprints,
  stories,
  expanded,
  onToggleExpanded,
  onOpenVersion,
  onOpenSprint,
  onOpenEpic,
}: {
  version: ProductVersion
  epics: Epic[]
  stories: UserStory[]
  sprints: Sprint[]
  expanded: boolean
  onToggleExpanded: () => void
  onOpenVersion: (version: ProductVersion) => void
  onOpenSprint: (sprint: Sprint) => void
  onOpenEpic: (epic: Epic, versionId: string) => void
}) {
  const { total, done } = countStoriesByVersion(stories, version.id)
  const versionSprints = sprints.filter((sprint) => sprint.versionId === version.id)
  const versionEpics = epicsForVersion(version.id, epics, stories)
  const progress = total > 0 ? Math.round((done / total) * 100) : 0

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
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <GitBranch className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <h2 className={typeScale.sectionTitle}>
                {version.id} — {version.title}
              </h2>
            </div>
            <p className={cn(typeScale.caption, "mt-1 tabular-nums")}>
              {done}/{total} US · {progress}% · {version.status}
              {!expanded ? " · recolhida" : null}
            </p>
          </div>
        </button>
        <div className="flex shrink-0 items-center gap-2">
          <Badge variant={version.status === "planned" ? "outline" : "secondary"}>
            {version.status}
          </Badge>
          <button
            aria-label={`Abrir documento ${version.id}`}
            className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            onClick={(event) => {
              event.stopPropagation()
              onOpenVersion(version)
            }}
            type="button"
          >
            <FileText className="size-3.5" aria-hidden />
            Ler doc
          </button>
        </div>
      </div>

      {expanded && versionSprints.length > 0 ? (
        <div className="border-b border-border/60 px-4 py-3">
          <p className={cn(typeScale.label, "mb-2")}>Sprints</p>
          <div className="flex flex-wrap gap-2">
            {versionSprints.map((sprint) => (
              <button
                className="rounded-full border border-border bg-muted/30 px-3 py-1.5 text-left text-xs font-medium text-foreground transition-colors hover:bg-muted/60"
                key={sprint.id}
                onClick={() => onOpenSprint(sprint)}
                type="button"
              >
                <span className="font-mono">{sprint.id}</span>
                <span className="text-muted-foreground"> · {sprint.status}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {expanded && versionEpics.length > 0 ? (
        <div className="px-2 py-2">
          <p className={cn(typeScale.label, "px-2 pb-1")}>Épicos</p>
          {versionEpics.map((epic) => {
            const {
              done: epicDone,
              total: epicTotal,
              progress: epicProgressPct,
            } = epicProgress(stories, epic.id, version.id)

            if (epicTotal === 0) {
              return null
            }

            return (
              <button
                className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-muted/40"
                key={epic.id}
                onClick={() => onOpenEpic(epic, version.id)}
                type="button"
              >
                <div className="min-w-0">
                  <p className="font-mono text-xs font-semibold text-primary">
                    {epic.id}
                  </p>
                  <p className={cn(typeScale.bodySm, "truncate text-foreground")}>
                    {epic.title}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={typeScale.caption}>
                    {epicDone}/{epicTotal} · {epicProgressPct}%
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </button>
            )
          })}
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
  const [expandedVersionIds, setExpandedVersionIds] = useState<Set<string>>(
    () => new Set(resolveDefaultSelectedVersions(versions, stories)),
  )
  const [sheetTarget, setSheetTarget] = useState<DeliverableSheetTarget | null>(null)

  const catalogVersions = useMemo(() => sortVersionsDesc(versions), [versions])

  useEffect(() => {
    const versionIds = catalogVersions.map((version) => version.id)

    if (versionIds.length === 0) {
      setExpandedVersionIds(new Set())
      return
    }

    setExpandedVersionIds((previous) => {
      const pruned = new Set(
        [...previous].filter((versionId) => versionIds.includes(versionId)),
      )

      if (pruned.size > 0) {
        return pruned
      }

      return new Set(resolveDefaultSelectedVersions(versions, stories))
    })
  }, [catalogVersions, stories, versions])

  const toggleExpanded = (versionId: string) => {
    setExpandedVersionIds((previous) => {
      const next = new Set(previous)

      if (next.has(versionId)) {
        next.delete(versionId)
        return next
      }

      next.add(versionId)
      return next
    })
  }

  const orphans = epics.filter(
    (epic) =>
      !versions.some((version) =>
        epicsForVersion(version.id, [epic], stories).some(
          (item) => item.id === epic.id,
        ),
      ),
  )

  const openSheet = (target: DeliverableSheetTarget) => setSheetTarget(target)

  return (
    <div className="space-y-4">
      {catalogVersions.map((version) => (
        <VersionBlock
          epics={epics}
          expanded={expandedVersionIds.has(version.id)}
          key={version.id}
          onOpenEpic={(epic, versionId) =>
            openSheet({ kind: "epic", item: epic, versionId })
          }
          onOpenSprint={(sprint) => openSheet({ kind: "sprint", item: sprint })}
          onOpenVersion={(item) => openSheet({ kind: "version", item })}
          onToggleExpanded={() => toggleExpanded(version.id)}
          sprints={sprints}
          stories={stories}
          version={version}
        />
      ))}

      {orphans.length > 0 ? (
        <section className="rounded-xl border border-border bg-card px-2 py-2">
          <div className="flex items-center gap-2 px-2 py-2">
            <Layers className="h-4 w-4 text-primary" />
            <h3 className={typeScale.cardTitle}>Outros épicos</h3>
          </div>
          {orphans.map((epic) => {
            const { total, done } = countStoriesByEpic(stories, epic.id)

            return (
              <button
                className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-muted/40"
                key={epic.id}
                onClick={() => openSheet({ kind: "epic", item: epic, versionId: "—" })}
                type="button"
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
              </button>
            )
          })}
        </section>
      ) : null}

      <DeliverableSheet
        onOpenChange={(open) => {
          if (!open) {
            setSheetTarget(null)
          }
        }}
        open={sheetTarget !== null}
        stories={stories}
        target={sheetTarget}
      />
    </div>
  )
}
