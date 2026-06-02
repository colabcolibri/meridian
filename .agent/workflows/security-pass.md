---
description: Review and deepen security documentation before architecture or implementation.
---

# /security-pass — revisão de segurança

$ARGUMENTS

---

## Regras críticas

1. Use `security-steward` + `@[skills/security-review]`
2. Ler `references/checklists.md` por completo
3. Atualizar `02_security.md`
4. Decisões relevantes → `11_decisions.md`
5. Bloquear silenciosamente arquitetura `approved` se gaps críticos abertos

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: SECURITY REVIEW

RULES:
1. security-steward Phase 0
2. Full checklist pass
3. Document risks, mitigations, AI-agent rules for project
4. No weakening controls without logged decision
5. Report blockers to process-manager if needed
```

---

## Saída

```txt
02_security status:
Critical findings:
Mitigations proposed:
Blocked docs/phases:
Decisions logged:
```

---

## Depois

```txt
Próximo: manager aprova 02_security → /architecture quando estável
```
