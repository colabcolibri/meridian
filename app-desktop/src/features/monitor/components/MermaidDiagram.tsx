import { lazy, Suspense, useEffect, useId, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type MermaidModule = typeof import("mermaid")
type MermaidTheme = "neutral" | "dark"
export type MermaidLayoutEngine = "dagre" | "elk"

let mermaidModule: MermaidModule["default"] | null = null
let mermaidInitPromise: Promise<MermaidModule["default"]> | null = null
let mermaidInitTheme: MermaidTheme | null = null
let elkRegistered = false

async function ensureElkRegistered(mermaid: MermaidModule["default"]) {
  if (elkRegistered) return
  const elkLayouts = await import("@mermaid-js/layout-elk")
  mermaid.registerLayoutLoaders(elkLayouts.default)
  elkRegistered = true
}

function loadMermaid(theme: MermaidTheme) {
  if (mermaidModule && mermaidInitTheme === theme) return Promise.resolve(mermaidModule)
  mermaidModule = null
  mermaidInitPromise = import("mermaid").then((mod) => {
    mod.default.initialize({
      startOnLoad: false,
      theme,
      securityLevel: "strict",
      fontFamily: "inherit",
      flowchart: {
        useMaxWidth: false,
        curve: "linear",
      },
    })
    mermaidModule = mod.default
    mermaidInitTheme = theme
    return mermaidModule
  })
  return mermaidInitPromise
}

/** Injects layout frontmatter at render time — kit .md stays unchanged. */
export function withLayoutEngine(chart: string, engine: MermaidLayoutEngine): string {
  const definition = chart.trim()
  if (engine === "dagre" || definition.startsWith("---")) return definition
  return `---\nconfig:\n  layout: elk\n---\n${definition}`
}

type MermaidDiagramProps = {
  chart: string
  className?: string
  /** Dagre (default) or ELK for graphs with cross-subgraph edges. */
  layoutEngine?: MermaidLayoutEngine
  layoutAtWidth?: number
  theme?: MermaidTheme
}

function MermaidDiagramInner({
  chart,
  className,
  layoutEngine = "dagre",
  layoutAtWidth,
  theme = "neutral",
}: MermaidDiagramProps) {
  const reactId = useId().replace(/:/g, "")
  const containerRef = useRef<HTMLDivElement>(null)
  const layoutHostRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const definition = withLayoutEngine(chart, layoutEngine)

    void (async () => {
      try {
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve())
        })
        if (cancelled) return

        const mermaid = await loadMermaid(theme)
        if (layoutEngine === "elk") {
          await ensureElkRegistered(mermaid)
        }

        const layoutHost = layoutAtWidth != null ? layoutHostRef.current : null
        if (layoutHost) {
          layoutHost.style.width = `${layoutAtWidth}px`
        }

        const { svg, bindFunctions } = await mermaid.render(
          `meridian-mermaid-${reactId}`,
          definition,
          layoutHost ?? undefined,
        )
        if (cancelled || !containerRef.current) return
        containerRef.current.innerHTML = svg
        bindFunctions?.(containerRef.current)
        setError(null)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Diagram failed to render")
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [chart, layoutAtWidth, layoutEngine, reactId, theme])

  if (error) {
    return (
      <div
        className={cn(
          "rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm",
          className,
        )}
        role="alert"
      >
        <p className="font-medium text-destructive">Could not render diagram</p>
        <p className="mt-1 text-muted-foreground">{error}</p>
        <pre className="mt-3 max-h-48 overflow-auto font-mono text-xs leading-relaxed">
          {chart}
        </pre>
      </div>
    )
  }

  return (
    <>
      {layoutAtWidth != null ? (
        <div
          ref={layoutHostRef}
          aria-hidden
          className="pointer-events-none fixed top-0 left-[-10000px] opacity-0"
        />
      ) : null}
      <div
        ref={containerRef}
        className={cn(
          "mermaid-diagram flex w-full justify-center overflow-x-auto py-2",
          layoutAtWidth != null
            ? "[&_svg]:h-auto [&_svg]:max-w-none"
            : "[&_svg]:h-auto [&_svg]:w-auto [&_svg]:min-w-[720px] [&_svg]:max-w-none",
          className,
        )}
        aria-label="Mermaid diagram"
      />
    </>
  )
}

const MermaidDiagramLazy = lazy(async () => ({
  default: MermaidDiagramInner,
}))

export function MermaidDiagram(props: MermaidDiagramProps) {
  return (
    <Suspense
      fallback={
        <div
          className={cn(
            "flex min-h-[120px] items-center justify-center rounded-lg border border-border bg-muted/20 text-sm text-muted-foreground",
            props.className,
          )}
        >
          Loading diagram…
        </div>
      }
    >
      <MermaidDiagramLazy {...props} />
    </Suspense>
  )
}
