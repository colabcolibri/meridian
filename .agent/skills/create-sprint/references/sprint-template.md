# Sprint template

```md
---
id: v1-S1
version: v1
title: Short sprint name
status: planned
done_when: "Objective sprint closure condition."
stories: [US-0023, US-0024]
---

# v1-S1 — Short sprint name

Sprint for version **v1**.

| US      | Status | MoSCoW | Depends on | Epic    | Description |
| ------- | ------ | ------ | ---------- | ------- | --------- |
| US-0023 | ❌     | Must   | —          | EPIC-03 | …         |
```

## Rules

- `id` must match filename (`v1-S1.md`).
- `version` must exist in `docs/versions/`.
- `stories` in frontmatter is canonical list for validation; body table is optional (readability).
