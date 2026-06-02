import type { PhaseDocument, SetupStepState, UserStory } from "./types"

export function getUnmetDependencies(
  document: PhaseDocument,
  documents: PhaseDocument[],
) {
  return document.dependsOn.filter((dependencyId) => {
    const dependency = documents.find((item) => item.id === dependencyId)
    return dependency?.status !== "approved"
  })
}

export function isDocumentBlocked(document: PhaseDocument, documents: PhaseDocument[]) {
  return getUnmetDependencies(document, documents).length > 0
}

export function getSetupStepState(
  document: PhaseDocument,
  documents: PhaseDocument[],
): SetupStepState {
  if (document.status === "approved") {
    if (isDocumentBlocked(document, documents)) {
      return "alert"
    }
    return "complete"
  }

  if (isDocumentBlocked(document, documents)) {
    return "locked"
  }

  return "active"
}

export function getSetupStepLabel(
  document: PhaseDocument,
  documents: PhaseDocument[],
): string {
  const state = getSetupStepState(document, documents)

  if (state === "locked") {
    const unmet = getUnmetDependencies(document, documents)
    return `Not started — waiting for ${unmet.join(", ")}`
  }

  if (state === "complete") {
    return "Ready"
  }

  if (state === "alert") {
    return "Attention — approved before dependencies"
  }

  if (document.status === "review") {
    return "In progress — under review"
  }

  return "In progress — in draft"
}

export function countSetupStepsByState(
  documents: PhaseDocument[],
  allDocuments: PhaseDocument[],
): Record<SetupStepState, number> {
  const counts: Record<SetupStepState, number> = {
    locked: 0,
    active: 0,
    complete: 0,
    alert: 0,
  }

  for (const document of documents) {
    counts[getSetupStepState(document, allDocuments)] += 1
  }

  return counts
}

export function getPhaseGroupAccent(
  documents: PhaseDocument[],
  allDocuments: PhaseDocument[],
): SetupStepState {
  const counts = countSetupStepsByState(documents, allDocuments)
  if (counts.alert > 0) {
    return "alert"
  }
  if (counts.active > 0) {
    return "active"
  }
  if (counts.complete === documents.length && documents.length > 0) {
    return "complete"
  }
  return "locked"
}

export function getApprovedCount(documents: PhaseDocument[]) {
  return documents.filter((document) => document.status === "approved").length
}

export function getSetupProgress(documents: PhaseDocument[]) {
  const complete = documents.filter(
    (document) => getSetupStepState(document, documents) === "complete",
  ).length
  return { complete, total: documents.length }
}

export function canStartStory(story: UserStory, stories: UserStory[]) {
  return story.dependsOn.every((dependencyId) => {
    const dependency = stories.find((item) => item.id === dependencyId)
    return dependency?.status === "✅"
  })
}

export function sortStoriesById(stories: UserStory[]) {
  return [...stories].sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true }),
  )
}

export function groupStoriesByStatus(stories: UserStory[]) {
  const order: UserStory["status"][] = ["❌", "🔶", "✅", "🧊"]
  return order.map((status) => ({
    status,
    stories: sortStoriesById(stories.filter((story) => story.status === status)),
  }))
}

export function countStoriesByEpic(stories: UserStory[], epicId: string) {
  const epicStories = stories.filter((story) => story.epic === epicId)
  return {
    total: epicStories.length,
    done: epicStories.filter((story) => story.status === "✅").length,
  }
}

export function countStoriesByVersion(stories: UserStory[], versionId: string) {
  const versionStories = stories.filter((story) => story.version === versionId)
  return {
    total: versionStories.length,
    done: versionStories.filter((story) => story.status === "✅").length,
  }
}
