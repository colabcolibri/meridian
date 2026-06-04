import { FolderTree, LayoutDashboard, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"
import { MONITOR_CONTAINER } from "@/features/monitor/monitor-layout"
import { monitorPanelClass } from "@/features/monitor/monitor-ui"
import { typeScale } from "@/features/monitor/monitor-typography"
import { useState } from "react"

const steps = [
  {
    icon: FolderTree,
    title: "Open your project's docs folder",
    body: "This is where the spec lives — scope, architecture, epics, versions, user stories, decision log.",
  },
  {
    icon: LayoutDashboard,
    title: "See Setup, Deliverables, and Board",
    body: "Setup tracks phase doc progress. Deliverables shows epic coverage. Board shows each user story's status.",
  },
  {
    icon: Sparkles,
    title: "Works across reloads",
    body: "The path is saved locally — F5 restores the board automatically.",
  },
]

export function WelcomeScreen() {
  const { folder, isDemoBuild, status, error, openFolderFromPath, storedPath } =
    useProjectFolder()
  const [value, setValue] = useState(storedPath ?? "")

  if (folder) return null

  const isOpening = status === "opening"

  if (isDemoBuild && isOpening) {
    return (
      <section className={`${MONITOR_CONTAINER} py-16 text-center`}>
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
          Meridian Desktop
        </p>
        <h2 className={cn(typeScale.pageTitle, "mt-2 sm:text-3xl")}>
          Monitor your Meridian project
        </h2>
        <p className={cn(typeScale.bodySm, "mt-3")}>
          Paste the absolute path to your project's{" "}
          <strong className="font-medium text-foreground">docs</strong> folder and press
          Enter.
        </p>
      </div>

      <ol className="mx-auto mt-10 grid max-w-2xl gap-4 sm:gap-5">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <li
              className={cn(monitorPanelClass, "flex gap-4 p-4 sm:p-5")}
              key={step.title}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-meridian-muted text-sm font-semibold text-meridian-muted-foreground">
                {index + 1}
              </div>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-meridian" aria-hidden />
                  <h3 className={typeScale.label}>{step.title}</h3>
                </div>
                <p className={cn(typeScale.bodySm, "mt-1.5")}>{step.body}</p>
              </div>
            </li>
          )
        })}
      </ol>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 flex w-full max-w-xl gap-2"
      >
        <Input
          autoFocus
          type="text"
          placeholder="/Users/you/project/docs"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isOpening}
          className="font-mono text-sm"
        />
        <Button type="submit" disabled={isOpening || !value.trim()}>
          Open
        </Button>
      </form>

      {error ? (
        <p className="mt-3 text-center text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  )
}
