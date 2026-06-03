import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import { issuesForTarget } from "@/domain/meridian/protocol-validators"
import type { Epic, ProductVersion, Sprint, UserStory } from "@/domain/meridian/types"
import { countStoriesByEpic } from "@/domain/meridian/validators"
import { LinkedStoriesList } from "@/features/monitor/components/linked-stories-list"
import { MarkdownDocSheet } from "@/features/monitor/components/MarkdownDocSheet"
import { StoryDetailSheet } from "@/features/monitor/components/StoryDetailSheet"
import { typeScale } from "@/features/monitor/monitor-typography"
import { countStoryProgress } from "@/features/monitor/version-filter"

export type DeliverableSheetTarget =
  | { kind: "version"; item: ProductVersion }
  | { kind: "epic"; item: Epic; versionId: string }
  | { kind: "sprint"; item: Sprint }

function epicProgressInVersion(
  stories: UserStory[],
  epicId: string,
  versionId: string,
) {
  return countStoryProgress(
    stories.filter((story) => story.epic === epicId && story.version === versionId),
  )
}

export function DeliverableDocSheet({
  target,
  stories,
  epics,
  issues,
  open,
  onOpenChange,
}: {
  target: DeliverableSheetTarget | null
  stories: UserStory[]
  epics: Epic[]
  issues: MonitorIssue[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [nestedStory, setNestedStory] = useState<UserStory | null>(null)

  const epicById = useMemo(
    () => Object.fromEntries(epics.map((epic) => [epic.id, epic])),
    [epics],
  )

  useEffect(() => {
    if (!open || target?.kind !== "sprint") {
      setNestedStory(null)
    }
  }, [open, target])

  const closeNestedStory = () => setNestedStory(null)

  if (!target) {
    return null
  }

  if (target.kind === "version") {
    const version = target.item
    const { total, done, progress } = countStoryProgress(
      stories.filter((story) => story.version === version.id),
    )

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
              Progress: {done}/{total} stories ({progress}%)
            </p>
          </div>
        }
        title={`${version.id} — ${version.title}`}
      />
    )
  }

  if (target.kind === "sprint") {
    const sprint = target.item

    const closeSprintSheet = () => {
      setNestedStory(null)
      onOpenChange(false)
    }

    const storyOpen = nestedStory !== null

    return (
      <>
        <MarkdownDocSheet
          allowOutsideDismiss={!storyOpen}
          badges={<Badge variant="outline">{sprint.status}</Badge>}
          docPath={`sprints/${sprint.id}.md`}
          modal={!storyOpen}
          onCloseClick={closeSprintSheet}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              closeSprintSheet()
            }
          }}
          open={open}
          subtitle={sprint.versionId}
          summary={
            <LinkedStoriesList
              label="User stories — tap to open detail"
              onSelectStory={setNestedStory}
              stories={stories}
              storyIds={sprint.storyIds}
            />
          }
          title={`${sprint.id} — ${sprint.title}`}
        />

        {nestedStory ? (
          <StoryDetailSheet
            contentClassName="z-[55]"
            epics={epics}
            epic={epicById[nestedStory.epic]}
            issues={issues}
            onOpenChange={(nextOpen) => {
              if (!nextOpen) {
                closeNestedStory()
              }
            }}
            open
            stories={stories}
            story={nestedStory}
            storyIssues={issuesForTarget(issues, nestedStory.id)}
          />
        ) : null}
      </>
    )
  }

  const epic = target.item
  const stats =
    target.versionId === "—"
      ? countStoriesByEpic(stories, epic.id)
      : epicProgressInVersion(stories, epic.id, target.versionId)
  const progress =
    "progress" in stats
      ? stats.progress
      : stats.total > 0
        ? Math.round((stats.done / stats.total) * 100)
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
              ? `Total: ${stats.done}/${stats.total} stories (${progress}%)`
              : `In this version: ${stats.done}/${stats.total} stories (${progress}%)`}
          </p>
        </div>
      }
      title={`${epic.id} — ${epic.title}`}
    />
  )
}
