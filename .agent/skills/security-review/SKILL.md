---
name: security-review
description: Reviews Meridian security posture, including secrets, threat model, AI-agent safety, OWASP, dependencies and Git hygiene. Use for 02_security.md or security hardening.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write
---

# Security review (Meridian)

> Segurança antes de arquitetura e antes de agentes executarem trabalho sensível.

## Selective reading

| Arquivo | Quando ler |
| ------- | ---------- |
| `references/checklists.md` | Durante revisão completa ou criação de `02_security.md` |

## Quando acionar

- Criar ou revisar `02_security.md`
- Pedido de threat model, segredos, OWASP, supply chain
- Antes de `07_architecture.md` ir para `approved`
- Suspeita de violação por agente (comando destrutivo, vazamento)

## Procedimento

1. Ler `00_scope.md`, `01_tech_stack.md`, `03_user_types.md` (contexto).
2. Percorrer **todas** as seções de `references/checklists.md`.
3. Atualizar `02_security.md` com riscos, mitigações, pendências, fora de escopo.
4. Registrar decisões relevantes via `update-decisions-log`.
5. Não enfraquecer auth/validação/logging sem decisão explícita.

## Resultado em `02_security.md`

- Riscos priorizados
- Decisões de segurança
- Mitigações e pendências
- Impacto em arquitetura, banco, API, ambientes
- Postura para agentes de IA no projeto

## Saída

```txt
Security review:
02_security status:
Critical gaps:
Decisions logged:
Blocked until:
```
