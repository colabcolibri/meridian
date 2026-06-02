/**
 * Monitor type scale (hierarchy).
 * Prefer these classes over ad-hoc text-xs/text-sm.
 */
export const typeScale = {
  /** Page title (e.g. project setup) */
  pageTitle: "font-heading text-2xl font-semibold tracking-tight text-foreground",
  /** Phase group: Phase 0, Phase 1… */
  sectionTitle: "font-heading text-xl font-semibold tracking-tight text-foreground",
  /** Group subtitle (Foundation, Product…) */
  sectionSubtitle: "text-base text-muted-foreground",
  /** Phase document card title */
  cardTitle: "font-heading text-lg font-semibold leading-snug text-foreground",
  /** Doc id (00_scope) */
  docId: "font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground",
  /** Primary body — full container width */
  body: "w-full max-w-none text-base leading-relaxed text-muted-foreground",
  /** Secondary body */
  bodySm: "w-full max-w-none text-sm leading-relaxed text-muted-foreground",
  /** Prose in panels (markdown, concepts) */
  prose: "w-full max-w-none text-base leading-relaxed text-foreground",
  /** Short labels and emphasis */
  label: "text-sm font-medium text-foreground",
  /** Metadata, counters, hints */
  caption: "text-sm text-muted-foreground",
  /** Status pills */
  badge: "text-xs font-medium leading-none",
  /** Navigation tabs */
  tab: "text-base font-medium",
  /** Progress number */
  stat: "font-heading text-3xl font-semibold tabular-nums text-foreground",
  /** Sheet / panel title */
  panelTitle: "font-heading text-xl font-semibold text-foreground",
} as const
