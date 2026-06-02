# Meridian security checklists

Use with `02_security.md`. Mark each section in the doc or report.

## 1. Secrets

- [ ] `.env` and `.env.*` in `.gitignore`
- [ ] `.env.example` without real values
- [ ] No secrets in code, docs, tests
- [ ] Logs do not leak tokens/PII
- [ ] Key rotation plan (if applicable)

## 2. Sensitive data

- [ ] PII identified
- [ ] Regulated data mapped
- [ ] Storage and retention defined
- [ ] Data collection minimization

## 3. Authentication

- [ ] Model defined (session/JWT/OAuth/SSO)
- [ ] Expiration and revocation
- [ ] MFA (current or future documented)

## 4. Authorization

- [ ] Aligned with `03_user_types.md`
- [ ] RBAC/ABAC/custom explicit
- [ ] Least privilege per sensitive action
- [ ] Multi-tenant / IDOR considered

## 5. Inputs and outputs

- [ ] Server-side validation
- [ ] Shared schemas when useful
- [ ] Uploads with limits and type

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

## 7. AI agents

- [ ] No unnecessary sensitive files in context
- [ ] No unapproved destructive commands
- [ ] No sending private data to external services without permission
- [ ] Security changes registered in `docs/decisions/YYYY-MM-DD.json`

## 8. Dependencies

- [ ] Single lockfile
- [ ] `npm audit` / equivalent documented
- [ ] Update strategy

## 9. Git and supply chain

- [ ] `.gitignore` from the start
- [ ] Lint/test hooks (if applicable)
- [ ] Secret scanning planned
- [ ] CI planned
