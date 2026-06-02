# Cursor adapter (Meridian kit)

O Cursor **não** indexa `.agent/` automaticamente. Esta pasta espelha o kit para o IDE.

| Cursor | Fonte canônica (portátil) |
| ------ | ------------------------- |
| `.cursor/rules/` | `.agent/rules/` + protocolo |
| `.cursor/skills/` | `.agent/skills/` |
| `.cursor/agents/` | `.agent/agents/` |
| `.cursor/commands/` | `.agent/workflows/` (slash commands) |

## Regenerar links

```bash
./.agent/scripts/sync_cursor_kit.sh
```

Edite sempre em `.agent/` primeiro; depois rode o script. Em projetos só-Cursor sem Antigravity, você pode manter apenas `.cursor/` — mas neste repositório a fonte de verdade do kit é `.agent/`.

## Não commitar duplicata

Esta pasta usa **symlinks** para `.agent/`. Não edite arquivos aqui diretamente.
