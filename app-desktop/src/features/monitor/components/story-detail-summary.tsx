import { Badge } from "@/components/ui/badge"
import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import type { Epic, UserStory } from "@/domain/meridian/types"
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
}: {
  story: UserStory
  epic: Epic | undefined
  storyIssues: MonitorIssue[]
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

      {story.dependsOn.length > 0 ? (
        <div className="space-y-1">
          <p className={typeScale.label}>Depends on</p>
          <p className={typeScale.bodySm}>{story.dependsOn.join(", ")}</p>
        </div>
      ) : null}

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
