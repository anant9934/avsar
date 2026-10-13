# Vercel and Neon deployment

Vercel is AVSAR's sole production host. This repository is a Next.js app; `vercel.json` keeps the existing response headers. The application remains a **prelaunch prototype**. Public discovery can be tested, but Core and Collaborate provider federation, real jobseeker activation, and internal applications are unavailable.

## Environment and database

- `DATABASE_URL`: AVSAR Neon **pooled** URL for server runtime. Keep it secret and server only.
- `DATABASE_PREVIEW_URL`: pooled URL for a **separate** Neon branch, scoped to Vercel Preview (and optionally local development). Preview ignores `DATABASE_URL`; without this value database-backed preview actions fail closed.
- `DATABASE_DIRECT_URL`: AVSAR Neon **direct** URL for operator migrations. Do not put it in the Vercel runtime environment; use it only from a trusted migration runner.
- `APP_ORIGIN`: the actual HTTPS production origin, for canonical URLs, robots and sitemap.
- `REPORT_HASH_SECRET`: server secret for report rate limiting.
- `ADMIN_TOTP_SECRET`: runtime secret required for the current administrator login flow. Keep it in Vercel Production if administrator login is enabled.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`: one-time operator provisioning inputs. Do not put these in Vercel runtime variables.

Never use the production database for Preview. A separate Neon branch and separate secrets are required for any preview environment. Never commit `.env.local`, connection strings, or credentials. The Core and Collaborate issuer/audience placeholders do not activate linking; verified adapters and provider registration are still needed.

Development and Vercel Preview display fictional, clearly labeled opportunity fixtures. They do not create database rows and cannot be applied to. Production uses Neon only and does not fall back to sample data. Do not present the fixture catalog as real employer inventory. Put `DATABASE_PREVIEW_URL` only in Preview; keep `DATABASE_URL` scoped to Production.

## First release sequence

1. Connect the `anant9934/avsar` GitHub repository to the intended Vercel account and select **Next.js**, root `/`, and `main` as the production branch.
2. Add production `DATABASE_URL`, `APP_ORIGIN`, `REPORT_HASH_SECRET`, and (if using administrator login) `ADMIN_TOTP_SECRET` as server-side encrypted environment variables. Keep `DATABASE_DIRECT_URL` outside Vercel.
3. On a trusted runner, check that the direct URL targets the intended AVSAR Neon database, then run `npm run db:migrate:local`. If direct PostgreSQL TCP is unavailable, `npm run db:migrate:http:local` applies the same checked-in Drizzle migrations over Neon HTTPS in one transaction per migration. Verify the Drizzle journal and expected tables. Do not run migrations during each Vercel build.
4. Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` against reviewed code.
5. Deploy from the connected Git repository. Verify `/api/v1/integrations/health`, anonymous opportunity browsing, and that jobseeker writes fail closed. Keep the prelaunch banner visible; do not claim genuine applicant processing before federation and operational checks exist.

The supplied Neon production database was migrated on 14 October 2026: 18 public tables and eight Drizzle journal entries were verified. One `super_admin` account was provisioned and its role and password hash verified. Admin login still needs the `ADMIN_TOTP_SECRET` runtime variable; `ADMIN_EMAIL` and `ADMIN_PASSWORD` are not required by Vercel after provisioning.

## Rollback

Keep the prior Vercel deployment and a Neon branch or snapshot from before a schema change. Roll back application code in Vercel for an application fault. For a data fault, stop writes and investigate before restoring an isolated database snapshot or applying a tested forward migration. A production restore exercise and recovery targets remain to be defined.
