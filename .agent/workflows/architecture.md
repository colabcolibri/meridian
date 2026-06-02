---
description: Create or review 05_architecture.md after required Meridian documents are approved.
---

# /architecture — arquitetura

$ARGUMENTS

---

## Regras críticas

1. Use `architecture-guardian`
2. Pré-requisitos: scope, stack, security, users (mínimo draft)
3. Alinhar com `02_security` — carregar `security-review` se gaps
4. Mudança material → `docs/decisions/YYYY-MM-DD.json` (skill `update-decisions-log`)
5. Sem código de produto neste workflow (salvo pedido explícito em $ARGUMENTS)

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: ARCHITECTURE DOC

RULES:
1. architecture-guardian Phase 0 gate
2. Read 00, 01, 02, 03, 04, 06 before editing 07
3. Fill checklist in agent file
4. Cross-check 08/09 if they exist
5. Set status draft or review — not approved without human
```

---

## Saída

```txt
05_architecture status:
Aligned with: [docs]
Drift detected:
Proposed changes:
Security follow-ups:
Ready for review: yes | no
```
