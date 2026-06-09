import { useState } from "react"

import { Loader2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"
import {
  meridianLoop,
  welcomeHome,
  whatImLearning,
} from "@/features/monitor/content/meridian-concepts"
import { MONITOR_CONTAINER } from "@/features/monitor/monitor-layout"
import { monitorPanelClass } from "@/features/monitor/monitor-ui"
import { typeScale } from "@/features/monitor/monitor-typography"
import type { MonitorView } from "@/features/monitor/monitor-views"
import { cn } from "@/lib/utils"

export function WelcomeScreen({
  onNavigate,
}: {
  onNavigate?: (view: MonitorView) => void
}) {
  const {
    folder,
    isDemoBuild,
    status,
    error,
    openFolder,
    openFolderFromPath,
    storedPath,
  } = useProjectFolder()
  const [value, setValue] = useState(storedPath ?? "")

  if (folder) return null

  const isOpening = status === "opening"

  if (isOpening) {
    return (
      <section
        className={`${MONITOR_CONTAINER} flex flex-col items-center justify-center gap-3 py-16 text-center`}
      >
        <Loader2 className="h-5 w-5 animate-spin text-meridian" aria-hidden />
        <p className={typeScale.bodySm}>Loading Meridian demo project…</p>
      </section>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) openFolderFromPath(trimmed)
  }

  return (
    <section className={`${MONITOR_CONTAINER} py-10 sm:py-14`}>
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-medium text-meridian-muted-foreground">
          {welcomeHome.eyebrow}
        </p>
        <h2 className={cn(typeScale.pageTitle, "mt-2 sm:text-3xl")}>
          {welcomeHome.title}
        </h2>
        <p className={cn(typeScale.bodySm, "mt-3 text-left sm:text-center")}>
          {welcomeHome.lead}
        </p>
      </div>

      <div className={cn(monitorPanelClass, "mx-auto mt-8 max-w-2xl p-4 sm:p-5")}>
        <h3 className={typeScale.label}>{welcomeHome.hypothesis.title}</h3>
        <ul className={cn(typeScale.bodySm, "mt-3 space-y-2.5 text-left")}>
          {welcomeHome.hypothesis.questions.map((question) => (
            <li className="flex gap-2" key={question}>
              <span aria-hidden className="shrink-0 text-meridian">
                →
              </span>
              <span>{question}</span>
            </li>
          ))}
        </ul>
        <p className={cn(typeScale.caption, "mt-3 text-muted-foreground")}>
          {whatImLearning.footer}
        </p>
      </div>

      <ol className="mx-auto mt-8 grid max-w-2xl gap-3 sm:gap-4">
        {meridianLoop.steps.map((step, index) => (
          <li className={cn(monitorPanelClass, "flex gap-4 p-4 sm:p-5")} key={step.id}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-meridian text-sm font-semibold text-white">
              {index + 1}
            </div>
            <div className="min-w-0 text-left">
              <h3 className={typeScale.label}>{step.label}</h3>
              <p className={cn(typeScale.bodySm, "mt-1")}>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <p
        className={cn(
          typeScale.bodySm,
          "mx-auto mt-6 max-w-2xl rounded-lg bg-meridian-muted/30 px-4 py-3 text-center font-medium text-foreground",
        )}
      >
        {welcomeHome.rules}
      </p>

      {isDemoBuild ? (
        <div className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-2 text-center">
          <Button className="gap-2" onClick={() => openFolder()} type="button">
            <Sparkles className="h-4 w-4" aria-hidden />
            {welcomeHome.demoCtaLabel}
          </Button>
          <p className={cn(typeScale.caption, "max-w-md")}>{welcomeHome.demoNote}</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-2 sm:flex-row"
        >
          <div className="w-full space-y-1.5">
            <label className={cn(typeScale.caption, "block text-center sm:text-left")}>
              {welcomeHome.ctaLabel}
            </label>
            <Input
              autoFocus
              type="text"
              placeholder="/Users/you/your-project/docs"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={isOpening}
              className="font-mono text-sm"
            />
          </div>
          <Button
            type="submit"
            disabled={isOpening || !value.trim()}
            className="shrink-0 sm:mt-6"
          >
            Open
          </Button>
        </form>
      )}

      {error ? (
        <p className="mt-3 text-center text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      {onNavigate ? (
        <nav
          aria-label="Learn more"
          className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm"
        >
          <button
            className="text-meridian underline-offset-4 hover:underline"
            onClick={() => onNavigate("concepts")}
            type="button"
          >
            Learn
          </button>
          <span aria-hidden className="text-muted-foreground">
            ·
          </span>
          <button
            className="text-meridian underline-offset-4 hover:underline"
            onClick={() => onNavigate("usage")}
            type="button"
          >
            Commands
          </button>
          <span aria-hidden className="text-muted-foreground">
            ·
          </span>
          <button
            className="text-meridian underline-offset-4 hover:underline"
            onClick={() => onNavigate("concepts")}
            type="button"
          >
            Scrum ↔ Meridian map
          </button>
        </nav>
      ) : null}
    </section>
  )
}
