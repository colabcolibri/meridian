#!/usr/bin/env bash
# Symlink .agent kit into .cursor for Cursor IDE indexing.
# Also syncs app-desktop/docs/templates/ in this kit repo (human mirror).
# Run from repository root: ./.agent/scripts/sync_cursor_kit.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
AGENT="${ROOT}/.agent"
CURSOR="${ROOT}/.cursor"
REGISTRY="${AGENT}/references/templates"
DOCS_TPL="${ROOT}/app-desktop/docs/templates"

if [[ ! -d "${AGENT}" ]]; then
  echo "ERROR: missing .agent at ${AGENT}" >&2
  exit 1
fi

if [[ ! -d "${REGISTRY}" ]]; then
  echo "ERROR: missing template registry at ${REGISTRY}" >&2
  exit 1
fi

mkdir -p "${CURSOR}/rules" "${CURSOR}/skills" "${CURSOR}/agents" "${CURSOR}/commands" "${CURSOR}/references/templates"

link() {
  local target="$1"
  local linkpath="$2"
  mkdir -p "$(dirname "${linkpath}")"
  rm -f "${linkpath}"
  ln -s "${target}" "${linkpath}"
  echo "link ${linkpath} -> ${target}"
}

# All registry templates → .cursor/references/templates/
# From .cursor/references/templates/ to repo root = ../../../ (3 levels, NOT 4)
for tpl_file in "${REGISTRY}"/*.md; do
  [[ -f "${tpl_file}" ]] || continue
  name="$(basename "${tpl_file}")"
  link "../../../.agent/references/templates/${name}" "${CURSOR}/references/templates/${name}"
done

# Same registry → app-desktop/docs/templates/ (kit dogfooding mirror)
if [[ -d "${ROOT}/app-desktop/docs" ]]; then
  mkdir -p "${DOCS_TPL}"
  for tpl_file in "${REGISTRY}"/*.md; do
    [[ -f "${tpl_file}" ]] || continue
    name="$(basename "${tpl_file}")"
    # Skip if real README.md ever lands in registry; keep docs/templates/README.md as human guide
    [[ "${name}" == "README.md" ]] && continue
    link "../../../.agent/references/templates/${name}" "${DOCS_TPL}/${name}"
  done
  echo "Synced human mirror: ${DOCS_TPL}"
fi

# Skills (directories with SKILL.md)
for skill_dir in "${AGENT}"/skills/*/; do
  [[ -d "${skill_dir}" ]] || continue
  name="$(basename "${skill_dir}")"
  link "../../.agent/skills/${name}" "${CURSOR}/skills/${name}"
done

# Authoring guide (doc.md is not in a skill folder)
mkdir -p "${CURSOR}/skills/meridian-authoring"
link "../../../.agent/skills/doc.md" "${CURSOR}/skills/meridian-authoring/SKILL.md"

# Agents
for agent_file in "${AGENT}"/agents/*.md; do
  [[ -f "${agent_file}" ]] || continue
  name="$(basename "${agent_file}")"
  link "../../.agent/agents/${name}" "${CURSOR}/agents/${name}"
done

# Workflows -> Cursor slash commands
for workflow_file in "${AGENT}"/workflows/*.md; do
  [[ -f "${workflow_file}" ]] || continue
  name="$(basename "${workflow_file}")"
  link "../../.agent/workflows/${name}" "${CURSOR}/commands/${name}"
done

# Always-on rule (formato .mdc do Cursor)
link "../../.agent/rules/meridian.mdc" "${CURSOR}/rules/meridian.mdc"

# README local do adapter
link "../../.agent/CURSOR_ADAPTER.md" "${CURSOR}/README.md"

echo ""
echo "Done. Cursor adapter at ${CURSOR}"
echo "Templates: ${REGISTRY} → .cursor/references/templates/ (+ app-desktop/docs/templates/ when present)"
echo "Source: .agent/ (commit) → .cursor/ (local symlinks, gitignored)"
