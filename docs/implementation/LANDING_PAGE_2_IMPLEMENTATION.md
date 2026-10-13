# AVSAR Landing Page 2.0 implementation

## Delivered locally

- Rebuilt the public homepage around search, category discovery, reviewed Neon listings, two-sided onboarding, ecosystem availability, interface previews, proposed employer plans, fair access, trust, EORA's unavailable state, resources, FAQs, and a dual call to action.
- Added `/pricing`, `/ecosystem`, `/resources`, and `/contact-sales`. The four plan cards read the same catalog on the homepage and pricing page. Paid checkout is disabled and paid values remain explicitly proposed.
- Added a public sales enquiry form, server validation, consent, spam/duplicate controls, a database table, reference receipt, and a Super Admin-only queue. A receipt means database persistence only; no sales notification is claimed.
- Added Super Admin content editing with schema validation, drafts, published versions, audit events, version history and restoration to a new draft. Public pages read published hero, category, ecosystem, resource, FAQ, pricing description, announcement, featured IDs, partner names/links and footer links. Only plain text is accepted, so no unsanitized HTML is rendered. Security and fairness policies are outside this editor.
- Added an audited Super Admin catalog for proposed employer plan price labels, listing limits, seat limits and features. Starter remains free with one listing and one seat. Paid plan checkout and entitlement activation remain unavailable.
- Added privacy-limited event counts, an Admin operational analytics view, sitemap, robots rules, listing metadata and JSON-LD for active reviewed Job listings.
- Corrected standalone account UX: jobseekers may register directly with AVSAR; Core/Collaborate links are optional. Replaced the old jobseeker placeholder with a saved-opportunities and application workspace, added save/apply controls, and preserved listing navigation context through sign-in or registration.

## Verification completed

- `npm run typecheck`, `npm run lint`, `npm test` (9 existing tests), and `npm run build` pass.
- Local browser verified homepage, pricing and contact-sales render; FAQ tab changes content; hero search carries `q=AI` to `/opportunities`.
- Checked 1440, 1280, 768, 390 and 320 pixel widths: no document-level horizontal overflow, and search remains present.
- Unauthenticated CMS read/write and plan write returned HTTP 403; malformed sales enquiry returned HTTP 400.

## External activation limit

The supplied Neon host resolves but PostgreSQL connections time out from this execution environment. The Neon connector exposes a different project, so it cannot operate on AVSAR's database here. Migrations `0003` through `0006` are generated but **not applied**. The sales form, content editor, plan catalog and analytics cannot persist or be tested end to end until migrations are applied to AVSAR's Neon database. No fictional opportunities or analytics were inserted. Current live listing search correctly displays an unavailable state while the database cannot be reached.

Before applying migrations to the production branch, test them on a Neon branch using the direct URL. `npm run db:migrate:local` loads `.env.local` and selects `DATABASE_DIRECT_URL`; production environments can use `npm run db:migrate` with injected environment variables. Confirm the migrations and browser-to-API-to-database journeys on that branch before production use.

## Honest product states

- Core, Learn, Collaborate, Connect/Meet, ERIS and EORA links appear only if official HTTPS URLs are configured. AVSAR integrations with those services are not active.
- Billing, refunds, subscriptions, interview scheduling, assessment integrations, richer profiles and CV upload are not active. The UI labels these as proposed, planned or unavailable.
- The CMS uses structured plain text, not a rich-text editor. Custom plan descriptions and article bodies are validated and escaped by React.
- An approved listing means organization and listing review; it is not an employment guarantee.
