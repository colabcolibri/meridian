#!/usr/bin/env bash
# Symlink .agent kit into .cursor for Cursor IDE indexing.
# Run from repository root: ./.agent/scripts/sync_cursor_kit.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
AGENT="${ROOT}/.agent"
CURSOR="${ROOT}/.cursor"

if [[ ! -d "${AGENT}" ]]; then
  echo "ERROR: missing .agent at ${AGENT}" >&2
  exit 1
fi

mkdir -p "${CURSOR}/rules" "${CURSOR}/skills" "${CURSOR}/agents" "${CURSOR}/commands"

link() {
  local target="$1"
  local linkpath="$2"
  mkdir -p "$(dirname "${linkpath}")"
  rm -f "${linkpath}"
  ln -s "${target}" "${linkpath}"
  echo "link ${linkpath} -> ${target}"
}

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
echo "Source: .agent/ (commit) → .cursor/ (local symlinks, gitignored)"
