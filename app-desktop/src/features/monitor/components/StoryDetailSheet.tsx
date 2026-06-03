import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import type { Epic, UserStory } from "@/domain/meridian/types"
import { MarkdownDocSheet } from "@/features/monitor/components/MarkdownDocSheet"
import {
  StoryDetailSummary,
  storyDetailBadges,
} from "@/features/monitor/components/story-detail-summary"

export function StoryDetailSheet({
  story,
  epic,
  storyIssues,
  open,
  onOpenChange,
}: {
  story: UserStory | null
  epic: Epic | undefined
  storyIssues: MonitorIssue[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!story) {
    return null
  }

  return (
    <MarkdownDocSheet
      hideFrontmatter
      badges={storyDetailBadges(story)}
      docPath={`us/${story.id}.md`}
      onOpenChange={onOpenChange}
      open={open}
      subtitle={story.epic}
      summary={
        <StoryDetailSummary epic={epic} story={story} storyIssues={storyIssues} />
      }
      title={`${story.id} — ${story.title}`}
    />
  )
}
