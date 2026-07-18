import * as vscode from "vscode"

import { loadDeliveryMarkdownFromSqlite } from "./load-delivery-markdown.js"
import {
  buildMeridianDeliveryUriParts,
  clearMeridianDeliveryCache,
  deleteMeridianDeliveryContent,
  MERIDIAN_DOCUMENT_SCHEME,
  parseMeridianDeliveryUriPath,
  primeMeridianDeliveryContent,
  readMeridianDeliveryContent,
  relativePathFromMeridianUriPath,
  storeMeridianDeliveryContent,
} from "./meridian-delivery-uri.js"

export function buildMeridianDeliveryUri(packageRoot: string, relativePath: string): vscode.Uri {
  const parts = buildMeridianDeliveryUriParts(packageRoot, relativePath)
  return vscode.Uri.from(parts)
}

export function relativePathFromMeridianUri(uri: vscode.Uri): string {
  return relativePathFromMeridianUriPath(uri.path)
}

export { clearMeridianDeliveryCache, MERIDIAN_DOCUMENT_SCHEME }

export function primeMeridianDeliveryUri(uri: vscode.Uri, content: string): void {
  primeMeridianDeliveryContent(uri.toString(), content)
}

export class MeridianDocumentProvider implements vscode.TextDocumentContentProvider {
  private readonly onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>()

  readonly onDidChange = this.onDidChangeEmitter.event

  provideTextDocumentContent(uri: vscode.Uri): string {
    const key = uri.toString()
    const cached = readMeridianDeliveryContent(key)
    if (cached !== undefined) {
      return cached
    }

    const parsed = parseMeridianDeliveryUriPath(uri.path)
    if (!parsed) {
      return ""
    }
    const markdown =
      loadDeliveryMarkdownFromSqlite(parsed.packageRoot, parsed.relativePath) ?? ""
    storeMeridianDeliveryContent(key, markdown)
    return markdown
  }

  invalidate(uri: vscode.Uri): void {
    deleteMeridianDeliveryContent(uri.toString())
    this.onDidChangeEmitter.fire(uri)
  }

  invalidateAll(): void {
    clearMeridianDeliveryCache()
  }
}
