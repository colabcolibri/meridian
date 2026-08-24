// Data access for Meridian views — single responsibility: fetch + cache delivery JSON.
// Source: kit export CLI (.agent/scripts/meridian_db_export.py). Read-only.

export type Story = {
  id: string
  title: string
  epic: string
  version: string
  status: string
  moscow: string
  dependsOn: string[]
  doneWhen: string
  tests: string
  testsStatus: string
  ready: boolean
  summary: string
  sprint: string
}

export type Planning = {
  packageRoot: string
  userStories: Story[]
  versions: Record<string, unknown>[]
  epics: Record<string, unknown>[]
  sprints: Record<string, unknown>[]
}

export type DecisionEntry = Record<string, string>
export type DecisionDate = { date: string; count: number; entries: DecisionEntry[] }
export type Decisions = { totalEntries: number; dates: DecisionDate[] }

const TTL_MS = 15_000

let cacheAt = 0
let cachePromise: Promise<{ planning: Planning; decisions: Decisions }> | null = null

async function sh(root: string, args: string[]): Promise<string> {
  const script = `${root}/.agent/scripts/meridian_db_export.py`
  const proc = Bun.spawn(["python3", script, ...args], {
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
  })
  const [out, err] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ])
  if ((await proc.exited) !== 0) {
    throw new Error(`meridian_db_export.py failed: ${err.trim() || "unknown error"}`)
  }
  return out
}

export function kitPresent(root: string): boolean {
  return Bun.file(`${root}/.agent/scripts/meridian_db_export.py`).size > 0
}

async function fetchDelivery(root: string): Promise<{ planning: Planning; decisions: Decisions }> {
  const [planningRaw, decisionsRaw] = await Promise.all([
    sh(root, ["--format", "planning"]),
    sh(root, ["--format", "decisions"]),
  ])
  return { planning: JSON.parse(planningRaw), decisions: JSON.parse(decisionsRaw) }
}

export async function loadDelivery(root: string): Promise<{ planning: Planning; decisions: Decisions }> {
  const now = Date.now()
  if (cachePromise && now - cacheAt < TTL_MS) {
    return cachePromise
  }
  cacheAt = now
  cachePromise = fetchDelivery(root).catch((err) => {
    cachePromise = null
    cacheAt = 0
    throw err
  })
  return cachePromise
}
