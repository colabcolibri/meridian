# Schema — `docs/decisions/YYYY-MM-DD.json`

## Arquivo diário

```json
{
  "date": "2026-06-02",
  "entries": [
    {
      "time": "17:30",
      "title": "Título objetivo",
      "affected_document": "caminho/do/doc.md",
      "what_changed": "descrição factual",
      "why_changed": "contexto e motivação",
      "impact": "docs afetados; marcar review",
      "responsible": "papel ou pessoa"
    }
  ]
}
```

## Regras

| Campo | Obrigatório | Formato |
| ----- | ----------- | ------- |
| `date` | sim | `YYYY-MM-DD`, igual ao nome do arquivo |
| `entries` | sim | array; pode ser vazio só no bootstrap do dia |
| `entries[].time` | sim | `HH:MM` (24h) |
| `entries[].title` | sim | string não vazia |
| `entries[].affected_document` | sim | string |
| `entries[].what_changed` | sim | string |
| `entries[].why_changed` | sim | string |
| `entries[].impact` | sim | string |
| `entries[].responsible` | sim | string |

## Ordem

- **Prepend:** nova decisão no **início** de `entries` (`entries.unshift(...)`).
- Dias ordenados pelo nome do arquivo (ISO date).

## Validação

```bash
python3 .agent/scripts/validate_meridian.py <project-root>
```

## Relacionados

- Stub de regras: `docs/11_decisions.md`
- Skill: `update-decisions-log`
- Protocolo: `.agent/MERIDIAN.md` §11.12
