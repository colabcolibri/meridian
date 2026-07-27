import type { UserStory } from "./domain/types.js"
import type { GraphEdge, GraphModel, GraphNode } from "./domain/graph-model.js"

export const SPRINT_NONE = "__none__"

export type DeliveryGraphFilters = {
  versions?: ReadonlySet<string>
  sprints?: ReadonlySet<string>
  epics?: ReadonlySet<string>
}

export function sprintKeyForStory(story: UserStory): string {
  return story.sprint ?? SPRINT_NONE
}

export function filterStoriesForDeliveryGraph(
  stories: UserStory[],
  filters: DeliveryGraphFilters = {},
): UserStory[] {
  const { versions, sprints, epics } = filters
  if (versions && versions.size === 0) {
    return []
  }
  if (sprints && sprints.size === 0) {
    return []
  }
  if (epics && epics.size === 0) {
    return []
  }
  return stories.filter((s) => {
    if (versions && versions.size > 0 && !versions.has(s.version)) {
      return false
    }
    if (sprints && sprints.size > 0 && !sprints.has(sprintKeyForStory(s))) {
      return false
    }
    if (epics && epics.size > 0 && !epics.has(s.epic)) {
      return false
    }
    return true
  })
}

/** Nodes = US in scope; edges = dependsOn (story → dependency). */
export function buildDeliveryGraph(
  stories: UserStory[],
  filters: DeliveryGraphFilters = {},
): GraphModel {
  const scoped = filterStoriesForDeliveryGraph(stories, filters)
  const scopedIds = new Set(scoped.map((s) => s.id))
  const nodes: GraphNode[] = scoped.map((s) => ({
    id: s.id,
    label: s.title,
    version: s.version,
    sprint: s.sprint,
    status: s.status,
  }))
  const edges: GraphEdge[] = []
  const seen = new Set<string>()
  for (const story of scoped) {
    for (const dep of story.dependsOn ?? []) {
      if (!scopedIds.has(dep)) {
        continue
      }
      const key = `${story.id}->${dep}`
      if (seen.has(key)) {
        continue
      }
      seen.add(key)
      edges.push({ from: story.id, to: dep })
    }
  }
  nodes.sort((a, b) => a.id.localeCompare(b.id))
  edges.sort((a, b) => `${a.from}${a.to}`.localeCompare(`${b.from}${b.to}`))
  return { nodes, edges }
}

export function listDeliveryFilterOptions(stories: UserStory[]): {
  versions: string[]
  sprints: string[]
} {
  const versions = [...new Set(stories.map((s) => s.version).filter(Boolean))].sort()
  const sprintIds = new Set(stories.map(sprintKeyForStory))
  const sprints = [...sprintIds].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  return { versions, sprints }
}

export function sprintIdsInScope(
  stories: UserStory[],
  selectedVersions: ReadonlySet<string>,
): string[] {
  const ids = new Set(
    stories.filter((s) => selectedVersions.has(s.version)).map(sprintKeyForStory),
  )
  return [...ids].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

export function epicIdsInScope(
  stories: UserStory[],
  selectedVersions: ReadonlySet<string>,
): string[] {
  const ids = new Set(
    stories.filter((s) => selectedVersions.has(s.version)).map((s) => s.epic),
  )
  return [...ids].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

export function deliveryStoriesForGraphPayload(stories: UserStory[]): Array<{
  id: string
  title: string
  version: string
  sprint: string | null
  epic: string
  status: string
  dependsOn: string[]
}> {
  return stories.map((s) => ({
    id: s.id,
    title: s.title,
    version: s.version,
    sprint: s.sprint,
    epic: s.epic,
    status: s.status,
    dependsOn: s.dependsOn ?? [],
  }))
}
