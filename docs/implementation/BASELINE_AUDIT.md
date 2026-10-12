# Baseline audit — 13 October 2026

## Source inspected

`index.html`, `styles.css`, `app.js`, `netlify.toml`, `README.md`, and `docs/SRS.md` were inspected before implementation. The original prototype is preserved in `prototype/` and excluded from the new deployment. The folder was inside an unrelated Git repository rooted at `/Users/quantumanant`; a dedicated AVSAR repository was initialized here without editing that parent repository.

## Existing features and visual components

The prototype had a cinematic dark hero, warm paper dashboards, opportunity cards, category navigation, public search/filter/detail screens, Jobseeker, Recruiter and Admin workspaces, pricing explanation, focus styles and responsive layout. The new site keeps its palette, typography, hero, cards and discovery layout. `prototype/` preserves the full screen reference.

## Demonstration behavior

`app.js` held six fictional listings, `localStorage` persistence, Core/Collaborate Boolean toggles, local saves/applications, demo organization and listing approvals, status changes, reports and pricing. Those were labelled sample-only. No server authenticated or persisted the actions. The old Netlify file published static files only.

## Missing at baseline

Authentication, federation, AVSAR database, server authorization, organization evidence, review/publication, genuine search and application processing, notifications, billing, integrations, durable jobs, audit and production QA were absent.

## Required data and API boundaries

AVSAR needs users/sessions, identity links/consents, organizations/verifications, opportunity versions/reviews/sources, saves, applications/events/messages, notifications, reports/appeals, audit, subscriptions/invoices/ledger, support/assistance and integration outbox tables. The initial migrations create 13 tables. Required APIs include public search/detail/reporting; auth/linking; private jobseeker actions; recruiter organization/listing/applicant flows; admin moderation; verified payment and ecosystem webhooks. `SYSTEM_ARCHITECTURE.md` lists the implemented subset.

## Integration and deployment feasibility

Core and Collaborate need authenticated versioned OIDC/OAuth proof, issuer/audience/JWKS, callback registration, scopes, test identities and revocation. ERIS, Connect, AI Learning, EORA, payments, email and private storage need approved contracts and credentials. None were present. No provider success is simulated. Next.js builds locally; Neon migrations and Netlify Preview are unverified without configured projects. The new routes close the baseline browser-side role/status bypass, but account recovery, distributed abuse controls, privacy operations, background workers and security review remain before production.
