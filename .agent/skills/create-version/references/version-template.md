# Version template (release)

```md
---
id: vX
title: Short release name
status: planned
outcome: "When this release is delivered at product level."
---

# vX — Short release name

## Objective

Clear sentence of what this release delivers to user/manager.

## Done criteria

Objective condition to mark version as `complete`.

## Included in this version

- Planned capabilities and US (reference by ID, do not copy epic text)

## Explicitly out

- What stays for future versions

## Go-live checklist

### Product

- [ ] …

## Sprints

- `vX-S1` — (create in docs/sprints/ with create-sprint)
```

## Status

| Value | Meaning |
| ----- | ----------- |
| `planned` | Defined, not yet delivered |
| `active` | Release in progress |
| `complete` | Outcome reached |

## Relationship with US and epics

- US uses `version: vX` in frontmatter — reference by ID.
- Epic uses `versions: [vX]` — which releases the capability participates in.
- Version detail stays **only** in this file.
