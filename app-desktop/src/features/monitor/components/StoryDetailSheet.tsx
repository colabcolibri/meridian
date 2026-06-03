import { useEffect, useMemo, useState } from "react"

import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import { issuesForTarget } from "@/domain/meridian/protocol-validators"
import type { Epic, UserStory } from "@/domain/meridian/types"
import { MarkdownDocSheet } from "@/features/monitor/components/MarkdownDocSheet"
import {
  StoryDetailSummary,
  storyDetailBadges,
} from "@/features/monitor/components/story-detail-summary"
import { cn } from "@/lib/utils"

const NESTED_STORY_SHEET_CLASS = "z-[60]"

export function StoryDetailSheet({
  story,
  epic,
  storyIssues,
  stories,
  epics,
  issues,
  open,
  onOpenChange,
  contentClassName,
}: {
  story: UserStory | null
  epic: Epic | undefined
  storyIssues: MonitorIssue[]
  stories: UserStory[]
  epics: Epic[]
  issues: MonitorIssue[]
  open: boolean
  onOpenChange: (open: boolean) => void
  contentClassName?: string
}) {
  const [nestedDependency, setNestedDependency] = useState<UserStory | null>(null)

  const epicById = useMemo(
    () => Object.fromEntries(epics.map((item) => [item.id, item])),
    [epics],
  )

  useEffect(() => {
    if (!open) {
      setNestedDependency(null)
    }
  }, [open])

  if (!story) {
    return null
  }

  const dependencyOpen = nestedDependency !== null

  const closeSheet = () => {
    setNestedDependency(null)
    onOpenChange(false)
  }

  const closeNestedDependency = () => setNestedDependency(null)

  return (
    <>
      <MarkdownDocSheet
        allowOutsideDismiss={!dependencyOpen}
        badges={storyDetailBadges(story)}
        contentClassName={contentClassName}
        docPath={`us/${story.id}.md`}
        hideFrontmatter
        modal={!dependencyOpen}
        onCloseClick={closeSheet}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            closeSheet()
          }
        }}
        open={open}
        subtitle={story.epic}
        summary={
          <StoryDetailSummary
            epic={epic}
            onSelectDependency={setNestedDependency}
            stories={stories}
            story={story}
            storyIssues={storyIssues}
          />
        }
        title={`${story.id} — ${story.title}`}
      />

      {nestedDependency ? (
        <StoryDetailSheet
          contentClassName={cn(NESTED_STORY_SHEET_CLASS, contentClassName)}
          epics={epics}
          epic={epicById[nestedDependency.epic]}
          issues={issues}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              closeNestedDependency()
            }
          }}
          open
          stories={stories}
          story={nestedDependency}
          storyIssues={issuesForTarget(issues, nestedDependency.id)}
        />
      ) : null}
    </>
  )
}
