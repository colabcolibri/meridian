/**
 * Escala tipográfica do monitor (hierarquia / type scale).
 * Use estas classes em vez de text-xs/text-sm soltos.
 */
export const typeScale = {
  /** Título de página (ex.: configuração do projeto) */
  pageTitle: "font-heading text-2xl font-semibold tracking-tight text-foreground",
  /** Grupo de fase: Fase 0, Fase 1… */
  sectionTitle: "font-heading text-xl font-semibold tracking-tight text-foreground",
  /** Subtítulo do grupo (Fundação, Produto…) */
  sectionSubtitle: "text-base text-muted-foreground",
  /** Título do card de documento */
  cardTitle: "font-heading text-lg font-semibold leading-snug text-foreground",
  /** Código do doc (00_scope) */
  docId: "font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground",
  /** Corpo principal */
  body: "text-base leading-relaxed text-muted-foreground",
  /** Corpo secundário */
  bodySm: "text-sm leading-relaxed text-muted-foreground",
  /** Rótulos e ênfase curta */
  label: "text-sm font-medium text-foreground",
  /** Metadados, contadores, hints */
  caption: "text-sm text-muted-foreground",
  /** Pills de status */
  badge: "text-xs font-medium leading-none",
  /** Abas de navegação */
  tab: "text-base font-medium",
  /** Número de progresso */
  stat: "font-heading text-3xl font-semibold tabular-nums text-foreground",
  /** Título do sheet / painel */
  panelTitle: "font-heading text-xl font-semibold text-foreground",
} as const
