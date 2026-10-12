# Netlify Preview deployment and rollback

## Current status

No Netlify site, environment or Preview deployment was supplied. `netlify.toml` now runs `npm run build` and points at `.next`; compatibility with the intended Netlify account/runtime has **not** been tested. Do not point production DNS or accept real applicants yet.

## Required configuration by name

- `DATABASE_URL`: AVSAR-owned Neon pooled connection URL for runtime.
- `DATABASE_DIRECT_URL`: direct connection URL for migrations (operator/CI only).
- `APP_ORIGIN`: intended HTTPS origin; reserved for integration callback and strict origin configuration.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_TOTP_SECRET`: one-time Admin provisioning inputs; keep outside build/public environment after provisioning.
- `REPORT_HASH_SECRET`: private HMAC secret for public report rate limiting.

No `NEXT_PUBLIC_` secret is used. Core, Collaborate, ERIS, Connect, AI Learning, EORA, payment and email values are not named as live settings because their provider contracts are not implemented yet.

## Local setup

1. `npm ci`
2. Create an isolated AVSAR Neon database/branch. Copy `.env.example` to `.env.local` and set the names above through a secret manager. Never commit values.
3. Use a **direct** connection with `npm run db:migrate`. Verify the migration journal and tables; this has not been run in the present environment.
4. Run `npm run admin:provision` once with separately supplied credentials and TOTP secret. The script refuses to overwrite an existing email.
5. Run `npm run dev`, `npm run typecheck`, `npm test`, and `npm run build`.
6. Use a private Netlify Preview with an isolated Neon branch and separate secrets. Verify the complete organization → listing → public search flow and unauthorized requests before promotion.

## Rollback

Keep prior Netlify deploy ID and database migration/branch snapshot. For an application-only failure, restore the previous deploy. For a data issue, stop writes, investigate affected records, then restore an isolated database snapshot and reconcile audit/application events before reopening. Do not blindly reverse migrations on a live database; test a forward repair or point-in-time restore on an isolated branch. Backup cadence and RPO/RTO require an approved operations plan and an actual restore exercise.
