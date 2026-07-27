import type { UserStory } from "./domain/types.js"
import type { GraphEdge, GraphModel, GraphNode } from "./domain/graph-model.js"

export type DeliveryGraphFilters = {
  version?: string | "All"
  sprint?: string | "All"
}

export function filterStoriesForDeliveryGraph(
  stories: UserStory[],
  filters: DeliveryGraphFilters = {},
): UserStory[] {
  const version = filters.version && filters.version !== "All" ? filters.version : undefined
  const sprint = filters.sprint && filters.sprint !== "All" ? filters.sprint : undefined
  return stories.filter((s) => {
    if (version && s.version !== version) {
      return false
    }
    if (sprint && (s.sprint ?? "") !== sprint) {
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
  const sprints = [
    ...new Set(stories.map((s) => s.sprint).filter((s): s is string => Boolean(s))),
  ].sort()
  return { versions, sprints }
}
