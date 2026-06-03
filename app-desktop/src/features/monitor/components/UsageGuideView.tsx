import { useCallback, useRef, useState } from "react"

import { AlertTriangle, BookOpen, ChevronRight, Compass, Terminal } from "lucide-react"

import {
  GuideAccordionSection,
  OpenFolderCallout,
  SlashCommandGroupedTable,
} from "@/features/monitor/components/guide-components"
import {
  slashCommandGroups,
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
  // Track which accordion sections are open, keyed by section id
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(usageGuideSections.map((s) => [s.id, s.defaultOpen ?? false])),
  )

  // Refs to each accordion wrapper for scrolling
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const openAndScrollTo = useCallback((sectionId: string) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: true }))
    // Slight delay so the accordion has time to open before scroll
    setTimeout(() => {
      sectionRefs.current[sectionId]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 80)
  }, [])

  return (
    <div className="w-full max-w-none space-y-10">
      {/* ── 1. Header ────────────────────────────────────────────── */}
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

      {/* ── 2. Where am I? — clickable navigation ────────────────── */}
      <section className={cn(monitorPanelClass, "p-5 sm:p-6")}>
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-meridian" aria-hidden />
          <h3 className={typeScale.sectionTitle}>Where am I?</h3>
        </div>
        <p className={cn(typeScale.bodySm, "mt-2")}>
          Click your situation — the right section will open below.
        </p>
        <ul className="mt-4 space-y-2">
          {usageSituations.map((item) => (
            <li key={item.situation}>
              <button
                className={cn(
                  "group w-full rounded-lg border border-border bg-muted/20 px-4 py-3",
                  "flex flex-col gap-1.5 text-left transition-colors",
                  "hover:border-meridian/40 hover:bg-meridian-muted/20",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-meridian/50",
                  "sm:flex-row sm:items-center sm:justify-between",
                )}
                onClick={() => openAndScrollTo(item.sectionId)}
                type="button"
              >
                <span className={typeScale.body}>{item.situation}</span>
                <span className="flex shrink-0 flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      typeScale.label,
                      "text-meridian group-hover:underline",
                    )}
                  >
                    {item.section}
                  </span>
                  {item.command ? (
                    <code className="rounded border border-border bg-background px-2 py-0.5 font-mono text-xs">
                      {item.command}
                    </code>
                  ) : null}
                  <ChevronRight
                    className="h-3.5 w-3.5 text-meridian opacity-60 group-hover:opacity-100"
                    aria-hidden
                  />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 3. Command reference — grouped, always visible ───────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-meridian" aria-hidden />
          <h3 className={typeScale.sectionTitle}>Command reference</h3>
        </div>
        <p className={typeScale.bodySm}>
          Run these in your IDE chat. Commands are order-dependent — the gates in each
          section below tell you when each applies.
        </p>
        <SlashCommandGroupedTable groups={slashCommandGroups} />
      </section>

      {/* ── 4. Workflow sections — controlled accordions ──────────── */}
      <section className="space-y-3">
        <h3 className={typeScale.sectionTitle}>Step by step</h3>
        <p className={typeScale.bodySm}>
          Open the section that matches your current situation — or click your situation
          above.
        </p>
        <div className="space-y-3">
          {usageGuideSections.map((section) => (
            <div
              key={section.id}
              ref={(el) => {
                sectionRefs.current[section.id] = el
              }}
            >
              <GuideAccordionSection
                open={openSections[section.id] ?? false}
                onOpenChange={(open) =>
                  setOpenSections((prev) => ({ ...prev, [section.id]: open }))
                }
                section={section}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Common mistakes — visible warning block ────────────── */}
      <section className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/50 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" aria-hidden />
          <h3 className={cn(typeScale.sectionTitle, "text-amber-900")}>
            Common mistakes to avoid
          </h3>
        </div>
        <ul className="space-y-2">
          {usageAntiPatterns.map((item) => (
            <li className="flex gap-2" key={item}>
              <span aria-hidden className="shrink-0 text-amber-600">
                ✕
              </span>
              <span className={cn(typeScale.bodySm, "text-amber-900")}>{item}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-amber-200 pt-4">
          <p className={cn(typeScale.label, "text-amber-900")}>
            {validateProjectHint.title}
          </p>
          <code className="mt-2 block overflow-x-auto rounded-lg border border-amber-200 bg-white px-4 py-3 font-mono text-sm text-foreground">
            {validateProjectHint.command}
          </code>
          <p className={cn(typeScale.bodySm, "mt-2 text-amber-800")}>
            {validateProjectHint.note}
          </p>
        </div>
      </section>

      <OpenFolderCallout />
    </div>
  )
}
