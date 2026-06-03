import type { MonitorIssue } from "@/domain/meridian/monitor-issues"
import {
  validateEpicStructure,
  validateUserStoryStructure,
  validateVersionStructure,
} from "@/domain/meridian/section-contracts"
import { validateStoryBody, validateStoryReadiness } from "@/domain/meridian/story-body"
import type {
  Epic,
  PhaseDocument,
  ProductVersion,
  Sprint,
  UserStory,
} from "@/domain/meridian/types"
import { getSetupStepState } from "@/domain/meridian/validators"

function severityForStoryMessage(
  story: UserStory,
  message: string,
): MonitorIssue["severity"] {
  if (message.startsWith("Record:")) {
    return story.status === "🔶" ? "warning" : "error"
  }

  const isError =
    story.status === "🔶" ||
    story.status === "✅" ||
    message.includes("tests_status: done") ||
    message.includes("tests: none") ||
    message.includes("tests: required")

  return isError ? "error" : "warning"
}

export function collectDocumentProtocolIssues(
  documents: PhaseDocument[],
): MonitorIssue[] {
  const issues: MonitorIssue[] = []

  for (const document of documents) {
    if (getSetupStepState(document, documents) === "alert") {
      issues.push({
        file: `${document.id}.md`,
        message: "Document is approved while dependencies are not yet approved.",
        severity: "error",
        scope: "doc",
        targetId: document.id,
      })
    }
  }

  return issues
}

export function collectStoryProtocolIssues(
  stories: UserStory[],
  storyBodies: Map<string, string>,
): MonitorIssue[] {
  const issues: MonitorIssue[] = []

  for (const story of stories) {
    const body = storyBodies.get(story.id) ?? ""
    const strict = story.ready !== undefined

    for (const message of validateUserStoryStructure(
      story.id,
      body,
      strict,
      story.status,
    )) {
      const isRecommendedOnly =
        message.includes("(recommended") || message.includes("legacy subsections")
      issues.push({
        file: `us/${story.id}.md`,
        message,
        severity: isRecommendedOnly ? "warning" : "error",
        scope: "us",
        targetId: story.id,
      })
    }

    const messages = validateStoryBody(story, body)

    for (const message of messages) {
      issues.push({
        file: `us/${story.id}.md`,
        message,
        severity: severityForStoryMessage(story, message),
        scope: "us",
        targetId: story.id,
      })
    }

    for (const message of validateStoryReadiness(story, body)) {
      issues.push({
        file: `us/${story.id}.md`,
        message,
        severity: story.status === "🔶" ? "warning" : "warning",
        scope: "us",
        targetId: story.id,
      })
    }
  }

  return issues
}

export function collectEpicStructureIssues(
  epics: Epic[],
  epicBodies: Map<string, string>,
): MonitorIssue[] {
  const issues: MonitorIssue[] = []

  for (const epic of epics) {
    const body = epicBodies.get(epic.id) ?? ""
    for (const message of validateEpicStructure(epic.id, body)) {
      issues.push({
        file: `epics/${epic.id}.md`,
        message,
        severity: "error",
        scope: "doc",
        targetId: epic.id,
      })
    }
  }

  return issues
}

export function collectVersionStructureIssues(
  versions: ProductVersion[],
  versionBodies: Map<string, string>,
): MonitorIssue[] {
  const issues: MonitorIssue[] = []

  for (const version of versions) {
    const body = versionBodies.get(version.id) ?? ""
    for (const message of validateVersionStructure(version.id, body)) {
      issues.push({
        file: `versions/${version.id}.md`,
        message,
        severity: "error",
        scope: "doc",
        targetId: version.id,
      })
    }
  }

  return issues
}

export function collectEpicProtocolIssues(
  stories: UserStory[],
  epics: Epic[],
): MonitorIssue[] {
  const epicIds = new Set(epics.map((epic) => epic.id))
  const issues: MonitorIssue[] = []

  for (const story of stories) {
    if (!epicIds.has(story.epic)) {
      issues.push({
        file: `us/${story.id}.md`,
        message: `epic "${story.epic}" does not exist in docs/epics/.`,
        severity: "error",
        scope: "us",
        targetId: story.id,
      })
    }
  }

  return issues
}

export function collectVersionProtocolIssues(
  stories: UserStory[],
  epics: Epic[],
  versions: ProductVersion[],
  sprints: Sprint[],
): MonitorIssue[] {
  const versionIds = new Set(versions.map((version) => version.id))
  const storyIds = new Set(stories.map((story) => story.id))
  const issues: MonitorIssue[] = []

  for (const story of stories) {
    if (versionIds.size > 0 && !versionIds.has(story.version)) {
      issues.push({
        file: `us/${story.id}.md`,
        message: `version "${story.version}" does not exist in docs/versions/.`,
        severity: "error",
        scope: "us",
        targetId: story.id,
      })
    }
  }

  for (const epic of epics) {
    for (const versionRef of epic.versions) {
      if (versionIds.size > 0 && !versionIds.has(versionRef)) {
        issues.push({
          file: `epics/${epic.id}.md`,
          message: `versions references "${versionRef}" which does not exist in docs/versions/.`,
          severity: "error",
          scope: "doc",
          targetId: epic.id,
        })
      }
    }
  }

  for (const sprint of sprints) {
    if (versionIds.size > 0 && !versionIds.has(sprint.versionId)) {
      issues.push({
        file: `sprints/${sprint.id}.md`,
        message: `version "${sprint.versionId}" does not exist in docs/versions/.`,
        severity: "error",
        scope: "doc",
        targetId: sprint.id,
      })
    }

    for (const storyId of sprint.storyIds) {
      if (!storyIds.has(storyId)) {
        issues.push({
          file: `sprints/${sprint.id}.md`,
          message: `stories references "${storyId}" with no file in docs/us/.`,
          severity: "warning",
          scope: "doc",
          targetId: sprint.id,
        })
      }
    }
  }

  return issues
}

export function collectDeliveryGateIssues(
  phaseDocuments: PhaseDocument[],
  userStories: UserStory[],
): MonitorIssue[] {
  if (userStories.length === 0) {
    return []
  }

  const architecture = phaseDocuments.find((doc) => doc.id === "05_architecture")
  if (architecture?.status !== "approved") {
    return [
      {
        file: "05_architecture.md",
        message:
          "User stories exist but 05_architecture is not approved (delivery gate).",
        severity: "error",
        scope: "doc",
        targetId: "05_architecture",
      },
    ]
  }

  return []
}

export function collectProtocolIssues(input: {
  phaseDocuments: PhaseDocument[]
  userStories: UserStory[]
  epics: Epic[]
  versions: ProductVersion[]
  sprints: Sprint[]
  storyBodies: Map<string, string>
  epicBodies: Map<string, string>
  versionBodies: Map<string, string>
}): MonitorIssue[] {
  return [
    ...collectDocumentProtocolIssues(input.phaseDocuments),
    ...collectDeliveryGateIssues(input.phaseDocuments, input.userStories),
    ...collectEpicStructureIssues(input.epics, input.epicBodies),
    ...collectVersionStructureIssues(input.versions, input.versionBodies),
    ...collectStoryProtocolIssues(input.userStories, input.storyBodies),
    ...collectEpicProtocolIssues(input.userStories, input.epics),
    ...collectVersionProtocolIssues(
      input.userStories,
      input.epics,
      input.versions,
      input.sprints,
    ),
  ]
}

export function countIssuesBySeverity(issues: MonitorIssue[]) {
  const errors = issues.filter((issue) => issue.severity === "error").length
  const warnings = issues.filter((issue) => issue.severity === "warning").length
  return { errors, warnings, total: issues.length }
}

export function issuesForTarget(issues: MonitorIssue[], targetId: string) {
  return issues.filter((issue) => issue.targetId === targetId)
}
