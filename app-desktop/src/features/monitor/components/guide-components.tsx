import { ChevronDown, FolderOpen, Loader2, type LucideIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"
import {
  type AnatomyGuide,
  type ConceptBlock,
  type DailyWorkflowStep,
  type GuideSubsection,
  type SlashCommandGroup,
  type SlashCommandHint,
  type UsageGuideSection,
} from "@/features/monitor/content/meridian-concepts"
import { monitorPanelClass } from "@/features/monitor/monitor-ui"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

export function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="w-full max-w-none space-y-3">
      {paragraphs.map((paragraph) => (
        <p className={typeScale.body} key={paragraph}>
          {paragraph}
        </p>
      ))}
    </div>
  )
}

export function ConceptCard({
  block,
  icon: Icon,
}: {
  block: ConceptBlock
  icon: LucideIcon
}) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 shrink-0 text-meridian" aria-hidden />
          <CardTitle className={typeScale.cardTitle}>{block.title}</CardTitle>
        </div>
        <CardDescription className={cn(typeScale.bodySm, "text-muted-foreground")}>
          {block.summary}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

export function GuideBlock({ section }: { section: GuideSubsection }) {
  return (
    <article className={cn(monitorPanelClass, "p-5 sm:p-6")}>
      <h4 className={typeScale.cardTitle}>{section.title}</h4>
      <div className="mt-3 space-y-3">
        {section.paragraphs.map((p) => (
          <p className={typeScale.body} key={p}>
            {p}
          </p>
        ))}
      </div>
      {section.bullets?.length ? (
        <ul className={cn(typeScale.body, "mt-4 list-disc space-y-2 pl-5")}>
          {section.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}

export function WorkflowStepCard({
  step,
  compact = false,
}: {
  step: DailyWorkflowStep
  compact?: boolean
}) {
  return (
    <article
      className={cn(
        compact ? "rounded-lg border border-border bg-muted/15 p-4" : monitorPanelClass,
        !compact && "p-5 sm:p-6",
      )}
    >
      <h4 className={compact ? typeScale.label : typeScale.cardTitle}>{step.title}</h4>
      <p className={cn(typeScale.bodySm, "mt-1 text-muted-foreground")}>{step.when}</p>
      <ul className={cn(typeScale.body, "mt-3 list-disc space-y-1.5 pl-5")}>
        {step.actions.map((action) => (
          <li key={action}>{action}</li>
        ))}
      </ul>
      {step.commands?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {step.commands.map((cmd) => (
            <code
              className="rounded-md border border-border bg-muted/50 px-2.5 py-1 font-mono text-sm"
              key={cmd}
            >
              {cmd}
            </code>
          ))}
        </div>
      ) : null}
      {step.tip ? (
        <p
          className={cn(
            typeScale.bodySm,
            "mt-3 rounded-lg bg-meridian-muted/30 px-3 py-2 text-foreground",
          )}
        >
          {step.tip}
        </p>
      ) : null}
    </article>
  )
}

export function ConceptAccordion({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: {
  title: string
  subtitle?: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Collapsible
      className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
      onOpenChange={setOpen}
      open={open}
    >
      <CollapsibleTrigger
        className={cn(
          "group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors sm:px-5",
          "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          "data-[state=open]:border-b data-[state=open]:border-border",
        )}
      >
        <div className="min-w-0 flex-1">
          <h3 className={typeScale.sectionTitle}>{title}</h3>
          {subtitle ? (
            <p className={cn(typeScale.caption, "mt-0.5")}>{subtitle}</p>
          ) : null}
        </div>
        <ChevronDown
          className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 sm:p-5">{children}</CollapsibleContent>
    </Collapsible>
  )
}

export function AnatomyCard({ guide }: { guide: AnatomyGuide }) {
  return (
    <article className="rounded-lg border border-border bg-muted/15 p-4 sm:p-5">
      <h4 className={typeScale.cardTitle}>{guide.title}</h4>
      <p className={cn(typeScale.bodySm, "mt-2")}>{guide.intro}</p>
      <dl className="mt-4 space-y-2">
        {guide.fields.map((item) => (
          <div className="grid gap-1 sm:grid-cols-[8rem_1fr]" key={item.field}>
            <dt>
              <code className="font-mono text-xs text-meridian">{item.field}</code>
            </dt>
            <dd className={typeScale.bodySm}>{item.meaning}</dd>
          </div>
        ))}
      </dl>
      {guide.sections && guide.sections.length > 0 ? (
        <dl className="mt-4 space-y-2 border-t border-border pt-4">
          {guide.sections.map((s) => (
            <div className="grid gap-1 sm:grid-cols-[12rem_1fr]" key={s.heading}>
              <dt>
                <code className="font-mono text-xs text-meridian">{s.heading}</code>
              </dt>
              <dd className={typeScale.bodySm}>{s.description}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {guide.exampleTitle ? (
        <div className="mt-4 rounded-lg border border-meridian-border bg-meridian-muted/20 px-3 py-3">
          <p className={typeScale.label}>{guide.exampleTitle}</p>
          {guide.exampleBody ? (
            <p className={cn(typeScale.bodySm, "mt-1.5")}>{guide.exampleBody}</p>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}

export function GuideAccordionSection({
  section,
  stepCount,
  open: controlledOpen,
  onOpenChange,
}: {
  section: UsageGuideSection
  stepCount?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = useState(section.defaultOpen ?? false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const handleChange = onOpenChange ?? setInternalOpen
  const count = stepCount ?? section.steps.length

  return (
    <Collapsible
      className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
      onOpenChange={handleChange}
      open={open}
    >
      <CollapsibleTrigger
        className={cn(
          "group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors sm:px-5",
          "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          "data-[state=open]:border-b data-[state=open]:border-border",
        )}
      >
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-meridian-muted text-sm font-semibold text-meridian"
        >
          {count}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className={typeScale.sectionTitle}>{section.title}</h3>
          <p className={cn(typeScale.caption, "mt-0.5")}>{section.subtitle}</p>
        </div>
        <ChevronDown
          className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="space-y-3 p-4 sm:p-5">
          {section.steps.map((step) => (
            <WorkflowStepCard compact key={step.id} step={step} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function SlashCommandGroupedTable({ groups }: { groups: SlashCommandGroup[] }) {
  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <div
          key={group.group}
          className="overflow-hidden rounded-xl border border-border"
        >
          <div className="border-b border-border bg-muted/30 px-4 py-2.5 flex items-baseline gap-3">
            <span className={typeScale.label}>{group.group}</span>
            <span className={typeScale.caption}>{group.description}</span>
          </div>
          <table className="w-full min-w-md text-left text-sm">
            <tbody>
              {group.commands.map((item) => (
                <tr className="border-b border-border last:border-0" key={item.command}>
                  <td className="px-4 py-3 align-top w-52 shrink-0">
                    <code className="font-mono text-meridian">{item.command}</code>
                    {item.example ? (
                      <p
                        className={cn(typeScale.caption, "mt-1 text-muted-foreground")}
                      >
                        e.g. <code className="font-mono text-xs">{item.example}</code>
                      </p>
                    ) : null}
                  </td>
                  <td className={cn(typeScale.body, "px-4 py-3 align-top")}>
                    {item.when}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

export function SlashCommandsTable({ commands }: { commands: SlashCommandHint[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-md text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className={cn(typeScale.label, "px-4 py-3")}>Command</th>
            <th className={cn(typeScale.label, "px-4 py-3")}>When to use</th>
          </tr>
        </thead>
        <tbody>
          {commands.map((item) => (
            <tr className="border-b border-border last:border-0" key={item.command}>
              <td className="px-4 py-3 align-top">
                <code className="font-mono text-meridian">{item.command}</code>
                {item.example ? (
                  <p className={cn(typeScale.caption, "mt-1 text-muted-foreground")}>
                    e.g. <code className="font-mono text-xs">{item.example}</code>
                  </p>
                ) : null}
              </td>
              <td className={cn(typeScale.body, "px-4 py-3 align-top")}>{item.when}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function OpenFolderCallout({ className }: { className?: string }) {
  const { folder, openFolder, fsAccessSupported, status } = useProjectFolder()
  const isOpening = status === "opening"

  if (folder) {
    return null
  }

  return (
    <section
      className={cn(
        "rounded-xl border border-meridian-border bg-meridian-muted/30 p-5 sm:p-6",
        className,
      )}
    >
      <h3 className={typeScale.sectionTitle}>Try it with your project</h3>
      <p className={cn(typeScale.body, "mt-2")}>
        Open the <strong className="font-medium text-foreground">docs</strong> folder
        from the repository (e.g.{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
          app-desktop/docs
        </code>
        ) to see real documents, epics, and user stories in the Setup, Deliverables, and
        Board tabs.
      </p>
      <Button
        className="mt-4"
        disabled={!fsAccessSupported || isOpening}
        onClick={() => void openFolder()}
      >
        {isOpening ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FolderOpen className="mr-2 h-4 w-4" />
        )}
        Open docs folder
      </Button>
      {!fsAccessSupported ? (
        <p className={cn(typeScale.caption, "mt-3 text-amber-800")}>
          Use Chrome or Edge on localhost to open folders on your computer.
        </p>
      ) : null}
    </section>
  )
}
