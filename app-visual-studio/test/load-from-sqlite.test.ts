import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import * as fs from "node:fs"
import * as os from "node:os"
import * as path from "node:path"
import { test } from "node:test"

import { loadPlanningPayloadFromSqliteDetailed } from "../src/load-from-sqlite.ts"

const KIT_ROOT = path.resolve(import.meta.dirname, "../..")

function writeKit(root: string): void {
  fs.cpSync(path.join(KIT_ROOT, ".agent"), path.join(root, ".agent"), { recursive: true })
}

function writeDocsScope(root: string): void {
  const docs = path.join(root, "docs")
  fs.mkdirSync(docs, { recursive: true })
  fs.writeFileSync(path.join(docs, "00_scope.md"), "---\nstatus: draft\n---\n# scope\n")
}

function seedSprintWithStories(packageRoot: string): void {
  const bootstrap = path.join(KIT_ROOT, ".agent", "scripts", "bootstrap_meridian_db.py")
  execFileSync("python3", [bootstrap, packageRoot], { encoding: "utf-8" })
  const py = `
import sqlite3, json
from pathlib import Path
root = Path(${JSON.stringify(packageRoot)})
conn = sqlite3.connect(root / ".meridian" / "meridian.db")
conn.execute("INSERT OR IGNORE INTO versions (id, title, status) VALUES ('v1', 'Test', 'active')")
conn.execute("INSERT OR IGNORE INTO epics (id, title, status) VALUES ('EPIC-01', 'Epic', 'active')")
for sid in ["US-0001", "US-0002"]:
    conn.execute(
        """INSERT OR REPLACE INTO user_stories (
          id, title, epic_id, version_id, status, moscow, depends_on_json, ready,
          done_when, tests, tests_status, body_markdown
        ) VALUES (?, ?, 'EPIC-01', 'v1', '❌', 'Must', '[]', 0, 'done', 'required', 'pending', ?)""",
        (sid, sid, f"---\\nid: {sid}\\n---\\n"),
    )
conn.execute(
    """INSERT OR REPLACE INTO sprints (
      id, version_id, title, status, goal, done_when, stories_json
    ) VALUES ('v1-S1', 'v1', 'Sprint 1', 'active', 'Goal', 'Done when', ?)""",
    (json.dumps(["US-0001", "US-0002"]),),
)
conn.commit()
conn.close()
`
  execFileSync("python3", ["-c", py], { encoding: "utf-8" })
  execFileSync("python3", [bootstrap, packageRoot], { encoding: "utf-8" })
}

test("sqlite planning export maps sprint stories to storyIds", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "meridian-sqlite-"))
  writeKit(tmp)
  writeDocsScope(tmp)
  seedSprintWithStories(tmp)

  const { payload, error } = loadPlanningPayloadFromSqliteDetailed(tmp)
  assert.equal(error, null)
  assert.ok(payload)
  assert.equal(payload.sprints.length, 1)
  assert.deepEqual(payload.sprints[0]?.storyIds, ["US-0001", "US-0002"])
  assert.equal(
    payload.stories.find((s) => s.id === "US-0001")?.sprint,
    "v1-S1",
  )
})
