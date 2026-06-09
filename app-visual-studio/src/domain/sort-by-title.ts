export type TitledItem = { id: string; title: string }

/** Primary: title (name). Tie-break: id. */
export function compareByTitleAsc(a: TitledItem, b: TitledItem): number {
  const byTitle = a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
  if (byTitle !== 0) {
    return byTitle
  }
  return a.id.localeCompare(b.id, undefined, { numeric: true })
}

export function sortByTitleAsc<T extends TitledItem>(items: readonly T[]): T[] {
  return [...items].sort(compareByTitleAsc)
}

export function sortStoriesByTitle<
  T extends TitledItem & { id: string },
>(stories: T[]): T[] {
  return sortByTitleAsc(stories)
}
