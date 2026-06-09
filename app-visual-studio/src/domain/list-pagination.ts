/** Default items per page in planning list webviews. */
export const DEFAULT_PAGE_SIZE = 50

export const PAGE_SIZE_OPTIONS = [25, 50, 100] as const

export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number]

export function totalPages(totalItems: number, pageSize: number): number {
  if (totalItems <= 0 || pageSize <= 0) {
    return 1
  }
  return Math.ceil(totalItems / pageSize)
}

export function clampPage(page: number, totalPagesCount: number): number {
  if (totalPagesCount < 1) {
    return 1
  }
  return Math.min(Math.max(1, page), totalPagesCount)
}

export function pageSlice<T>(items: readonly T[], page: number, pageSize: number): T[] {
  const pages = totalPages(items.length, pageSize)
  const safePage = clampPage(page, pages)
  const start = (safePage - 1) * pageSize
  return items.slice(start, start + pageSize)
}

export function pageRange(
  totalItems: number,
  page: number,
  pageSize: number,
): { from: number; to: number; page: number; totalPages: number } {
  const pages = totalPages(totalItems, pageSize)
  const safePage = clampPage(page, pages)
  if (totalItems === 0) {
    return { from: 0, to: 0, page: 1, totalPages: 1 }
  }
  const from = (safePage - 1) * pageSize + 1
  const to = Math.min(safePage * pageSize, totalItems)
  return { from, to, page: safePage, totalPages: pages }
}

export function normalizePageSize(value: unknown): PageSize {
  const n = typeof value === "number" ? value : Number(value)
  if (PAGE_SIZE_OPTIONS.includes(n as PageSize)) {
    return n as PageSize
  }
  return DEFAULT_PAGE_SIZE
}
