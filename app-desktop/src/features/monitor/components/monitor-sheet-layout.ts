/**
 * Largura base 2xl (42rem). Usa data-[side=*] para vencer o shadcn
 * (w-3/4 + sm:max-w-sm em ui/sheet) — max-w-2xl solto não sobrescreve.
 */
export const monitorSheetLayout = {
  content: [
    "flex h-full min-w-0 flex-col gap-0 overflow-hidden border-0 bg-background p-0 shadow-xl",
    "data-[side=left]:!w-full data-[side=left]:!max-w-2xl data-[side=left]:sm:!w-2xl data-[side=left]:sm:!max-w-2xl",
    "data-[side=right]:!w-full data-[side=right]:!max-w-2xl data-[side=right]:sm:!w-2xl data-[side=right]:sm:!max-w-2xl",
  ].join(" "),
  header: "shrink-0 gap-1 border-b px-6 py-5 pr-14",
  bodyScroll: "min-h-0 w-full flex-1",
  summary: "w-full border-b bg-muted/30 px-6 py-4",
} as const
