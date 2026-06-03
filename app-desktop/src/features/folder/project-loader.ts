import { deriveBoardFromStories } from "@/domain/meridian/board-derive"
import { mapWithConcurrency } from "@/domain/meridian/async-batch"
import { splitMarkdown } from "@/domain/meridian/frontmatter"
import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import { PHASE_DOC_IDS } from "@/domain/meridian/phase-doc-files"
import {
  MeridianParseError,
  parseDecisionDayFile,
  parseEpicFile,
  parsePhaseDocument,
  parseSprintFile,
  parseUserStoryFile,
  parseVersionFile,
} from "@/domain/meridian/parser"
import {
  collectIndexProtocolIssues,
  collectStoryProtocolIssues,
} from "@/domain/meridian/protocol-validators"
import {
  validateEpicStructure,
  validateVersionStructure,
} from "@/domain/meridian/section-contracts"
import {
  resolveStoryDocumentationBadge,
  type StoryDocumentationBadge,
} from "@/domain/meridian/story-body"
import type {
  DecisionDay,
  Epic,
  PhaseDocument,
  ProductVersion,
  Sprint,
  UserStory,
} from "@/domain/meridian/types"
import type { MeridianDocsRoot } from "@/features/folder/meridian-docs-root"
import { FS_READ_CONCURRENCY } from "@/features/folder/read-folder-file"
import { USER_STORY_FILENAME_PATTERN } from "@/domain/meridian/user-story-id"

export type { MonitorIssue }

export interface MeridianProjectData {
  phaseDocuments: PhaseDocument[]
  userStories: UserStory[]
  epics: Epic[]
  versions: ProductVersion[]
  sprints: Sprint[]
  decisionDays: DecisionDay[]
  /** Derived on load from userStories — never read from kanban/board.json. */
  board: ReturnType<typeof deriveBoardFromStories>
  issues: MonitorIssue[]
}

export interface MeridianProjectCore {
  phaseDocuments: PhaseDocument[]
  userStories: UserStory[]
  board: ReturnType<typeof deriveBoardFromStories>
  issues: MonitorIssue[]
}

export interface MeridianProjectSupplement {
  epics: Epic[]
  versions: ProductVersion[]
  sprints: Sprint[]
  decisionDays: DecisionDay[]
  issues: MonitorIssue[]
}

export interface StoryValidationEnrichment {
  bodyIssues: MonitorIssue[]
  documentationBadges: Map<string, StoryDocumentationBadge | null>
}

const USER_STORY_BODY_CONCURRENCY = 4

function recordParseIssue(issues: MonitorIssue[], error: unknown) {
  if (error instanceof MeridianParseError) {
    issues.push({
      file: error.file,
      message: error.message.replace(`${error.file}: `, ""),
      severity: "error",
      scope: "parse",
    })
    return
  }
  issues.push({
    file: ".",
    message: error instanceof Error ? error.message : "Unknown error reading folder.",
    severity: "error",
    scope: "parse",
  })
}

function recordStructureIssues(
  issues: MonitorIssue[],
  file: string,
  targetId: string,
  messages: string[],
) {
  for (const message of messages) {
    issues.push({
      file,
      message,
      severity: "error",
      scope: "doc",
      targetId,
    })
  }
}

async function loadPhaseDocuments(
  docsRoot: MeridianDocsRoot,
  parseIssues: MonitorIssue[],
): Promise<PhaseDocument[]> {
  const results = await mapWithConcurrency(
    PHASE_DOC_IDS as readonly string[],
    FS_READ_CONCURRENCY,
    async (docId) => {
      const filename = `${docId}.md`
      try {
        const raw = await docsRoot.readText(filename)
        return parsePhaseDocument(docId, raw)
      } catch (error) {
        recordParseIssue(
          parseIssues,
          error instanceof MeridianParseError
            ? error
            : new MeridianParseError(filename, String(error)),
        )
        return null
      }
    },
  )

  return results.filter((doc): doc is PhaseDocument => doc !== null)
}

async function loadEpics(
  docsRoot: MeridianDocsRoot,
  parseIssues: MonitorIssue[],
  structureIssues: MonitorIssue[],
): Promise<Epic[]> {
  const epics: Epic[] = []

  try {
    const files = await docsRoot.listFiles("epics", /^EPIC-\d+\.md$/i)

    if (files.length === 0) {
      parseIssues.push({
        file: "epics/",
        message: "No EPIC-XX.md files found in docs/epics/.",
        severity: "error",
        scope: "parse",
      })
      return epics
    }

    const parsed = await mapWithConcurrency(
      files,
      FS_READ_CONCURRENCY,
      async ({ name: filename, relativePath }) => {
        try {
          const raw = await docsRoot.readText(relativePath)
          const epic = parseEpicFile(filename, raw)
          recordStructureIssues(
            structureIssues,
            `epics/${epic.id}.md`,
            epic.id,
            validateEpicStructure(epic.id, splitMarkdown(raw).body),
          )
          return epic
        } catch (error) {
          recordParseIssue(
            parseIssues,
            error instanceof MeridianParseError
              ? error
              : new MeridianParseError(`epics/${filename}`, String(error)),
          )
          return null
        }
      },
    )

    for (const epic of parsed) {
      if (epic) {
        epics.push(epic)
      }
    }
  } catch {
    parseIssues.push({
      file: "epics/",
      message: 'Folder "epics/" not found. Create docs/epics/ with EPIC-XX.md.',
      severity: "error",
      scope: "parse",
    })
  }

  return epics
}

async function loadVersions(
  docsRoot: MeridianDocsRoot,
  parseIssues: MonitorIssue[],
  structureIssues: MonitorIssue[],
): Promise<ProductVersion[]> {
  const versions: ProductVersion[] = []

  try {
    const files = await docsRoot.listFiles("versions", /^v\d+\.md$/i)

    if (files.length === 0) {
      parseIssues.push({
        file: "versions/",
        message: "No vX.md files found in docs/versions/.",
        severity: "error",
        scope: "parse",
      })
      return versions
    }

    const parsed = await mapWithConcurrency(
      files,
      FS_READ_CONCURRENCY,
      async ({ name: filename, relativePath }) => {
        try {
          const raw = await docsRoot.readText(relativePath)
          const version = parseVersionFile(filename, raw)
          recordStructureIssues(
            structureIssues,
            `versions/${version.id}.md`,
            version.id,
            validateVersionStructure(version.id, splitMarkdown(raw).body),
          )
          return version
        } catch (error) {
          recordParseIssue(
            parseIssues,
            error instanceof MeridianParseError
              ? error
              : new MeridianParseError(`versions/${filename}`, String(error)),
          )
          return null
        }
      },
    )

    for (const version of parsed) {
      if (version) {
        versions.push(version)
      }
    }
  } catch {
    parseIssues.push({
      file: "versions/",
      message: 'Folder "versions/" not found. Create docs/versions/ with vX.md.',
      severity: "error",
      scope: "parse",
    })
  }

  return versions
}

async function loadSprints(
  docsRoot: MeridianDocsRoot,
  parseIssues: MonitorIssue[],
): Promise<Sprint[]> {
  const sprints: Sprint[] = []

  try {
    const files = await docsRoot.listFiles("sprints", /^v\d+-S\d+\.md$/i)

    const parsed = await mapWithConcurrency(
      files,
      FS_READ_CONCURRENCY,
      async ({ name: filename, relativePath }) => {
        try {
          const raw = await docsRoot.readText(relativePath)
          return parseSprintFile(filename, raw)
        } catch (error) {
          recordParseIssue(
            parseIssues,
            error instanceof MeridianParseError
              ? error
              : new MeridianParseError(`sprints/${filename}`, String(error)),
          )
          return null
        }
      },
    )

    for (const sprint of parsed) {
      if (sprint) {
        sprints.push(sprint)
      }
    }
  } catch {
    parseIssues.push({
      file: "sprints/",
      message: 'Folder "sprints/" not found (optional until first sprint).',
      severity: "warning",
      scope: "parse",
    })
  }

  return sprints
}

async function loadDecisions(
  docsRoot: MeridianDocsRoot,
  parseIssues: MonitorIssue[],
): Promise<DecisionDay[]> {
  const decisionDays: DecisionDay[] = []

  try {
    const files = await docsRoot.listFiles("decisions", /^\d{4}-\d{2}-\d{2}\.json$/i)
    files.sort((a, b) => b.name.localeCompare(a.name))

    if (files.length === 0) {
      parseIssues.push({
        file: "decisions/",
        message: "No YYYY-MM-DD.json files found in docs/decisions/.",
        severity: "warning",
        scope: "parse",
      })
      return decisionDays
    }

    const parsed = await mapWithConcurrency(
      files,
      FS_READ_CONCURRENCY,
      async ({ name: filename, relativePath }) => {
        try {
          const raw = await docsRoot.readText(relativePath)
          return parseDecisionDayFile(filename, raw)
        } catch (error) {
          recordParseIssue(
            parseIssues,
            error instanceof MeridianParseError
              ? error
              : new MeridianParseError(`decisions/${filename}`, String(error)),
          )
          return null
        }
      },
    )

    for (const day of parsed) {
      if (day) {
        decisionDays.push(day)
      }
    }
  } catch {
    parseIssues.push({
      file: "decisions/",
      message:
        'Folder "decisions/" not found. Create docs/decisions/ with YYYY-MM-DD.json.',
      severity: "error",
      scope: "parse",
    })
  }

  return decisionDays
}

async function loadUserStoryIndex(
  docsRoot: MeridianDocsRoot,
  parseIssues: MonitorIssue[],
): Promise<UserStory[]> {
  const userStories: UserStory[] = []

  try {
    const files = await docsRoot.listFiles("us", USER_STORY_FILENAME_PATTERN)

    const stories = await mapWithConcurrency(
      files,
      FS_READ_CONCURRENCY,
      async ({ name: filename, relativePath }) => {
        try {
          const raw = await docsRoot.readTextForFrontmatter(relativePath)
          return parseUserStoryFile(filename, raw)
        } catch (error) {
          recordParseIssue(
            parseIssues,
            error instanceof MeridianParseError
              ? error
              : new MeridianParseError(`us/${filename}`, String(error)),
          )
          return null
        }
      },
    )

    for (const story of stories) {
      if (story) {
        userStories.push(story)
      }
    }
  } catch {
    parseIssues.push({
      file: "us/",
      message: 'Folder "us/" not found.',
      severity: "error",
      scope: "parse",
    })
  }

  return userStories
}

function buildIndexIssues(
  phaseDocuments: PhaseDocument[],
  userStories: UserStory[],
  epics: Epic[],
  versions: ProductVersion[],
  sprints: Sprint[],
  parseIssues: MonitorIssue[],
  structureIssues: MonitorIssue[],
): MonitorIssue[] {
  return [
    ...parseIssues,
    ...structureIssues,
    ...collectIndexProtocolIssues({
      phaseDocuments,
      userStories,
      epics,
      versions,
      sprints,
    }),
  ]
}

/** Fast path: phase docs + US frontmatter index (kanban-ready). */
export async function loadMeridianProjectCore(
  docsRoot: MeridianDocsRoot,
): Promise<MeridianProjectCore> {
  const parseIssues: MonitorIssue[] = []

  const phaseDocuments = await loadPhaseDocuments(docsRoot, parseIssues)
  const userStories = await loadUserStoryIndex(docsRoot, parseIssues)

  phaseDocuments.sort((a, b) => a.id.localeCompare(b.id))
  const board = deriveBoardFromStories(userStories)

  const issues = buildIndexIssues(
    phaseDocuments,
    userStories,
    [],
    [],
    [],
    parseIssues,
    [],
  )

  return { phaseDocuments, userStories, board, issues }
}

/** Secondary load: epics, versions, sprints, decisions (after UI is interactive). */
export async function loadMeridianProjectSupplement(
  docsRoot: MeridianDocsRoot,
): Promise<MeridianProjectSupplement> {
  const parseIssues: MonitorIssue[] = []
  const structureIssues: MonitorIssue[] = []

  const epics = await loadEpics(docsRoot, parseIssues, structureIssues)
  const versions = await loadVersions(docsRoot, parseIssues, structureIssues)
  const [sprints, decisionDays] = await Promise.all([
    loadSprints(docsRoot, parseIssues),
    loadDecisions(docsRoot, parseIssues),
  ])

  return {
    epics,
    versions,
    sprints,
    decisionDays,
    issues: [...parseIssues, ...structureIssues],
  }
}

export function mergeMeridianProject(
  core: MeridianProjectCore,
  supplement: MeridianProjectSupplement,
): MeridianProjectData {
  const coreParseIssues = core.issues.filter((issue) => issue.scope === "parse")
  const supplementParseIssues = supplement.issues.filter(
    (issue) => issue.scope === "parse",
  )
  const structureIssues = supplement.issues.filter((issue) => issue.scope === "doc")

  const issues = buildIndexIssues(
    core.phaseDocuments,
    core.userStories,
    supplement.epics,
    supplement.versions,
    supplement.sprints,
    [...coreParseIssues, ...supplementParseIssues],
    structureIssues,
  )

  return {
    phaseDocuments: core.phaseDocuments,
    userStories: core.userStories,
    epics: supplement.epics,
    versions: supplement.versions,
    sprints: supplement.sprints,
    decisionDays: supplement.decisionDays,
    board: core.board,
    issues,
  }
}

/** Full load (tests and scripts). Prefer staged core + supplement in the UI. */
export async function loadMeridianProject(
  docsRoot: MeridianDocsRoot,
): Promise<MeridianProjectData> {
  const core = await loadMeridianProjectCore(docsRoot)
  const supplement = await loadMeridianProjectSupplement(docsRoot)
  return mergeMeridianProject(core, supplement)
}

/** Reads US bodies from disk and returns body-dependent protocol issues and doc badges. */
export async function enrichUserStoryValidation(
  docsRoot: MeridianDocsRoot,
  userStories: UserStory[],
): Promise<StoryValidationEnrichment> {
  const bodyIssues: MonitorIssue[] = []
  const documentationBadges = new Map<string, StoryDocumentationBadge | null>()

  if (userStories.length === 0) {
    return { bodyIssues, documentationBadges }
  }

  let files: Awaited<ReturnType<MeridianDocsRoot["listFiles"]>>
  try {
    files = await docsRoot.listFiles("us", USER_STORY_FILENAME_PATTERN)
  } catch {
    return { bodyIssues, documentationBadges }
  }

  const pathByFilename = new Map(files.map((file) => [file.name, file.relativePath]))

  await mapWithConcurrency(userStories, USER_STORY_BODY_CONCURRENCY, async (story) => {
    const relativePath = pathByFilename.get(`${story.id}.md`)
    if (!relativePath) {
      documentationBadges.set(story.id, null)
      return
    }

    try {
      const raw = await docsRoot.readText(relativePath)
      const body = splitMarkdown(raw).body
      const storyBodies = new Map([[story.id, body]])

      bodyIssues.push(...collectStoryProtocolIssues([story], storyBodies))
      documentationBadges.set(story.id, resolveStoryDocumentationBadge(story, body))
    } catch {
      documentationBadges.set(story.id, null)
    }
  })

  return { bodyIssues, documentationBadges }
}

/** @deprecated Use loadMeridianProject — kept as alias for tests and imports. */
export const buildProjectIndex = loadMeridianProject
