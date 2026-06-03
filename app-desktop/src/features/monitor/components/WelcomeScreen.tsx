import {
  FolderOpen,
  FolderTree,
  KeyRound,
  LayoutDashboard,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useProjectFolder } from "@/features/folder/ProjectFolderContext"
import { OpenFolderButton } from "@/features/monitor/components/OpenFolderButton"
import { MONITOR_CONTAINER } from "@/features/monitor/monitor-layout"
import { monitorPanelClass } from "@/features/monitor/monitor-ui"
import { typeScale } from "@/features/monitor/monitor-typography"

const steps = [
  {
    icon: FolderTree,
    title: "Choose your project's docs folder",
    body: "This is where scope, versions, user stories, and the board live — the same folder you edit with agents in Cursor.",
  },
  {
    icon: LayoutDashboard,
    title: "Track setup, deliverables, and board",
    body: "Three views: initial document progress, product epics, and status of each delivery.",
  },
  {
    icon: Sparkles,
    title: "Use Chrome or Edge on localhost",
    body: "The browser must allow opening the folder on your computer (once per session).",
  },
]

export function WelcomeScreen() {
  const {
    folder,
    grantReadPermission,
    fsAccessSupported,
    isDemoBuild,
    status,
    error,
    pendingFolderName,
  } = useProjectFolder()

  if (folder) {
    return null
  }

  const isOpening = status === "opening"

  if (isDemoBuild && isOpening) {
    return (
      <section className={`${MONITOR_CONTAINER} py-16 text-center`}>
        <p className={typeScale.bodySm}>Loading Meridian demo project…</p>
      </section>
    )
  }
  const needsPermission = status === "permission_required"

  return (
    <section className={`${MONITOR_CONTAINER} py-10 sm:py-14`}>
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-medium text-meridian-muted-foreground">
          Meridian Desktop
        </p>
        <h2 className={cn(typeScale.pageTitle, "mt-2 sm:text-3xl")}>
          {needsPermission
            ? "Allow folder read access"
            : "Manage your project through the docs folder"}
        </h2>
        <p className={cn(typeScale.bodySm, "mt-3")}>
          {needsPermission ? (
            <>
              Folder{" "}
              <strong className="font-medium text-foreground">
                {pendingFolderName}
              </strong>{" "}
              was selected. Chrome requires a click to grant read access to the files.
            </>
          ) : (
            <>
              Open the project's{" "}
              <strong className="font-medium text-foreground">docs</strong> folder (e.g.{" "}
              <span className="font-mono text-xs">app-desktop/docs</span>) to see the
              same content your agents use.
            </>
          )}
        </p>
      </div>

      {!needsPermission ? (
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
      ) : null}

      <div className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-3">
        {needsPermission ? (
          <Button
            className="h-11 w-full max-w-sm text-base sm:w-auto sm:min-w-[280px]"
            disabled={isOpening}
            onClick={() => void grantReadPermission()}
            size="lg"
          >
            <KeyRound className="mr-2 h-5 w-5" />
            Allow folder read access
          </Button>
        ) : (
          <OpenFolderButton
            className="h-11 w-full max-w-sm text-base sm:w-auto sm:min-w-[240px]"
            size="lg"
          >
            <FolderOpen className="mr-2 h-5 w-5" />
            Open project folder
          </OpenFolderButton>
        )}

        {needsPermission ? (
          <OpenFolderButton size="sm" variant="outline">
            Choose another folder
          </OpenFolderButton>
        ) : null}

        {!fsAccessSupported ? (
          <p className="text-center text-xs text-amber-800">
            Your browser does not support folder access. Use Chrome or Edge on
            localhost.
          </p>
        ) : null}
        {error ? (
          <p className="text-center text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  )
}
