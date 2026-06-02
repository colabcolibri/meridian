# Checklists de segurança Meridian

Use com `02_security.md`. Marque cada seção no doc ou no relatório.

## 1. Segredos

- [ ] `.env` e `.env.*` no `.gitignore`
- [ ] `.env.example` sem valores reais
- [ ] Sem secrets em código, docs, testes
- [ ] Logs não vazam tokens/PII
- [ ] Plano de rotação de chaves (se aplicável)

## 2. Dados sensíveis

- [ ] PII identificada
- [ ] Dados regulados mapeados
- [ ] Armazenamento e retenção definidos
- [ ] Minimização de coleta

## 3. Autenticação

- [ ] Modelo definido (sessão/JWT/OAuth/SSO)
- [ ] Expiração e revogação
- [ ] MFA (atual ou futuro documentado)

## 4. Autorização

- [ ] Alinhado a `03_user_types.md`
- [ ] RBAC/ABAC/custom explícito
- [ ] Menor privilégio por ação sensível
- [ ] Multi-tenant / IDOR considerados

## 5. Inputs e outputs

- [ ] Validação server-side
- [ ] Schemas compartilhados quando útil
- [ ] Uploads com limites e tipo

## 6. OWASP (contextual)

- [ ] Broken Access Control
- [ ] Cryptographic Failures
- [ ] Injection
- [ ] Insecure Design
- [ ] Security Misconfiguration
- [ ] Vulnerable Components
- [ ] Auth Failures
- [ ] Integrity Failures
- [ ] Logging/Monitoring Failures
- [ ] SSRF

## 7. Agentes de IA

- [ ] Sem arquivos sensíveis desnecessários no contexto
- [ ] Sem comandos destrutivos não aprovados
- [ ] Sem envio de dados privados a serviços externos sem permissão
- [ ] Mudanças de segurança registradas em `docs/decisions/YYYY-MM-DD.json`

## 8. Dependências

- [ ] Lockfile único
- [ ] `npm audit` / equivalente documentado
- [ ] Estratégia de atualização

## 9. Git e supply chain

- [ ] `.gitignore` desde o início
- [ ] Hooks lint/test (se aplicável)
- [ ] Secret scanning planejado
- [ ] CI planejado
