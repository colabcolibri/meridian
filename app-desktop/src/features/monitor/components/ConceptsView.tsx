import {
  BookOpen,
  FileText,
  GitBranch,
  GitCommit,
  ListChecks,
  Milestone,
  Rocket,
  Settings,
  Users,
  Zap,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { SetupStateLegend } from "@/features/monitor/components/SetupStateLegend"
import {
  AnatomyCard,
  ConceptAccordion,
  ConceptCard,
  OpenFolderCallout,
  Prose,
} from "@/features/monitor/components/guide-components"
import { MermaidDiagram } from "@/features/monitor/components/MermaidDiagram"
import {
  audiences,
  corePrinciples,
  decisionLogAnatomy,
  deliveryArtifacts,
  deliveryArtifactsNote,
  docFlowNote,
  epicAnatomy,
  folderStructure,
  journeyPhases,
  meridianIntro,
  meridianLoop,
  nextStepsAfterConcepts,
  scrumMeridianMap,
  sprintAnatomy,
  statusGuide,
  userStoryAnatomy,
  versionAnatomy,
  type JourneyPhase,
} from "@/features/monitor/content/meridian-concepts"
import { monitorPanelClass } from "@/features/monitor/monitor-ui"
import { typeScale } from "@/features/monitor/monitor-typography"
import { cn } from "@/lib/utils"

const phaseIcons = [Settings, FileText, Milestone, Rocket]

const principleIcons = {
  "spec-first": FileText,
  "human-manager": Users,
  "audit-status": ListChecks,
  "refine-before-code": GitBranch,
  "derived-board": GitCommit,
} as const

function PhaseCard({ phase, index }: { phase: JourneyPhase; index: number }) {
  const Icon = phaseIcons[index] ?? Zap
  return (
    <article className={cn(monitorPanelClass, "flex flex-col gap-3 p-5")}>
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-meridian-muted">
          <Icon className="h-4 w-4 text-meridian" aria-hidden />
        </div>
        <div className="min-w-0">
          <h3 className={typeScale.cardTitle}>{phase.label}</h3>
          <p className={cn(typeScale.caption, "mt-0.5")}>{phase.subtitle}</p>
        </div>
      </div>
      <p className={typeScale.bodySm}>{phase.purpose}</p>
      <ul className="space-y-1.5">
        {phase.documents.map((doc) => (
          <li className="flex gap-2" key={doc}>
            <span aria-hidden className="shrink-0 text-meridian text-sm">
              →
            </span>
            <span className={typeScale.bodySm}>{doc}</span>
          </li>
        ))}
      </ul>
      {phase.gate ? (
        <p className="mt-auto rounded-lg bg-meridian-muted/40 px-3 py-2 text-xs font-medium text-meridian">
          Gate: {phase.gate}
        </p>
      ) : null}
      {phase.note ? (
        <p
          className={cn(
            typeScale.caption,
            "rounded-lg bg-amber-50 px-3 py-2 text-amber-900",
          )}
        >
          {phase.note}
        </p>
      ) : null}
    </article>
  )
}

export function ConceptsView() {
  return (
    <div className="w-full max-w-none space-y-10">
      {/* ── 1. Introduction ─────────────────────────────────────── */}
      <header className="space-y-5">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-meridian" aria-hidden />
          <h2 className={typeScale.pageTitle}>{meridianIntro.title}</h2>
        </div>
        <Prose paragraphs={meridianIntro.paragraphs} />
        <div className="grid gap-3 sm:grid-cols-3">
          {audiences.map((a) => (
            <div
              key={a.id}
              className={cn(monitorPanelClass, "flex flex-col gap-2 p-4")}
            >
              <p className={typeScale.label}>{a.label}</p>
              <p className={cn(typeScale.caption, "leading-relaxed")}>
                {a.description}
              </p>
            </div>
          ))}
        </div>
      </header>

      {/* ── 2. The loop ───────────────────────────────────────────── */}
      <section className="space-y-3">
        <div>
          <h3 className={typeScale.sectionTitle}>{meridianLoop.title}</h3>
          <p className={cn(typeScale.bodySm, "mt-1")}>{meridianLoop.subtitle}</p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <ol className="grid grid-cols-6 divide-x divide-border min-w-[640px]">
            {meridianLoop.steps.map((step, index) => (
              <li key={step.id} className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-meridian text-[11px] font-bold text-white">
                    {index + 1}
                  </span>
                  <span className={typeScale.label}>{step.label}</span>
                </div>
                <p className={cn(typeScale.caption, "leading-relaxed")}>
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 3. Three principles ───────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h3 className={typeScale.sectionTitle}>Three rules that govern everything</h3>
          <p className={cn(typeScale.bodySm, "mt-1")}>
            Every workflow, every gate, every command exists because of these.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {corePrinciples.map((block) => (
            <ConceptCard
              block={block}
              icon={principleIcons[block.id as keyof typeof principleIcons] ?? BookOpen}
              key={block.id}
            />
          ))}
        </div>
      </section>

      {/* ── 4. Scrum ↔ Meridian ───────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h3 className={typeScale.sectionTitle}>{scrumMeridianMap.title}</h3>
          <p className={cn(typeScale.bodySm, "mt-1")}>{scrumMeridianMap.subtitle}</p>
        </div>
        <Prose paragraphs={scrumMeridianMap.paragraphs} />
        <div className={cn(monitorPanelClass, "overflow-x-auto p-4 sm:p-5")}>
          <p className={typeScale.label}>{scrumMeridianMap.flowTitle}</p>
          <div className="mt-3 grid min-w-[520px] grid-cols-2 gap-px rounded-lg border border-border bg-border text-sm">
            <div className="bg-muted/40 px-3 py-2 font-medium">
              {scrumMeridianMap.flowColumns.scrum}
            </div>
            <div className="bg-meridian-muted/30 px-3 py-2 font-medium text-meridian">
              {scrumMeridianMap.flowColumns.meridian}
            </div>
            {scrumMeridianMap.flowRows.map((row) => (
              <div className="contents" key={row.scrum}>
                <div className="bg-card px-3 py-2 text-muted-foreground">
                  {row.scrum}
                </div>
                <div className="bg-card px-3 py-2">{row.meridian}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={cn(monitorPanelClass, "p-4 sm:p-5")}>
          <p className={typeScale.label}>Synthesis diagram</p>
          <MermaidDiagram
            className="mt-4 rounded-lg border border-border bg-card/80 p-3 sm:p-5"
            chart={scrumMeridianMap.mermaidDiagram}
            layoutEngine="elk"
          />
          <p className={cn(typeScale.caption, "mt-3")}>
            Same diagram in kit:{" "}
            <code className="text-meridian">{scrumMeridianMap.kitPaths.map}</code>
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={cn(monitorPanelClass, "p-4 sm:p-5")}>
            <p className={typeScale.label}>{scrumMeridianMap.ceremoniesTitle}</p>
            <ul className="mt-3 space-y-2">
              {scrumMeridianMap.ceremonies.map((c) => (
                <li
                  className="flex flex-col gap-0.5 sm:flex-row sm:gap-3"
                  key={c.ceremony}
                >
                  <span
                    className={cn(typeScale.caption, "shrink-0 font-medium sm:w-36")}
                  >
                    {c.ceremony}
                  </span>
                  <span className={typeScale.bodySm}>{c.meridian}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={cn(monitorPanelClass, "p-4 sm:p-5")}>
            <p className={typeScale.label}>Not in Meridian</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              {scrumMeridianMap.notImported.map((item) => (
                <li className={typeScale.bodySm} key={item}>
                  {item}
                </li>
              ))}
            </ul>
            <p
              className={cn(typeScale.caption, "mt-4 rounded-lg bg-muted/40 px-3 py-2")}
            >
              Optional textbook:{" "}
              <code className="text-meridian">
                {scrumMeridianMap.kitPaths.textbook}
              </code>
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. Four phases — collapsed reference ─────────────────── */}
      <ConceptAccordion
        subtitle="From first file to shipped story — what gets created at each step"
        title="The four phases"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {journeyPhases.map((phase, index) => (
            <PhaseCard index={index} key={phase.id} phase={phase} />
          ))}
        </div>
      </ConceptAccordion>

      {/* ── 6. Document structure (collapsed) ────────────────────── */}
      <ConceptAccordion
        subtitle="The docs/ folder and what lives where"
        title={folderStructure.title}
      >
        <Prose paragraphs={folderStructure.intro} />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {folderStructure.items.map((item) => (
            <div
              className="rounded-xl border border-border bg-muted/20 p-4"
              key={item.path}
            >
              <code className="font-mono text-xs text-meridian">{item.path}</code>
              <p className={cn(typeScale.label, "mt-2")}>{item.label}</p>
              <p className={cn(typeScale.bodySm, "mt-1.5")}>{item.description}</p>
            </div>
          ))}
        </div>
        <p className={cn(typeScale.caption, "mt-4 rounded-lg bg-muted/40 px-3 py-2")}>
          {docFlowNote}
        </p>
      </ConceptAccordion>

      {/* ── 7. Delivery artifacts ─────────────────────────────────── */}
      <ConceptAccordion
        subtitle="Epic, version, sprint, user story — what each one is for"
        title="Delivery artifacts"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {deliveryArtifacts.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <p className={typeScale.label}>{a.artifact}</p>
                <code className="font-mono text-[11px] text-meridian">{a.path}</code>
              </div>
              <p className={cn(typeScale.caption, "text-muted-foreground italic")}>
                {a.question}
              </p>
              <p className={typeScale.bodySm}>{a.description}</p>
            </div>
          ))}
        </div>
        <p className={cn(typeScale.caption, "mt-3 rounded-lg bg-muted/40 px-3 py-2")}>
          {deliveryArtifactsNote}
        </p>
      </ConceptAccordion>

      {/* ── 8. Anatomy of each artifact (collapsed) ──────────────── */}
      <ConceptAccordion
        subtitle="Every field and section explained — open when you need the detail"
        title="Anatomy of each artifact"
      >
        <p className={cn(typeScale.bodySm, "mb-4")}>
          Each artifact is a Markdown file with YAML frontmatter and a structured body.
          Here is what every field and section means.
        </p>
        <div className="space-y-4">
          <AnatomyCard guide={epicAnatomy} />
          <AnatomyCard guide={versionAnatomy} />
          <AnatomyCard guide={sprintAnatomy} />
          <AnatomyCard guide={userStoryAnatomy} />
          <AnatomyCard guide={decisionLogAnatomy} />
        </div>
      </ConceptAccordion>

      {/* ── 9. Status reference (collapsed) ──────────────────────── */}
      <ConceptAccordion
        subtitle="Phase docs, epics, versions, sprints, and user stories"
        title={statusGuide.title}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-xl border border-border p-5">
              <p className={typeScale.label}>Phase documents (00–08 and 11)</p>
              <ul className="mt-3 space-y-3">
                {statusGuide.documentStatuses.map((s) => (
                  <li className="flex gap-3 items-start" key={s.label}>
                    <Badge variant="outline" className="shrink-0 mt-0.5">
                      {s.label}
                    </Badge>
                    <span className={typeScale.bodySm}>{s.meaning}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t pt-4">
                <SetupStateLegend />
              </div>
            </div>
            <div className="rounded-xl border border-border p-5">
              <p className={typeScale.label}>Epics (docs/epics/)</p>
              <ul className="mt-3 space-y-3">
                {statusGuide.epicStatuses.map((s) => (
                  <li className="flex gap-3 items-start" key={s.label}>
                    <Badge variant="outline" className="shrink-0 mt-0.5">
                      {s.label}
                    </Badge>
                    <span className={typeScale.bodySm}>{s.meaning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-border p-5">
              <p className={typeScale.label}>Versions (docs/versions/)</p>
              <ul className="mt-3 space-y-3">
                {statusGuide.versionStatuses.map((s) => (
                  <li className="flex gap-3 items-start" key={s.label}>
                    <Badge variant="outline" className="shrink-0 mt-0.5">
                      {s.label}
                    </Badge>
                    <span className={typeScale.bodySm}>{s.meaning}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border p-5">
              <p className={typeScale.label}>Sprints (docs/sprints/)</p>
              <ul className="mt-3 space-y-3">
                {statusGuide.sprintStatuses.map((s) => (
                  <li className="flex gap-3 items-start" key={s.label}>
                    <Badge variant="outline" className="shrink-0 mt-0.5">
                      {s.label}
                    </Badge>
                    <span className={typeScale.bodySm}>{s.meaning}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border p-5">
              <p className={typeScale.label}>User stories</p>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {statusGuide.storyStatuses.map((s) => (
                  <li className="flex gap-3" key={s.emoji}>
                    <span aria-hidden className="text-lg leading-none shrink-0">
                      {s.emoji}
                    </span>
                    <div>
                      <p className={typeScale.label}>{s.label}</p>
                      <p className={typeScale.bodySm}>{s.meaning}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <p className={cn(typeScale.bodySm, "mt-4 rounded-lg bg-muted/40 px-3 py-2")}>
          {statusGuide.kanbanNote}
        </p>
      </ConceptAccordion>

      {/* ── 10. Next step ─────────────────────────────────────────── */}
      <section className="space-y-3 rounded-xl border border-meridian-border bg-meridian-muted/20 p-5 sm:p-6">
        <h3 className={typeScale.sectionTitle}>{nextStepsAfterConcepts.title}</h3>
        <Prose paragraphs={nextStepsAfterConcepts.paragraphs} />
      </section>

      <OpenFolderCallout />
    </div>
  )
}
