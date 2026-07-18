import * as path from "node:path"

export const MERIDIAN_DOCUMENT_SCHEME = "meridian"
const ROOT_PATH_PREFIX = "/r/"

function packageRootHex(packageRoot: string): string {
  return Buffer.from(path.resolve(packageRoot), "utf-8").toString("hex")
}

function packageRootFromHex(hex: string): string | null {
  if (!/^[0-9a-f]+$/i.test(hex)) {
    return null
  }
  try {
    return Buffer.from(hex, "hex").toString("utf-8")
  } catch {
    return null
  }
}

export type MeridianDeliveryUriParts = {
  scheme: typeof MERIDIAN_DOCUMENT_SCHEME
  path: string
}

export function buildMeridianDeliveryUriParts(
  packageRoot: string,
  relativePath: string,
): MeridianDeliveryUriParts {
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\//, "")
  return {
    scheme: MERIDIAN_DOCUMENT_SCHEME,
    path: `${ROOT_PATH_PREFIX}${packageRootHex(packageRoot)}/${normalized}`,
  }
}

export function parseMeridianDeliveryUriPath(
  uriPath: string,
): { packageRoot: string; relativePath: string } | null {
  const match = uriPath.match(/^\/r\/([0-9a-f]+)\/(.+)$/i)
  if (!match) {
    return null
  }
  const packageRoot = packageRootFromHex(match[1])
  if (!packageRoot) {
    return null
  }
  return { packageRoot, relativePath: match[2] }
}

export function relativePathFromMeridianUriPath(uriPath: string): string {
  const parsed = parseMeridianDeliveryUriPath(uriPath)
  return parsed?.relativePath ?? uriPath.replace(/^\//, "")
}

const contentCache = new Map<string, string>()

export function meridianDeliveryCacheKey(parts: MeridianDeliveryUriParts): string {
  return `${parts.scheme}:${parts.path}`
}

export function primeMeridianDeliveryContent(key: string, content: string): void {
  contentCache.set(key, content)
}

export function readMeridianDeliveryContent(key: string): string | undefined {
  return contentCache.get(key)
}

export function deleteMeridianDeliveryContent(key: string): void {
  contentCache.delete(key)
}

export function clearMeridianDeliveryCache(): void {
  contentCache.clear()
}

export function storeMeridianDeliveryContent(key: string, content: string): void {
  if (content) {
    contentCache.set(key, content)
  }
}
