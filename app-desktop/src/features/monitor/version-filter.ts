import type { Epic, ProductVersion, UserStory } from "@/domain/meridian/types"

export function sortVersionIdsDesc(ids: string[]): string[] {
  return [...ids].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
}

export function sortVersionsDesc(versions: ProductVersion[]): ProductVersion[] {
  return [...versions].sort((a, b) =>
    b.id.localeCompare(a.id, undefined, { numeric: true }),
  )
}

export function versionIdsFromCatalog(versions: ProductVersion[]): string[] {
  return sortVersionsDesc(versions).map((version) => version.id)
}

/** @deprecated Prefer versionIdsFromCatalog — mantido para contagens derivadas de US. */
export function versionIdsFromStories(stories: UserStory[]): string[] {
  return sortVersionIdsDesc([...new Set(stories.map((story) => story.version))])
}

export function resolveDefaultSelectedVersions(
  versions: ProductVersion[],
  stories: UserStory[],
): string[] {
  const sorted = sortVersionsDesc(versions)
  const active = sorted.find((version) => version.status === "active")

  if (active) {
    return [active.id]
  }

  const storyVersionIds = new Set(stories.map((story) => story.version))
  const latestWithStories = sorted.find((version) => storyVersionIds.has(version.id))

  if (latestWithStories) {
    return [latestWithStories.id]
  }

  return sorted[0] ? [sorted[0].id] : []
}

export function filterStoriesByVersions(
  stories: UserStory[],
  selectedVersionIds: ReadonlySet<string>,
): UserStory[] {
  if (selectedVersionIds.size === 0) {
    return []
  }

  return stories.filter((story) => selectedVersionIds.has(story.version))
}

export function epicsForVersionFilter(
  epics: Epic[],
  stories: UserStory[],
  selectedVersionIds: ReadonlySet<string>,
): Epic[] {
  const scoped = filterStoriesByVersions(stories, selectedVersionIds)
  const epicIds = new Set(scoped.map((story) => story.epic))

  return epics.filter((epic) => epicIds.has(epic.id))
}

export function allVersionsSelected(
  versionIds: string[],
  selectedVersionIds: ReadonlySet<string>,
): boolean {
  return versionIds.length > 0 && versionIds.every((id) => selectedVersionIds.has(id))
}
