# AVSAR by AI Tathastu

AVSAR is being rebuilt from an interactive prototype into a server-backed opportunity marketplace. The original static prototype is preserved in `prototype/`. The current Next.js implementation is **prelaunch**. It compiles and renders, but needs an AVSAR-owned Neon database and external identity contracts before genuine end-to-end hiring workflows are available.

## Run locally

```bash
npm ci
cp .env.example .env.local
# Configure AVSAR-owned Neon runtime and direct migration URLs in .env.local
npm run db:migrate
npm run dev
```

Visit `http://localhost:3000`. Public pages render without a database but search reports the service as unavailable. No sample opportunities are injected.

## Operator setup

Create an Admin account only after migrations, with `ADMIN_EMAIL`, a 16+ character `ADMIN_PASSWORD` and `ADMIN_TOTP_SECRET` supplied securely:

```bash
npm run admin:provision
```

Recruiter registration is self-service, but posting requires recorded organization review and separate listing review/publication. Jobseeker activation needs genuine signed Core and Collaborate federation; it is currently blocked. Do not insert fake identity links.

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Read [baseline audit](docs/implementation/BASELINE_AUDIT.md), [architecture](docs/architecture/SYSTEM_ARCHITECTURE.md), [SRS matrix](docs/implementation/IMPLEMENTATION_MATRIX.md), [QA evidence](docs/qa/E2E_VERIFICATION_REPORT.md), and [readiness](docs/implementation/FINAL_FUNCTIONAL_READINESS.md) before deployment. `.env.example` contains names only; never commit real values.
