# AVSAR by AI Tathastu

AVSAR is being rebuilt from an interactive prototype into a server-backed opportunity marketplace. The original static prototype is preserved in `prototype/`. The current Next.js implementation is **prelaunch**. It compiles and renders, but needs an AVSAR-owned Neon database and external identity contracts before genuine end-to-end hiring workflows are available.

## Run locally

```bash
npm ci
cp .env.example .env.local
# Configure AVSAR-owned Neon pooled runtime and direct migration URLs in .env.local
npm run db:migrate:local
npm run dev
```

Visit `http://localhost:3000`. Public pages render without a database but search reports the service as unavailable. No sample opportunities are injected.

## Operator setup

Create an Admin account only after migrations, with `ADMIN_EMAIL`, a 16+ character `ADMIN_PASSWORD` and `ADMIN_TOTP_SECRET` supplied securely:

```bash
npm run admin:provision
```

Recruiter registration is self-service, but posting requires recorded organization review and separate listing review/publication. Jobseeker activation needs genuine signed Core and Collaborate federation; it is currently blocked. Do not insert fake identity links.

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
