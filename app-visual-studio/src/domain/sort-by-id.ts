export type IdentifiedItem = { id: string }

/** Primary: id (v0, v4-S2, EPIC-05, US-0094). Numeric segments sort naturally. */
export function compareByIdAsc(a: IdentifiedItem, b: IdentifiedItem): number {
  return a.id.localeCompare(b.id, undefined, { numeric: true })
}

export function sortByIdAsc<T extends IdentifiedItem>(items: readonly T[]): T[] {
  return [...items].sort(compareByIdAsc)
}

export function sortStoriesById<
  T extends IdentifiedItem & { id: string },
>(stories: T[]): T[] {
  return sortByIdAsc(stories)
}
