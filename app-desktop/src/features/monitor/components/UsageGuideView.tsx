import { useState } from "react"

import { AlertTriangle, BookOpen, ChevronDown, Compass } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  GuideAccordionSection,
  OpenFolderCallout,
  SlashCommandsTable,
} from "@/features/monitor/components/guide-components"
import {
  slashCommandReference,
  usageAntiPatterns,
  usageGuideIntro,
  usageGuideSections,
  usageSituations,
  validateProjectHint,
} from "@/features/monitor/content/meridian-concepts"
import { monitorPanelClass } from "@/features/monitor/monitor-ui"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

export function UsageGuideView() {
  const [referenceOpen, setReferenceOpen] = useState(false)
  const [cautionsOpen, setCautionsOpen] = useState(false)

  return (
    <div className="w-full max-w-none space-y-8">
      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-meridian" aria-hidden />
          <h2 className={typeScale.pageTitle}>{usageGuideIntro.title}</h2>
        </div>
        <p className="text-lg font-medium leading-relaxed text-foreground">
          {usageGuideIntro.lead}
        </p>
        <div className="space-y-2">
          {usageGuideIntro.paragraphs.map((paragraph) => (
            <p className={typeScale.body} key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </header>

      <section className={cn(monitorPanelClass, "p-4 sm:p-5")}>
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-meridian" aria-hidden />
          <h3 className={typeScale.sectionTitle}>Where am I?</h3>
        </div>
        <p className={cn(typeScale.bodySm, "mt-2 text-muted-foreground")}>
          Open the section that matches your situation — you do not need to read
          everything.
        </p>
        <ul className="mt-4 space-y-2">
          {usageSituations.map((item) => (
            <li
              className="flex flex-col gap-1 rounded-lg border border-border bg-muted/20 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
              key={item.situation}
            >
              <span className={typeScale.body}>{item.situation}</span>
              <span className="flex shrink-0 flex-wrap items-center gap-2">
                <span className={cn(typeScale.label, "text-meridian")}>
                  → {item.section}
                </span>
                {item.command ? (
                  <code className="rounded border border-border bg-background px-2 py-0.5 font-mono text-xs">
                    {item.command}
                  </code>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="space-y-3">
        {usageGuideSections.map((section) => (
          <GuideAccordionSection key={section.id} section={section} />
        ))}
      </div>

      <Collapsible
        className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
        onOpenChange={setReferenceOpen}
        open={referenceOpen}
      >
        <CollapsibleTrigger
          className={cn(
            "group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors sm:px-5",
            "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            "data-[state=open]:border-b data-[state=open]:border-border",
          )}
        >
          <div className="min-w-0 flex-1">
            <h3 className={typeScale.sectionTitle}>Command reference</h3>
            <p className={cn(typeScale.caption, "mt-0.5")}>
              Slash commands in the Cursor chat
            </p>
          </div>
          <ChevronDown
            className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
            aria-hidden
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 sm:p-5">
          <SlashCommandsTable commands={slashCommandReference} />
        </CollapsibleContent>
      </Collapsible>

      <Collapsible
        className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
        onOpenChange={setCautionsOpen}
        open={cautionsOpen}
      >
        <CollapsibleTrigger
          className={cn(
            "group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors sm:px-5",
            "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            "data-[state=open]:border-b data-[state=open]:border-border",
          )}
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" aria-hidden />
          <div className="min-w-0 flex-1">
            <h3 className={typeScale.sectionTitle}>Validate and avoid mistakes</h3>
            <p className={cn(typeScale.caption, "mt-0.5")}>
              Validation script and common anti-patterns
            </p>
          </div>
          <ChevronDown
            className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
            aria-hidden
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 p-4 sm:p-5">
          <div>
            <p className={typeScale.label}>{validateProjectHint.title}</p>
            <code className="mt-2 block overflow-x-auto rounded-lg border border-border bg-muted/40 px-4 py-3 font-mono text-sm">
              {validateProjectHint.command}
            </code>
            <p className={cn(typeScale.bodySm, "mt-2")}>{validateProjectHint.note}</p>
          </div>
          <ul className={cn(typeScale.body, "list-disc space-y-2 pl-5")}>
            {usageAntiPatterns.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>

      <OpenFolderCallout />
    </div>
  )
}
