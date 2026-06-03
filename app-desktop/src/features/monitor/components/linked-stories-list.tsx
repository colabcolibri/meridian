import { useMemo } from "react"

import type { UserStory } from "@/domain/meridian/types"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

export function LinkedStoriesList({
  storyIds,
  stories,
  label,
  onSelectStory,
}: {
  storyIds: string[]
  stories: UserStory[]
  label: string
  onSelectStory: (story: UserStory) => void
}) {
  const storyById = useMemo(
    () => new Map(stories.map((story) => [story.id, story])),
    [stories],
  )

  if (storyIds.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <p className={typeScale.label}>{label}</p>
      <ul className="space-y-1.5">
        {storyIds.map((storyId) => {
          const story = storyById.get(storyId)

          return (
            <li key={storyId}>
              <button
                className={cn(
                  "group w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
                  story
                    ? "cursor-pointer border-primary/25 bg-background shadow-sm hover:border-primary hover:bg-primary/5 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    : "cursor-not-allowed border-border/80 opacity-60",
                )}
                disabled={!story}
                onClick={(event) => {
                  event.stopPropagation()
                  if (story) {
                    onSelectStory(story)
                  }
                }}
                type="button"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-primary">
                    {storyId}
                  </span>
                  {story ? (
                    <span
                      aria-hidden
                      className={cn(
                        typeScale.caption,
                        "shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
                      )}
                    >
                      Open →
                    </span>
                  ) : null}
                </span>
                {story ? (
                  <span
                    className={cn(typeScale.bodySm, "mt-0.5 block text-foreground")}
                  >
                    {story.title}
                  </span>
                ) : (
                  <span
                    className={cn(
                      typeScale.caption,
                      "mt-0.5 block text-muted-foreground",
                    )}
                  >
                    Story not loaded in monitor
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
