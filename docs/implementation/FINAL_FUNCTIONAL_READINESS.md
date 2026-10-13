# Functional readiness — 14 October 2026

## Current release state

AVSAR is a **prelaunch prototype**, not a production-ready hiring marketplace. The Next.js application builds for Vercel and the server-owned opportunity, session, review, and identity boundaries are present. Anonymous browsing is public. Jobseeker registration, Core/Collaborate linking, saves, and internal applications remain closed until both providers can issue verifiable identity proofs through real server adapters.

Development and Vercel Preview serve three fictional opportunity fixtures without writing to Neon. Every sample is labeled as a demo, has no application destination, and is excluded from indexing. Production serves only published, approved Neon records; it never falls back to demo records when the database is unavailable.

## Verified in this checkout

- `npm run typecheck`, `npm run lint`, `npm test` (13 tests), and `npm run build` pass.
- Local development API returned three demo results, filtered to one matching internship, and returned a demo detail record with no application URL. The browse page displayed the demo notice; `robots.txt` disallowed indexing. The Core link start endpoint returned 503.
- The supplied Neon production database has 18 public tables and all eight checked-in migrations in its Drizzle journal. A `super_admin` account was created, and its role and password hash were verified. Direct PostgreSQL TCP timed out from this workspace; migration and provisioning used Neon HTTPS.
- The public opportunity detail API now exposes only display fields instead of the entire organization review record.

## Gates before a genuine production release

1. Obtain Core and Collaborate OIDC/OAuth contracts, registered AVSAR clients, test accounts, callback configuration, signed token verification, and provider consent rules. The user confirmed these are not yet available; jobseeker features must remain closed.
2. Establish independently verified recruiter email and organization evidence, staff access with individual MFA, recovery, and abuse controls before accepting genuine employers at scale.
3. Complete production operational checks: backups and restore exercise, monitoring and alerting, retention/export/deletion process, incident response, and end-to-end tests against an isolated Neon branch.
4. Deploy from GitHub to the intended Vercel project with production secrets scoped to Production and a separate Preview Neon branch. Verify the deployed origin and database-backed public path. The user is handling Vercel deployment manually.

The database and other secrets pasted into chat should be rotated before a real launch. Never commit them or put direct migration credentials in Vercel runtime variables.
