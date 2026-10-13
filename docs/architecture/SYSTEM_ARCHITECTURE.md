# AVSAR system architecture

Next.js App Router serves public pages and `/api/v1` handlers. AVSAR owns its own PostgreSQL database through Drizzle schema and versioned SQL migrations. No code accesses Core, Collaborate, ERIS, Connect or AI Learning databases. The original static UI is preserved in `prototype/` only.

## Implemented flow

Public search/detail read only `published` opportunities with an `approved` organization, matching approved version and unexpired deadline. Search has URL filters, pagination and stable order. No sample listings are seeded. Recruiter signup creates only a recruiter. A recruiter submits an organization; authorized staff may approve it with a checklist and evidence reference. Approved recruiters draft and submit listings. A listing moderator approves a version and separately publishes it, with one active listing per organization on the initial Starter policy. Decisions and audits are transactionally stored. Public reports receive a database receipt with a configured hourly cap.

Opaque session tokens are SHA-256 hashed in PostgreSQL and sent as HttpOnly SameSite cookies. Admin login requires operator-configured TOTP. Saved/application routes require a jobseeker role plus two active Core and Collaborate links with authorization timestamps and configured server adapters. A server-only linking service validates exact issuer, AVSAR audience, subject, provider status, proof freshness and expiry before writing. Database uniqueness prevents a provider subject from linking to another AVSAR user and prevents multiple subjects for the same user/provider; exact repeat callbacks are idempotent. No provider adapter, callback exchange or Jobseeker activation path exists yet, so all private jobseeker actions fail closed. Application submission rechecks live listing state and atomically writes status history and a pending notification. Recruiter application reads/status changes join through the owning organization.

## Implemented API routes

| Resource | Current state |
|---|---|
| Public opportunities search/detail and reports | Coded, DB runtime unverified |
| Recruiter auth register/login/logout/session | Coded, DB runtime unverified |
| Core and Collaborate link start/callback | Unavailable until signed provider contracts and credentials; browser claims cannot create links |
| Recruiter organization/listing CRUD subset and submit | Coded, DB runtime unverified |
| Admin queue, organization decision, listing decision | Coded, DB runtime unverified |
| Jobseeker entitlement, saves, application draft/submit/withdraw | Coded but inaccessible until real federation |
| Recruiter applicant queue and status update | Coded, depends on real submissions |
| Integration health | Truthful `not_configured` response |

Unique constraints cover external subjects, user/provider links, saves, application user/listing pairs and idempotency keys. `pg_trgm` migration adds keyword indexes. Source freshness workers, opportunity edit/version lifecycle, invoices, payments, messages, staff role management and most of the SRS data model remain unimplemented. No production readiness is claimed.
