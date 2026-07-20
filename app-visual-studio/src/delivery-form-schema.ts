import type { DeliveryFolder } from "./delivery-path.js"

export type FormCatalogEntry = {
  id: string
  title: string
  status?: string
}

export type FormCatalog = {
  stories: FormCatalogEntry[]
  epics: FormCatalogEntry[]
  versions: FormCatalogEntry[]
}

export type DeliveryFormPayload = {
  entity: DeliveryFolder
  id: string
  frontmatter: Record<string, string>
  preamble: string
  sections: Record<string, string>
  catalog?: FormCatalog
}

export type FormFieldKind = "text" | "textarea" | "readonly" | "select" | "multiselect"

export type FormFieldDef = {
  key: string
  label: string
  kind: FormFieldKind
  scope: "frontmatter" | "sections" | "preamble"
  group: string
  rows?: number
  catalogKey?: keyof FormCatalog
}

const US_STATUS = ["❌", "🔶", "✅", "🧊", "🚫"]
const US_MOSCOW = ["Must", "Should", "Could", "Wont"]
const US_TESTS = ["required", "none"]
const US_TESTS_STATUS = ["pending", "done", "n/a"]
const BOOL = ["true", "false"]
const EPIC_STATUS = ["active", "complete", "paused"]
const VERSION_STATUS = ["planned", "active", "complete"]
const SPRINT_STATUS = ["planned", "active", "complete"]

function fm(
  key: string,
  label: string,
  group: string,
  kind: FormFieldKind = "text",
  catalogKey?: keyof FormCatalog,
): FormFieldDef {
  return { key, label, kind, scope: "frontmatter", group, catalogKey }
}

function sec(
  key: string,
  label: string,
  group: string,
  rows = 5,
): FormFieldDef {
  return { key, label, kind: "textarea", scope: "sections", group, rows }
}

export function deliveryFormFields(folder: DeliveryFolder): FormFieldDef[] {
  const readonlyId = fm("id", "ID", "Metadata", "readonly")
  switch (folder) {
    case "us":
      return [
        readonlyId,
        fm("title", "Title", "Metadata"),
        fm("epic", "Epic", "Metadata", "select", "epics"),
        fm("version", "Version", "Metadata", "select", "versions"),
        fm("status", "Status", "Metadata", "select"),
        fm("moscow", "MoSCoW", "Metadata", "select"),
        fm("depends_on", "Depends on", "Metadata", "multiselect", "stories"),
        fm("ready", "Ready", "Metadata", "select"),
        fm("done_when", "Done when", "Metadata"),
        fm("tests", "Tests", "Metadata", "select"),
        fm("tests_status", "Tests status", "Metadata", "select"),
        {
          key: "preamble",
          label: "Title line + user story",
          kind: "textarea",
          scope: "preamble",
          group: "Preamble",
          rows: 4,
        },
        sec("intent_acceptance", "Acceptance", "Intent", 8),
        sec("intent_why", "Why", "Intent", 5),
        sec("intent_where", "Where", "Intent", 5),
        sec("plan_approach", "Approach", "Plan", 5),
        sec("plan_architecture_refs", "Architecture refs", "Plan", 4),
        sec("plan_api_db", "API / DB impact", "Plan", 3),
        sec("plan_security", "Security notes", "Plan", 3),
        sec("plan_decisions", "Related decisions", "Plan", 3),
        sec("plan_planned", "Planned", "Plan", 6),
        sec("record_files", "Files", "Record", 4),
        sec("record_backend", "Backend", "Record", 3),
        sec("record_frontend", "Frontend", "Record", 3),
        sec("record_scripts", "Scripts / Docs", "Record", 3),
        sec("record_executed", "Executed", "Record", 4),
        sec("boundaries_out_of_scope", "Out of scope", "Boundaries", 4),
        sec("boundaries_notes", "Notes", "Boundaries", 3),
      ]
    case "epics":
      return [
        readonlyId,
        fm("title", "Title", "Metadata"),
        fm("status", "Status", "Metadata", "select"),
        fm("versions", "Versions", "Metadata"),
        fm("profiles", "Profiles", "Metadata"),
        fm("outcome", "Outcome", "Metadata"),
        {
          key: "preamble",
          label: "Heading",
          kind: "textarea",
          scope: "preamble",
          group: "Preamble",
          rows: 2,
        },
        sec("capability", "Capability", "Body", 10),
        sec("expected_outcome", "Expected outcome", "Body", 6),
        sec("out_of_scope", "Out of scope for this epic", "Body", 6),
        sec("notes", "Notes", "Body", 4),
      ]
    case "versions":
      return [
        readonlyId,
        fm("title", "Title", "Metadata"),
        fm("status", "Status", "Metadata", "select"),
        fm("outcome", "Outcome", "Metadata"),
        {
          key: "preamble",
          label: "Heading",
          kind: "textarea",
          scope: "preamble",
          group: "Preamble",
          rows: 2,
        },
        sec("objective", "Objective", "Body", 8),
        sec("done_criteria", "Done criteria", "Body", 6),
        sec("included", "Included in this version", "Body", 6),
        sec("explicitly_out", "Explicitly out", "Body", 5),
        sec("go_live", "Go-live checklist", "Body", 6),
      ]
    case "sprints":
      return [
        readonlyId,
        fm("version", "Version", "Metadata", "select", "versions"),
        fm("title", "Title", "Metadata"),
        fm("status", "Status", "Metadata", "select"),
        fm("goal", "Goal (frontmatter)", "Metadata"),
        fm("done_when", "Done when", "Metadata"),
        fm("stories", "Stories", "Metadata"),
        {
          key: "preamble",
          label: "Heading",
          kind: "textarea",
          scope: "preamble",
          group: "Preamble",
          rows: 2,
        },
        sec("goal_body", "Goal", "Body", 5),
        sec("scope_table", "Scope table", "Body", 8),
        sec("out_of_scope", "Out of scope for this sprint", "Body", 5),
        sec("retrospective", "Retrospective", "Body", 6),
      ]
    default:
      return [readonlyId]
  }
}

export function selectOptionsForField(
  folder: DeliveryFolder,
  field: FormFieldDef,
  catalog?: FormCatalog,
): string[] | undefined {
  if (field.catalogKey && catalog?.[field.catalogKey]?.length) {
    return catalog[field.catalogKey].map((entry) => entry.id)
  }
  if (field.scope !== "frontmatter") {
    return undefined
  }
  if (folder === "us") {
    if (field.key === "status") return US_STATUS
    if (field.key === "moscow") return US_MOSCOW
    if (field.key === "tests") return US_TESTS
    if (field.key === "tests_status") return US_TESTS_STATUS
    if (field.key === "ready") return BOOL
  }
  if (folder === "epics" && field.key === "status") return EPIC_STATUS
  if (folder === "versions" && field.key === "status") return VERSION_STATUS
  if (folder === "sprints" && field.key === "status") return SPRINT_STATUS
  return undefined
}

export function parseDependsOn(value: string): string[] {
  const trimmed = value.trim()
  if (!trimmed || trimmed === "[]") return []
  if (trimmed.startsWith("[")) {
    const inner = trimmed.slice(1, -1).trim()
    if (!inner) return []
    return inner.split(",").map((part) => part.trim()).filter(Boolean)
  }
  return trimmed.split(",").map((part) => part.trim()).filter(Boolean)
}

export function formatDependsOn(ids: string[]): string {
  const cleaned = ids.map((id) => id.trim()).filter(Boolean)
  if (!cleaned.length) return "[]"
  return `[${cleaned.join(", ")}]`
}
