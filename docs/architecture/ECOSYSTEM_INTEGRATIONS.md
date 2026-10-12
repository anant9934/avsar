# Ecosystem integration status

AVSAR does not share private databases with the other products. `src/modules/integrations/contracts.ts` contains typed interfaces and explicit unavailable results, not active provider clients. `GET /api/v1/integrations/health` reports every provider as `not_configured`.

| Provider | Contract required | Current state |
|---|---|---|
| Core | Signed OIDC/OAuth identity proof, stable subject, active state, revocation, optional scopes | BLOCKED: contract, URLs, keys, client registration and test identity absent |
| Collaborate | Independent proof, stable subject, account state, revocation and selected-profile consent | BLOCKED |
| ERIS | Signed versioned requests/events, role and consent rules, idempotency | BLOCKED |
| Connect / Meet | Authenticated invitations, timezone/participant rules, signed events | BLOCKED |
| AI Learning | Authenticated catalog and completion source | BLOCKED |
| EORA | Authenticated inference, privacy and cost controls | BLOCKED |
| Payments | Approved merchant sandbox, signed webhook and reconciliation | BLOCKED |
| Email / private files | Authorized delivery and private storage with retention rules | BLOCKED |

Core and Collaborate must be integrated before Jobseeker activation. A database row alone is not provider proof; only verified callbacks may create active links. No public route creates a Jobseeker role. Obtain versioned docs, issuer/audience/scopes, allowlisted callbacks, verification keys, test credentials, revocation/outage behavior, signed event fixtures and contract tests before activating an adapter. Never fabricate assessments, meetings, course completion, payment success or recruiter decisions.
