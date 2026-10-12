# Security and permissions — implementation status

## Enforced

Recruiter signup assigns only `recruiter`. Admins are provisioned through an operator script. Passwords use salted scrypt; opaque sessions use HttpOnly SameSite cookies, Secure in production, and hashed server-side tokens. Mutations require a same-host Origin. Private routes check role, ownership and organization scope. Public listings require approved organization, published current version and live deadline. React escapes content; external URLs must be HTTPS and reject local/private IPv4 targets. Review decisions and application status transitions append history in transactions. No provider credentials are logged by application code. Public reports have a configured per-reporter cap.

## Gaps before production

There is no verified recruiter email, recovery flow, login rate limit, durable distributed abuse control, per-admin MFA enrollment, support for full staff role provisioning, private evidence storage, appeal workflow, DB row-level security, backup/restore exercise, retention/deletion/export procedure, dependency scan, strict CSP, safe destination monitoring or authorized file upload pipeline. The operator TOTP secret is shared across currently provisioned Admin accounts; it must be replaced before adding staff. Review evidence references point to records outside AVSAR and require a governed process. `pg_trgm` and Netlify runtime are unverified on Neon. Jobseeker endpoints are intentionally unusable until signed Core and Collaborate federation exists.

| Actor | Implemented scope |
|---|---|
| Anonymous | Public pages/search/detail; reports when configured |
| Recruiter | Own organization/listings/applicants after approval |
| Jobseeker | Saves/applications only with both active verified links; no activation path exists |
| Verification officer | Organization review |
| Listing moderator | Listing review/publication |
| Super Admin | Both review flows; other privileged operations absent |

Unimplemented powers are denied by absence of routes, not counted as finished.
