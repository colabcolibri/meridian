import { FileText, X } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { monitorSheetLayout } from "@/features/monitor/components/monitor-sheet-layout"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

export type MonitorSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Título principal (SheetTitle / acessibilidade). */
  title: ReactNode
  /** Linha pequena acima do título (ex.: data · hora). */
  eyebrow?: ReactNode
  /** Linha abaixo do título (ex.: caminho do arquivo · pasta). */
  subtitle?: ReactNode
  badges?: ReactNode
  /** Bloco fixo entre header e corpo rolável (resumo, progresso, lista de US). */
  summary?: ReactNode
  children?: ReactNode
  showDocumentIcon?: boolean
  titleClassName?: string
  /** Quando false (sheet pai com filha aberta), não bloqueia cliques na sheet empilhada. */
  modal?: boolean
  allowOutsideDismiss?: boolean
  onCloseClick?: () => void
  side?: ComponentProps<typeof SheetContent>["side"]
  contentClassName?: string
}

function sheetDismissBlockers(
  block: boolean,
): Pick<
  ComponentProps<typeof SheetContent>,
  "onEscapeKeyDown" | "onInteractOutside" | "onPointerDownOutside"
> {
  const prevent = (event: Event) => {
    if (block) {
      event.preventDefault()
    }
  }

  return {
    onEscapeKeyDown: prevent,
    onInteractOutside: prevent,
    onPointerDownOutside: prevent,
  }
}

function MonitorSheetCloseButton({
  onClick,
  label = "Close",
}: {
  onClick: () => void
  label?: string
}) {
  return (
    <button
      aria-label={label}
      className="absolute top-3 right-3 z-10 rounded-md opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-3 focus:ring-ring/50 focus:outline-none"
      onClick={onClick}
      type="button"
    >
      <X className="size-5" />
      <span className="sr-only">{label}</span>
    </button>
  )
}

/**
 * Template de sheet do monitor: tamanhos, header (title/eyebrow/subtitle/badges),
 * summary opcional e corpo em ScrollArea. Use este componente em vez de montar Sheet manualmente.
 */
export function MonitorSheet({
  open,
  onOpenChange,
  title,
  eyebrow,
  subtitle,
  badges,
  summary,
  children,
  showDocumentIcon = true,
  titleClassName = typeScale.panelTitle,
  modal = true,
  allowOutsideDismiss = true,
  onCloseClick,
  side = "right",
  contentClassName,
}: MonitorSheetProps) {
  return (
    <Sheet modal={modal} onOpenChange={onOpenChange} open={open}>
      <SheetContent
        className={cn(monitorSheetLayout.content, contentClassName)}
        showCloseButton={!onCloseClick}
        side={side}
        {...sheetDismissBlockers(!allowOutsideDismiss)}
      >
        {onCloseClick ? <MonitorSheetCloseButton onClick={onCloseClick} /> : null}

        <SheetHeader className={monitorSheetLayout.header}>
          {eyebrow ? (
            <SheetDescription className={typeScale.caption}>{eyebrow}</SheetDescription>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            {showDocumentIcon ? (
              <FileText className="size-5 shrink-0 text-primary" aria-hidden />
            ) : null}
            <SheetTitle className={titleClassName}>{title}</SheetTitle>
            {badges}
          </div>
          {subtitle ? (
            <SheetDescription
              className={cn(typeScale.caption, "font-mono text-muted-foreground")}
            >
              {subtitle}
            </SheetDescription>
          ) : null}
        </SheetHeader>

        <ScrollArea className={monitorSheetLayout.bodyScroll}>
          {summary ? (
            <section className={monitorSheetLayout.summary}>{summary}</section>
          ) : null}
          {children}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
