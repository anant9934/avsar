# Verification report — 13 October 2026

## Executed checks

| Check | Actual result |
|---|---|
| `npm install --no-audit --no-fund --fetch-retries=1 --fetch-timeout=15000` | PASS: 106 packages installed |
| `npm run db:generate` | PASS: generated migrations 0000 and 0001; custom 0002 adds search indexes |
| `npm run lint` | PASS after fixing two React effect lint findings and a const declaration |
| `npm run typecheck` | PASS after fixing one response union typing issue |
| `npm test` | PASS: 9 unit tests, 1 file, publishing gate, entitlement, URL and password/TOTP validation |
| `npm run build` | PASS after all implemented routes and pages; 24 static pages generated plus dynamic routes |
| `npm audit --omit=dev --json` | PASS: 0 production dependency advisories reported |
| `npm run admin:provision` without secrets | Expected safe failure: required operator inputs are missing; no Admin was created |
| Local production server `npm run start -- -p 4173` | PASS: started, homepage HTTP 200 |
| Browser: homepage → search for “machine learning” | PASS: URL became `/opportunities?q=machine+learning`; search page showed honest database-unavailable state |
| Browser: sign in with deliberately nonexistent test credentials | PASS: service-unavailable error shown with no success or session claim |
| Browser viewport overflow checks | PASS for homepage at 1280×800, 1440×900, 1920×1080, and 390×844: document width equalled viewport width |
| Browser console error/warning collection | PASS: no captured console errors or warnings in the checked tab |
| `GET /api/v1/opportunities` without database | PASS: 503, no fabricated listings |
| `POST /api/v1/auth/register` without Origin | PASS: 403, no account created |
| Anonymous `POST /api/v1/admin/opportunities/:id/decision` | PASS: 403, no publication |

## Blocked test scenarios

A real Neon URL was absent. No migration was applied, so database persistence, organization verification, listing publication/search, application receipts, cross-organization isolation and notification durability could not be run end to end. No Core or Collaborate federation contract was available, so new/returning Jobseeker scenarios are blocked and no fake links were created. ERIS, Connect, Learning, EORA, email and payment scenarios require their contracts and sandboxes. No Netlify Preview or backup restore was performed. Viewport checks covered only the homepage; detailed desktop workflows, screen reader testing, network audit and performance budgets remain unverified.

## QA conclusion

The checks prove compilation and selected authorization/degraded-state behavior only. They do not establish production readiness or a genuine complete hiring workflow.
