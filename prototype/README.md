# AVSAR by AI Tathastu — Interactive UX Prototype

**Project status:** Interactive frontend prototype, not a production backend or verified recruitment system.

## Run

Open `index.html` directly in your browser, or use a local server:

```bash
python3 -m http.server 4173
```

Then visit `http://localhost:4173/`.

## What is interactive

- Landing page and public job search; free browsing with category/search/mode/location filters.
- Example listing selection, save/apply previews, sample applications and status tracking.
- Jobseeker two-step Core + Collaborate *simulated* account linking gate. Jobseeker actions require both demo states.
- Recruiter sample opportunity submission.
- Admin simulated organization approval, listing approval/rejection/suspension, reporting, audit history.
- Listings approved by Admin appear in public sandbox search.
- Example pricing and local sandbox plan selector.
- Responsive layout and keyboard-friendly basic navigation.
- Persistence of sample state in browser `localStorage` (reset via browser storage if desired).

## What is NOT implemented

No secure authentication, real Core/Collaborate federation, actual employer verification, Neon database, ERIS assessment, Connect meeting, AI Learning progress, EORA LLM, genuine listings, notifications, invoices, payment checkout, applicant data processing or actual hiring. Every card and action is explicitly identified as a demo. Do not collect real user resumes, secrets, personal data or payments with this prototype.

## Recommended production pathway

1. Move into a real Next.js application with server-side authentication and Neon (separate AVSAR-owned schema/database).
2. Integrate Core and Collaborate using real scoped federation; mandatory identity links must be **server-verified**, not toggled in the browser.
3. Establish recruiter and admin RBAC and organization verification; no client-side role switching in production.
4. Add source-verified opportunity ingestion and full admin-approved listing lifecycle.
5. Implement authenticated, consent-aware application snapshots and audit logging.
6. Add real employer billing/webhooks and optional ERIS/Connect/Learn integrations after the core flow is verified.
7. Execute accessibility, privacy, authorization, security and end-to-end tests before deployment.

## Deployment note

Static hosting (Netlify, GitHub Pages, etc.) can show this demo, but **deploying the demo does not make it a real job platform**. `netlify.toml` here only describes static publishing.

Based on the supplied `AVSAR_by_AI_Tathastu_Full_SRS(1).md` v1.0 requirements. Brand: `#08090B`, `#C9A46D`, `#F49A47`, `#FAF9F6`, Space Grotesk, DM Sans, JetBrains Mono. Naukri/Indeed-style discovery patterns are inspirations only; no competitor assets or code copied.
