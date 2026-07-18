import { execFileSync } from "node:child_process"
import * as path from "node:path"

import type { DeliveryFolder } from "./delivery-path.js"
import { parseDeliveryRelativePath } from "./delivery-path.js"
import type { DeliveryFormPayload, FormCatalog } from "./delivery-form-schema.js"
import { resolvePythonCommand, sqliteDbExists } from "./load-from-sqlite.js"
import { resolveExportScriptPath } from "./resolve-kit-scripts.js"

type FormExport = DeliveryFormPayload & { error?: string; catalog?: FormCatalog }

export type LoadFormResult =
  | { ok: true; payload: DeliveryFormPayload }
  | { ok: false; error: string }

export function loadDeliveryFormFromSqlite(
  packageRoot: string,
  relativePath: string,
  extensionPath?: string,
): LoadFormResult {
  const parsed = parseDeliveryRelativePath(relativePath)
  if (!parsed) {
    return { ok: false, error: `Invalid delivery path: ${relativePath}` }
  }
  if (!sqliteDbExists(packageRoot)) {
    return {
      ok: false,
      error: `.meridian/meridian.db not found under ${packageRoot}`,
    }
  }
  const script = resolveExportScriptPath(packageRoot, extensionPath)
  if (!script) {
    return {
      ok: false,
      error:
        "meridian_db_export.py not found. Run Meridian: Upgrade harness or open the meridian kit repo.",
    }
  }
  try {
    const stdout = execFileSync(
      resolvePythonCommand(),
      [script, packageRoot, "--entity", parsed.folder, "--id", parsed.id, "--format", "form"],
      { encoding: "utf-8", maxBuffer: 8 * 1024 * 1024 },
    )
    const data = JSON.parse(stdout) as FormExport
    if (data.error) {
      return { ok: false, error: data.error }
    }
    const sections: Record<string, string> = {}
    for (const [key, value] of Object.entries(data.sections ?? {})) {
      sections[key] = value ?? ""
    }
    return {
      ok: true,
      payload: {
        entity: parsed.folder,
        id: data.id ?? parsed.id,
        frontmatter: data.frontmatter ?? {},
        preamble: data.preamble ?? "",
        sections,
        catalog: data.catalog,
      },
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes("meridian_delivery_form")) {
      return {
        ok: false,
        error:
          "Kit scripts outdated (missing meridian_delivery_form.py). Use Meridian: Upgrade harness on this workspace.",
      }
    }
    return {
      ok: false,
      error: `Form export failed (${path.basename(script)}): ${message}`,
    }
  }
}

export type SaveFormResult = { ok: true; id: string } | { ok: false; error: string }

export function saveDeliveryFormToSqlite(
  packageRoot: string,
  relativePath: string,
  payload: DeliveryFormPayload,
  extensionPath?: string,
): SaveFormResult {
  const parsed = parseDeliveryRelativePath(relativePath)
  if (!parsed || !sqliteDbExists(packageRoot)) {
    return { ok: false, error: "Delivery path or SQLite database not found." }
  }
  const script = resolveExportScriptPath(packageRoot, extensionPath)
  if (!script) {
    return { ok: false, error: "meridian_db_export.py not found in kit." }
  }
  try {
    const stdout = execFileSync(
      resolvePythonCommand(),
      [
        script,
        packageRoot,
        "--entity",
        parsed.folder,
        "--id",
        parsed.id,
        "--write-form",
      ],
      {
        encoding: "utf-8",
        input: JSON.stringify({
          entity: parsed.folder,
          id: parsed.id,
          frontmatter: payload.frontmatter,
          preamble: payload.preamble,
          sections: payload.sections,
        }),
        maxBuffer: 8 * 1024 * 1024,
      },
    )
    const data = JSON.parse(stdout) as { ok?: boolean; error?: string; id?: string }
    if (!data.ok) {
      return { ok: false, error: data.error ?? "Save failed." }
    }
    return { ok: true, id: data.id ?? parsed.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: message }
  }
}

export function folderFromRelativePath(relativePath: string): DeliveryFolder | null {
  return parseDeliveryRelativePath(relativePath)?.folder ?? null
}
