import type { UserStory } from "./types.js"

export function sortVersionIdsDesc(ids: string[]): string[] {
  return [...ids].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
}

export function sortVersionIdsAsc(ids: string[]): string[] {
  return [...ids].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

export function versionIdsFromStories(stories: UserStory[]): string[] {
  return sortVersionIdsDesc([...new Set(stories.map((s) => s.version))])
}

/** Board default: latest version only. */
export function defaultSelectedVersionIds(versionIds: string[]): string[] {
  return versionIds.length > 0 ? [versionIds[0]] : []
}

/** Sprints/Epics default: all versions selected, oldest-first order. */
export function allSelectedVersionIds(versionIds: string[]): string[] {
  return sortVersionIdsAsc(versionIds)
}

export function filterStoriesByVersions(
  stories: UserStory[],
  selected: ReadonlySet<string>,
): UserStory[] {
  if (selected.size === 0) {
    return []
  }
  return stories.filter((s) => selected.has(s.version))
}

export function epicIdsForStories(stories: UserStory[]): string[] {
  return [...new Set(stories.map((s) => s.epic))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  )
}
