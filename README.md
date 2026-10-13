# AVSAR by AI Tathastu

AVSAR is being rebuilt from an interactive prototype into a server-backed opportunity marketplace. The original static prototype is preserved in `prototype/`. The current Next.js implementation is **prelaunch**. The supplied AVSAR Neon database has been migrated, but external identity contracts and operational checks are still required before genuine end-to-end hiring workflows are available.

## Run locally

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Visit `http://localhost:3000`. Development and Vercel Preview show seven fictional opportunities from server-side fixtures, even without a database. They are clearly labeled, have no application destination, and are excluded from the sitemap and search indexing. Production never serves these fixtures: its public search reads only approved, published rows from Neon and reports an outage if the database is unavailable. Database-backed development and Preview actions require `DATABASE_PREVIEW_URL` from a separate Neon branch; the production `DATABASE_URL` is ignored in those environments.

To test database-backed preview workflows, create a separate Neon branch, set `DATABASE_PREVIEW_URL` to its pooled URL and `DATABASE_DIRECT_URL` to that **same branch's** direct URL, then run `npm run db:migrate:local`. If direct PostgreSQL TCP is unavailable but Neon HTTPS works, use `npm run db:migrate:http:local` instead. Never point a local migration command at the production direct URL while setting up demo browsing.

## Operator setup

Create an Admin account only after migrations, with `ADMIN_EMAIL`, a 16+ character `ADMIN_PASSWORD` and `ADMIN_TOTP_SECRET` supplied securely:

```bash
npm run admin:provision
```

Use `npm run admin:provision:http:local` when the Neon HTTPS connection is available but direct PostgreSQL TCP is blocked. Both commands refuse to overwrite an existing account. `ADMIN_EMAIL` and `ADMIN_PASSWORD` are one-time local provisioning inputs, not Vercel runtime variables.

Recruiter registration is self-service, but posting requires recorded organization review and separate listing review/publication. Jobseeker activation needs genuine signed Core and Collaborate federation; it is currently blocked. Do not insert fake identity links.

An operator can provision a recruiter over Neon HTTPS with `npm run recruiter:provision:http:local` after placing `RECRUITER_EMAIL` and `RECRUITER_PASSWORD` in an ignored, mode-600 `.env.recruiter.local`. Provisioning does not approve an organization or publish opportunities.

The first identity boundary is in `src/modules/identity`: provider proof can enter the link store only through a server adapter, with exact issuer/audience checks and unique provider subject and user/provider constraints. No Core or Collaborate adapter, credentials, callback exchange, or consent flow is connected. The link start/callback endpoints return unavailable, and the server does not issue jobseeker entitlement without both verified links and working adapters. Legacy `AVSAR_AUTH_MODE=standalone` and `AVSAR_REQUIRE_ECOSYSTEM_LINKS=false` values no longer bypass this rule. Recruiter registration remains separate; anonymous listing browsing remains public. Run the generated Drizzle migrations on an AVSAR-owned Neon database before using database-backed features.

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Read [baseline audit](docs/implementation/BASELINE_AUDIT.md), [architecture](docs/architecture/SYSTEM_ARCHITECTURE.md), [SRS matrix](docs/implementation/IMPLEMENTATION_MATRIX.md), [QA evidence](docs/qa/E2E_VERIFICATION_REPORT.md), and [readiness](docs/implementation/FINAL_FUNCTIONAL_READINESS.md) before deployment. `.env.example` contains names only; never commit real values.

Production hosting is Vercel only. See [Vercel deployment](docs/deployment/VERCEL_DEPLOYMENT.md) for the pooled runtime URL, direct migration URL, production environment, and release checks. The existing repository already has project history, so do not initialize it again or replace this README with a one-line placeholder.
