export type DeliveryFolder = "us" | "epics" | "versions" | "sprints"

/** Parse `us/US-0125.md` style paths used by board and planning panels. */
export function parseDeliveryRelativePath(
  relativePath: string,
): { folder: DeliveryFolder; id: string } | null {
  const normalized = relativePath.replace(/\\/g, "/")
  const match = normalized.match(/^(us|epics|versions|sprints)\/([^/]+)\.md$/i)
  if (!match) {
    return null
  }
  return {
    folder: match[1].toLowerCase() as DeliveryFolder,
    id: match[2],
  }
}

export function deliveryRelativePath(folder: DeliveryFolder, id: string): string {
  return `${folder}/${id}.md`
}
