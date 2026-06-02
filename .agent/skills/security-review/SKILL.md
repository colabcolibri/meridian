---
name: security-review
description: Reviews Meridian security posture, including secrets, threat model, AI-agent safety, OWASP, dependencies and Git hygiene. Use for 02_security.md or security hardening.
---

# Skill — Revisão de Segurança Meridian

Use esta skill quando o usuário pedir revisão de segurança, criação de
`02_security.md`, endurecimento da fundação ou análise de risco antes de implementação.

## Objetivo

Garantir que segurança seja tratada antes da arquitetura e antes de agentes de IA
executarem trabalho sensível.

## Checklist obrigatório

### 1. Segredos

- `.env` e `.env.*` estão no `.gitignore`?
- Existe `.env.example` sem valores reais?
- Há secrets hardcoded no código, docs, testes ou scripts?
- Logs podem vazar tokens, cookies, headers ou PII?
- Existe plano para rotação de chaves quando aplicável?

### 2. Dados sensíveis

- Quais dados são PII?
- Quais dados são financeiros, médicos, legais ou regulados?
- Onde esses dados são armazenados?
- Onde aparecem em logs?
- Qual política de retenção existe?
- Quais dados não deveriam ser coletados?

### 3. Autenticação

- O sistema exige login?
- O modelo é sessão, JWT, OAuth, SSO ou outro?
- Como tokens expiram?
- Como logout e revogação funcionam?
- Há MFA ou requisito futuro?

### 4. Autorização

- Quais perfis existem em `03_user_types.md`?
- O modelo é RBAC, ABAC ou custom?
- Qual é a permissão mínima para cada ação sensível?
- Há isolamento multi-tenant?
- Há proteção contra acesso horizontal indevido?

### 5. Inputs e outputs

- Inputs são validados no frontend?
- Inputs são validados no backend?
- Schemas são compartilhados quando fizer sentido?
- Outputs são escapados/renderizados com segurança?
- Uploads têm tipo, tamanho e conteúdo validados?

### 6. OWASP aplicado ao contexto

Avalie explicitamente:

- Broken Access Control
- Cryptographic Failures
- Injection
- Insecure Design
- Security Misconfiguration
- Vulnerable and Outdated Components
- Identification and Authentication Failures
- Software and Data Integrity Failures
- Security Logging and Monitoring Failures
- Server-Side Request Forgery

### 7. Agentes de IA

- O agente recebeu arquivos sensíveis desnecessariamente?
- O agente tentou executar comando destrutivo?
- O agente está prestes a enviar conteúdo privado para serviço externo?
- O agente está alterando segurança sem registrar decisão?
- O agente está assumindo permissões não documentadas?

### 8. Dependências

- Há dependências desnecessárias?
- Há lockfile único?
- Há comando de audit definido?
- Há estratégia de atualização?
- Há bibliotecas abandonadas ou sem manutenção?

### 9. Git e supply chain

- `.gitignore` foi criado no início?
- Hooks locais estão configurados quando aplicável?
- Existe lint/format/test antes de commit?
- Há plano para secret scanning?
- Há plano para CI?

## Resultado esperado

Atualize ou crie `02_security.md` com:

- riscos;
- decisões;
- mitigações;
- pendências explícitas;
- itens fora de escopo;
- impactos em arquitetura, banco, API e ambientes.

Se alguma decisão relevante for tomada, registre em `11_decisions.md`.
