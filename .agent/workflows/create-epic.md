---
description: Create a Meridian epic file in docs/epics.
---

# /create-epic — criar epic

$ARGUMENTS

---

## Regras críticas

1. Use `documentation-strategist` + `@[skills/create-epic]`
2. **Gate:** `05_architecture.md` `approved`; `03_user_types.md` `approved` para perfis do epic
3. Template: `references/epic-template.md`
4. Epic = **capacidade de produto**, não módulo em `src/`
5. Salvar `docs/epics/EPIC-XX.md` (fonte de verdade)
6. **Não** cria user story — US vem depois com `/create-us` (exige `05_architecture` approved)
7. Rodar `validate_meridian.py` quando possível

---

## Task

```txt
CONTEXT:
- User Request: $ARGUMENTS
- Mode: CREATE EPIC

RULES:
1. documentation-strategist Phase 0 — verify scope + user types
2. If blocked, report smallest doc to fix
3. List docs/epics/EPIC-*.md → next ID = max + 1 (EPIC-07, EPIC-08…)
4. Fill epic-template.md: outcome (produto), Capacidade, Fora deste epic
5. Validate profiles against 03_user_types.md
6. Save docs/epics/EPIC-XX.md (filename = id)
7. Save epic file in docs/epics/
8. update-decisions-log if catalog or product boundaries change
9. validate_meridian.py <project-root>
```

---

## Saída

```txt
Epic created:
File: docs/epics/EPIC-XX.md
Outcome:
Versions:
Profiles:
epic file saved: yes | no
Validation: passed | warnings | blocked
Open questions:
Next step: /create-us (after 05_architecture approved)
```

---

## Exemplos

| Pedido | Resultado |
| ------ | --------- |
| `/create-epic exportar relatório PDF` | EPIC-07 com outcome de produto + perfis |
| `/create-epic` sem capacidade clara | Perguntar: quem usa, o quê entrega, o que fica fora |
| `/create-us` sem epic existente | Bloquear US → `/create-epic` primeiro |
