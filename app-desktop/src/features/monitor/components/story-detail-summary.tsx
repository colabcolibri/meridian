import { Badge } from "@/components/ui/badge"
import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import type { Epic, UserStory } from "@/domain/meridian/types"
import { LinkedStoriesList } from "@/features/monitor/components/linked-stories-list"
import { typeScale } from "@/features/monitor/monitor-typography"

export function storyDetailBadges(story: UserStory) {
  return (
    <>
      <Badge variant="outline">{story.version}</Badge>
      <Badge variant="secondary">{story.moscow}</Badge>
      <Badge variant="outline">{story.status}</Badge>
    </>
  )
}

export function StoryDetailSummary({
  story,
  epic,
  storyIssues,
  stories,
  onSelectDependency,
}: {
  story: UserStory
  epic: Epic | undefined
  storyIssues: MonitorIssue[]
  stories: UserStory[]
  onSelectDependency: (dependency: UserStory) => void
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className={typeScale.label}>Delivery (done_when)</p>
        <p className={typeScale.bodySm}>{story.doneWhen}</p>
      </div>

      <div className="space-y-1">
        <p className={typeScale.label}>Epic</p>
        <p className={typeScale.bodySm}>
          <span className="font-mono font-semibold text-primary">{story.epic}</span>
          {epic ? ` — ${epic.title}` : null}
        </p>
      </div>

      <LinkedStoriesList
        label="Depends on — tap to open detail"
        onSelectStory={onSelectDependency}
        stories={stories}
        storyIds={story.dependsOn}
      />

      {storyIssues.length > 0 ? (
        <div className="space-y-2">
          <p className={typeScale.label}>Alerts</p>
          <ul className="space-y-1">
            {storyIssues.map((issue, index) => (
              <li className="text-sm text-destructive" key={`${issue.file}-${index}`}>
                {issue.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
