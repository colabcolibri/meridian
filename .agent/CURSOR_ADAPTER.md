# Cursor adapter (Meridian kit)

O Cursor **não** indexa `.agent/` automaticamente. A pasta `.cursor/` espelha o kit para o IDE — **gerada localmente**, fora do Git.

| Cursor | Fonte canônica |
| ------ | -------------- |
| `.cursor/rules/meridian.mdc` | `.agent/rules/meridian.mdc` |
| `.cursor/skills/` | `.agent/skills/` |
| `.cursor/agents/` | `.agent/agents/` |
| `.cursor/commands/` | `.agent/workflows/` |

## Regenerar (obrigatório após clone)

```bash
chmod +x .agent/scripts/sync_cursor_kit.sh   # uma vez
./.agent/scripts/sync_cursor_kit.sh
```

Edite sempre em `.agent/` primeiro; depois rode o script.

## Git

`.cursor/` está no `.gitignore` — symlinks locais, não duplicata versionada.
