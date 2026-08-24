// meridian-tools — OpenCode plugin generated/managed by the Meridian kit.
//
// Exposes read-only delivery tools backed by the kit CLI (.agent/scripts/):
//   - meridian_counts   backlog overview (versions, epics, sprints, stories, decisions)
//   - meridian_list     query user stories / epics / sprints / versions / decisions
//   - meridian_show     read a single user story with acceptance criteria
//   - meridian_validate run the governance validator
//
// Mirrors the read-only surface of the meridian-vscode extension inside OpenCode.
// Requires the Meridian kit (.agent/) in this repository.

import { tool } from "@opencode-ai/plugin"

const MAX_OUTPUT = 8000

export const MeridianTools = async ({ directory, worktree }) => {
  const root = worktree ?? directory

  const deliveryScript = `${root}/.agent/scripts/meridian_delivery.py`
  const validatorScript = `${root}/.agent/scripts/validate_meridian.py`

  const missingKit = () =>
    `Meridian kit not found at ${root}/.agent — install it first:\n` +
    `  ./.agent/scripts/install-meridian-kit.sh <project>\n` +
    `See https://github.com/colabcolibri/meridian`

  async function run(argv) {
    const proc = Bun.spawn(argv, {
      cwd: root,
      stdout: "pipe",
      stderr: "pipe",
    })
    const [out, err] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ])
    const code = await proc.exited
    let text = `${out}${err}`.trim()
    if (text.length > MAX_OUTPUT) {
      text = text.slice(0, MAX_OUTPUT) + `\n… (truncated ${text.length - MAX_OUTPUT} chars)`
    }
    return { code, text }
  }

  return {
    tool: {
      meridian_counts: tool({
        description:
          "Show Meridian delivery counts (versions, epics, sprints, user stories, decisions) from the project SQLite store.",
        args: {},
        async execute() {
          if (!(await Bun.file(deliveryScript).exists())) return missingKit()
          const { code, text } = await run(["python3", deliveryScript, "counts"])
          return code === 0 ? text : `meridian_delivery.py counts failed (${code}):\n${text}`
        },
      }),

      meridian_list: tool({
        description:
          "List Meridian delivery entities (us, epics, sprints, versions, decisions) with optional filters. Read-only.",
        args: {
          entity: tool.schema
            .enum(["us", "epic", "sprint", "version", "decisions"])
            .optional()
            .describe("Entity to list (default: us)"),
          status: tool.schema.string().optional().describe("Filter by status (e.g. todo, in_progress, done)"),
          epic: tool.schema.string().optional().describe("Filter by epic id"),
          version: tool.schema.string().optional().describe("Filter by version id"),
          ready: tool.schema.enum(["true", "false"]).optional().describe("Filter by ready flag"),
          date: tool.schema.string().optional().describe("Decision date YYYY-MM-DD when entity=decisions"),
        },
        async execute(args) {
          if (!(await Bun.file(deliveryScript).exists())) return missingKit()
          const argv = ["python3", deliveryScript, "list", args.entity ?? "us"]
          if (args.status) argv.push("--status", args.status)
          if (args.epic) argv.push("--epic", args.epic)
          if (args.version) argv.push("--version", args.version)
          if (args.ready) argv.push("--ready", args.ready)
          if (args.date) argv.push("--date", args.date)
          const { code, text } = await run(argv)
          return code === 0 ? text : `meridian_delivery.py list failed (${code}):\n${text}`
        },
      }),

      meridian_show: tool({
        description:
          "Show a single Meridian user story (US-XXXX) with refined content and acceptance criteria. Read-only.",
        args: {
          story_id: tool.schema.string().describe('Story id, e.g. "US-0106"'),
          full: tool.schema.boolean().optional().describe("Include full record section"),
        },
        async execute(args) {
          if (!(await Bun.file(deliveryScript).exists())) return missingKit()
          const argv = ["python3", deliveryScript, "show", args.story_id]
          if (args.full) argv.push("--full")
          const { code, text } = await run(argv)
          return code === 0 ? text : `meridian_delivery.py show failed (${code}):\n${text}`
        },
      }),

      meridian_validate: tool({
        description:
          "Run the Meridian governance validator against this project and return the report (structure, contracts, SQLite parity).",
        args: {
          project: tool.schema.string().optional().describe("Project folder to validate (default: repo root)"),
          sqlite_only: tool.schema.boolean().optional().describe("Validate only the SQLite layer"),
        },
        async execute(args) {
          if (!(await Bun.file(validatorScript).exists())) return missingKit()
          const argv = ["python3", validatorScript, args.project ?? root]
          if (args.sqlite_only) argv.push("--sqlite-only")
          const { code, text } = await run(argv)
          return `exit=${code}\n${text}`
        },
      }),
    },
  }
}
