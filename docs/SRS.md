# AVSAR by AI Tathastu
## Software Requirements Specification (SRS)
### Full Opportunity Marketplace, Jobseeker, Recruiter and Administrator System

**Version:** 1.0 — proposed product specification  
**Date:** 12 October 2026  
**Status:** Planning baseline / not an implementation or production certification  
**Proposed site:** `avsar.aitathastu.com` (subject to domain/trademark validation)  
**Primary release focus:** Desktop-first functional implementation; India-first, AI/ML and early-career discovery  
**Brand expansion:** **A**ccess · **V**erification · **S**kills · **A**dvancement · **R**ecruitment  
**Brand line:** *Every Opportunity. A Fair Chance.*

> **Binding product decision:** An AVSAR **jobseeker account** can be activated only after the person has authenticated and linked **both AI Tathastu Core and Collaborate accounts**. This applies to the jobseeker dashboard, saving and managing opportunities, and submitting or tracking applications. Anonymous visitors can still browse public listings and use public reporting/accessibility channels. Recruiter and Admin identity follow separate role-specific rules. Account linking does **not** mean sharing databases, unrestricted data access or automatic publication of a professional profile.

---

# 1. Document purpose and control

## 1.1 Purpose

Define measurable functional, integration, interface, security, business, operational and acceptance requirements for **AVSAR by AI Tathastu**, an independent opportunities platform that connects legitimate job and internship discovery with applicant profiles, preparation, evidence, optional assessment, professional collaboration and interviews. This document is written for product management, design, engineering, security, QA, operations, potential institutions and recruiting partners. It is a target specification; it does not assert that the features currently exist.

## 1.2 Scope

**In scope:** public opportunity discovery; candidate account federation; jobseeker workspace; recruiter onboarding, organization verification and hiring workspace; administrator command center; opportunity intake/review/publication; applications; referral- and evidence-aware preparation; ERIS assessment requests; Connect/Meet interview scheduling; AI Learning contextual preparation; Collaborate professional profile data sharing; Core Person 360 input; EORA guidance; support and appeals; employer subscriptions, invoices and appropriately labeled promotion; observability, governance, API contracts, and desktop launch tests.

**Not in initial release:** autonomous hiring decisions; unconsented cross-app profiling; scraping restricted third-party job platforms; unverified employer-status inference; applicant payment for essential job applications; guaranteed placement; data brokerage; a shared database for all AI Tathastu products; arbitrary publication by unverified employers; full employer ATS replacement for every possible workflow; mobile-app-native build.

## 1.3 Normative language and precedence

**MUST / SHALL:** mandatory requirement. **SHOULD:** recommended unless documented exception approved by product/security owner. **MAY:** optional. Requirement IDs are stable identifiers for implementation tickets and QA. Later decisions must be recorded in a change log; a copy or feature concept should not silently override authorization or fairness requirements.

## 1.4 Source and UX inspiration

The supplied AI Tathastu landing-page HTML establishes the approved brand language: obsidian `#08090B`, warm charcoal `#171513`, champagne `#C9A46D`, amber `#F49A47`, paper `#FAF9F6`, warm paper `#F4F1EA`, intelligent violet `#7865F5`, cyan `#66D9F7`, Space Grotesk headings, DM Sans body type and JetBrains Mono metadata. AVSAR's public experience follows its cinematic editorial hero and restrained motion; authenticated dashboards use calmer warm-light layouts. Job searching takes interaction inspiration from Naukri/Indeed-style search and filter scanning, student categorization from Internshala, and company/compensation clarity from professional recruiting sites. **Do not copy competitors' assets, source code or pixel-exact layouts.**

## 1.5 Assumptions and decisions awaiting confirmation

- AVSAR is an independent site with its own backend and logical database boundary. Existing AI Tathastu products remain independent.
- AI Tathastu Core and Collaborate expose or will expose approved authentication/identity-link APIs and specific data-sharing contracts. Current availability must be audited before development.
- Recruiters require an AVSAR organization account and admin verification; they do **not** need jobseeker-linked Core/Collaborate accounts.
- Public jobs and internships are searchable without login. Basic applications are not sold to students.
- Direct-in-AVSAR applications require recruiter opt-in and a verified posting; external applications redirect to the authorized source with accurate tracking limitations.
- Draft employer subscription tiers and INR prices are **proposals**, not live contracts. Payment/compliance processes need final approval.
- Applicable laws, accessibility standards, youth employment restrictions, payments and data-protection obligations require current jurisdiction-specific legal review before launch.

# 2. Product vision, objectives and success criteria

## 2.1 Vision

AVSAR makes legitimate opportunities discoverable, understandable and actionable while allowing students and early-career professionals to show approved evidence of their skills and move into genuine recruitment processes. It is not a hidden applicant-scoring service. The product provides a journey: **Discover → Understand → Prepare → Share evidence → Apply → Assess (where relevant) → Interview → Track → Learn from outcomes**.

## 2.2 Primary audiences

1. **Jobseekers:** college students, graduates, early-career professionals and eligible researchers, initially prioritizing AI/ML and adjacent technology opportunities.
2. **Recruiters:** authorized employees/representatives of hiring organizations, labs, institutions and sponsored programs.
3. **Administrators:** separately permissioned verification, moderation, support, trust and safety, finance and platform operations personnel.
4. **Public visitors:** unregistered browsers, accessibility requesters and listing reporters, with no need to create a jobseeker account to read information.
5. **Institutional partners (future/P1):** university placement officers, program publishers and employer partners under explicitly scoped organizational roles.

## 2.3 Business objectives

- Reduce friction for legitimate discovery while avoiding stale, fraudulent and inaccessible listings.
- Develop a repeatable B2B revenue base from recruiter subscriptions, value-added hiring services and explicit sponsorship.
- Allow students to reuse **consented** information from Core and Collaborate, not recreate their profiles repeatedly.
- Increase the quality of applicant evidence and interview preparation with optional Learn/ERIS/Connect integrations.
- Keep support for students facing access barriers separate from employer hiring preferences and payment influence.
- Give administrators complete visibility over moderation backlog, revenue, support burden and service health, with strict access boundaries.

## 2.4 Outcome metrics (definitions, not promised numbers)

| Metric | Definition | Guardrail |
|---|---|---|
| Search-to-detail rate | Public search sessions that open a listing | Do not count spam/bot traffic |
| Detail-to-application-start | Listing detail visits leading to genuine application initiation | Do not equate external redirect with submitted application |
| Completed internal application rate | Server-confirmed completed submissions / eligible starts | Capture form abandonment and accessibility friction |
| Listing freshness | Approved active listings successfully checked within configured source-specific TTL | Separate unknown from active |
| Publisher verification time | Median / P95 queue-to-decision time, by risk band | Do not promise automatic approval |
| Employer paid conversion | Verified employers activating paid plan / eligible verified organizations | Exclude fraudulent/test transactions |
| Applicant fairness signals | Search exposure, application success, error/appeal rates segmented only where lawful and privacy-preserving | Never sell sensitive segmentation |
| Cross-app link completion | Jobseekers with both verified linked accounts / those who initiate linking | Measure failure reasons, not private content |
| Interview completion | Connect-attested meetings completed / scheduled where integration exists | No fabricated meeting status |
| Operational reliability | Successful core API calls, queue completions, meaningful incidents | No invented uptime figures |

# 3. Actors, permissions and organizational boundaries

## 3.1 Actors

| Actor | Identity | Principal capabilities | Explicit limits |
|---|---|---|---|
| Public visitor | No session | Search public listings, view details, report, request accessibility | Cannot save, use jobseeker workspace or submit application |
| Jobseeker | AVSAR link to **both** Core and Collaborate | Saved items, applications, authorized profile share, preparation, assessments, interviews | Cannot publish employer opportunities or view other candidates |
| Recruiter | AVSAR recruiter account within verified organization | Submit postings, view applicants for own listings, invite assessments/interviews, billing by permission | Cannot publish without approval, browse private non-applicant profile data |
| Organization owner | Verified recruiter with owner role | Team seats, plans, organization settings, delegated recruiter permissions | Cannot self-verify organization or bypass moderation |
| Verification officer | Admin role | Verify organization identity and records | No unnecessary finance or applicant-content access |
| Listing moderator | Admin role | Approve, request changes, suspend and manage complaints | Must record decision; sensitive actions audited |
| Trust & safety reviewer | Admin role | Reports, abuse cases, suspensions, appeals | May not access financial hardship records by default |
| Support specialist | Admin role | Support tickets and permitted troubleshooting | No credential or full financial record access |
| Finance manager | Admin role | Plans, invoices, refunds, reconciliation | Cannot manipulate moderation outcomes |
| Super Admin | Restricted break-glass/platform role | Role configuration, critical incident actions | Strong authentication, dual approval for high-risk operations |
| Ecosystem service | Machine-to-machine identity | Only specifically authorized APIs/events | No wildcard access to all user records |

## 3.2 Core permission rules

**IAM-001** Every write and confidential read SHALL use server-validated account ownership and resource-level authorization; frontend-hidden controls do not constitute enforcement.  
**IAM-002** Roles SHALL be assigned only through authenticated, approved role provisioning, not user-controlled signup fields.  
**IAM-003** Recruiter access SHALL be scoped to a verified organization and the listings/applicants it owns.  
**IAM-004** A recruiter SHALL not view full student profiles, private Core or Collaborate data, financial hardship information, ERIS scores or Connect sessions unless the applicant or corresponding workflow specifically authorizes those data.  
**IAM-005** Admin privileges SHALL be separated by operational duty; sensitive export, access elevation and irreversible restrictions SHALL require documented controls.  
**IAM-006** Organizational users SHALL be immediately deauthorized on seat removal, offboarding, subscription restriction (where appropriate) or suspension.  
**IAM-007** Admin actions SHALL carry actor, timestamp, affected resource, before/after policy-relevant state, reason and immutable audit reference.  
**IAM-008** Deletion, export, organization membership and role changes SHALL not bypass active privacy or legal hold obligations.

# 4. Mandatory Core + Collaborate accounts for every AVSAR jobseeker

## 4.1 Binding policy

A person cannot become an **active AVSAR Jobseeker** unless AVSAR has independently validated and linked (1) their **AI Tathastu Core account**, and (2) their **Collaborate by AI Tathastu account**. Two accounts may be created during a guided one-time journey, or existing accounts may be linked. Recruiters and Administrators are excluded from this jobseeker-only linkage policy. Public discovery remains accessible without these accounts.

A linked Collaborate account SHALL **not** automatically publish the candidate's profile, expose their contact details, create connections or permit recruiter discovery. Each has separate privacy controls and consent.

## 4.2 Entry flows

**New jobseeker:** Public listing → Save / Apply → gentle account gate explaining both requirements → authenticate or create AI Tathastu Core account → return with verified authorization → authenticate or create Collaborate account → confirm account association → review minimum sharing permissions → create AVSAR jobseeker profile → return to the original opportunity with draft state preserved.

**Existing Core and Collaborate user:** Choose “Continue with AI Tathastu” → authenticate both services securely as needed → verify pairwise identity association → display requested scopes → authorize → enter AVSAR. Avoid requiring a new password for AVSAR if secure federation supports session creation.

**Has Core only:** Authenticate Core → explain Collaborate requirement → open Collaborate enrollment/authorization → confirm account link → return to AVSAR.  
**Has Collaborate only:** Equivalent Core enrollment before activation.  
**Partially linked:** Read-only restore progress and resume failed link; never manufacture a complete-linked status.  
**Link denied or provider unavailable:** Public browsing stays available; private dashboard/apply remains unavailable with specific retry, help and accessibility paths.  
**Suspended linked service account:** Suspend actions requiring that identity until resolved, but preserve lawful records, allow status/help and avoid falsely deleting legitimate historical applications.

## 4.3 Functional requirements — identity and linking

**ID-001** System SHALL allow anonymous viewing of public opportunity lists and details.  
**ID-002** System SHALL require validated Core and Collaborate identities before issuing jobseeker entitlement.  
**ID-003** AVSAR SHALL verify provider tokens server-side, using supported OAuth2/OIDC or equivalent audited federation; never trust browser-submitted email/user IDs as proof of identity.  
**ID-004** Each cross-app identity relation SHALL use stable pairwise IDs, issuer, subject, authorization timestamp and status, not matching names or raw emails alone.  
**ID-005** AVSAR SHALL separately request minimum scopes for Core and Collaborate; read-only account presence is different from requesting portfolio, skill or full-CV data.  
**ID-006** User SHALL be able to preview and approve any application-specific profile/evidence share.  
**ID-007** Incomplete linking SHALL not lose search filters, chosen listing, draft application or manual entries, subject to safe expiry rules.  
**ID-008** Creation/linking SHALL be retry-safe and not duplicate identities after network failures or refresh.  
**ID-009** Users SHALL be able to manage and revoke nonessential data scopes; revocation of a mandatory identity link SHALL deactivate prospective AVSAR jobseeker actions and explain the impact before confirmation.  
**ID-010** Previously submitted employer-visible application snapshots SHALL follow disclosed retention rules; revoking a link must stop future access and may not instantly erase data already legitimately delivered to an employer.  
**ID-011** Session exchange SHALL never put credentials, resume bytes or access tokens in URL query parameters; use short-lived codes/state/PKCE as appropriate.  
**ID-012** Core and Collaborate provider outages SHALL fail closed for new entitlement checks but preserve public browse and show accurate status.  
**ID-013** Account email change, provider account deletion, mistaken link and duplicate-link conflict SHALL have secure recovery paths with support verification.  
**ID-014** The system SHALL not require a public Collaborate profile or accepting unwanted recruiter connections to satisfy the account requirement.  
**ID-015** A normal jobseeker with both verified links SHALL enter the workspace without repeating a full Core onboarding unless the Core account genuinely requires completing a mandatory step.  
**ID-016** Employer and Admin identity flows SHALL remain separate from the jobseeker federation requirement.  
**ID-017** Underage individuals SHALL be prevented from applying to listings for which published law/eligibility makes them ineligible; browsing and age-appropriate categories remain available as lawful.

# 5. Core user journeys and state transitions

## 5.1 Jobseeker journey

**Search public → View listing → Link both identities → Review profile permissions → Save/Apply → Share selected application evidence → Submit internally OR open original external destination → Track only actual status → Optional ERIS → Optional Connect interview → Outcome / withdrawal / appeal.**

Alternate paths: unavailable listing; expired deadline; insufficient eligibility data; inaccessible application; disputed qualification; recruiter withdraws opening; identity service outage; support request. All must have clear, non-blaming recovery information.

## 5.2 Recruiter journey

**Register recruiter → Verify email and organization membership → Submit organization data → Admin verifies organization → Configure billing / permitted free tier → Draft opportunity → Validate requirements → Submit listing → Admin approves / requests changes → Publish → Receive authorized applicants → Review → Invite ERIS / Connect as applicable → Update real status → Close vacancy → Retain permitted records / dispose on schedule.**

## 5.3 Administrator journey

**Sign in with authorized admin identity → View assigned queue → Inspect evidence and flags → Approve / request changes / reject with reason → Audit decision → Monitor published listing → Handle reports / appeals → Manage subscription and integration incidents in scoped console → Export only authorized operational reports.**

## 5.4 Listing lifecycle

`DRAFT → SUBMITTED → UNDER_REVIEW → (NEEDS_CHANGES ↔ SUBMITTED) → APPROVED → PUBLISHED → PAUSED / EXPIRED / FILLED / CLOSED`  
Alternative review terminal: `REJECTED`; moderation: `SUSPENDED`, `REMOVED`; reinstatement only by authorized approval; all transitions logged. **Approved** and **Published** are separate to support scheduled start/availability.

## 5.5 Application lifecycle

`DRAFT → SUBMITTED → RECEIVED → UNDER_REVIEW → ASSESSMENT_REQUESTED / INTERVIEW_INVITED → OFFERED / NOT_SELECTED / WITHDRAWN / CLOSED`  
An external application uses `OPENED_EXTERNAL_DESTINATION`, then optionally `APPLIED_EXTERNALLY_SELF_REPORTED`; do not upgrade it to `RECEIVED` or `UNDER_REVIEW` without evidence from employer/integration. Disputed/appealed statuses are recorded separately.

# 6. Public marketplace: pages, copy and interactions

## 6.1 Landing page (`/`)

**Hero:** “Every Opportunity. A Fair Chance.”  
**Subheading:** “Discover genuine jobs, internships, research openings and more. Understand what you need, share what you've built and move forward with purpose.”  
**Primary CTA:** “Find Opportunities” (opens public search). **Secondary CTA:** “Post an Opportunity” (employer path).  
**Search:** keyword/role/skill/organization + location/work mode + category chips. Search is usable before login.  
**Sections (in order):** opportunity search; category cards; genuinely approved featured listings; verified-listing process; “How it works”; student value proposition; optional ecosystem connection (Core/Collaborate/ERIS/Connect/Learn); fairness and support; employer teaser; transparent pricing teaser; EORA introduction; FAQs; final dual CTA; footer.

**LAND-001** Hero SHALL not require login before a search.  
**LAND-002** Every featured card SHALL be backed by a currently publishable listing ID; no invented employer logos, salaries or application counts.  
**LAND-003** Public “Verified” labeling SHALL disclose its exact scope; no placement guarantee.  
**LAND-004** Jobseeker account CTA SHALL explain that Core and Collaborate linked accounts are required for workspace and applications.  
**LAND-005** Recruiter CTA SHALL explain organization verification is required before publishing.  
**LAND-006** Main navigation SHALL expose Jobs, Internships, Research & More, Companies, For Employers, Sign In / My Dashboard.  
**LAND-007** Marketing stats/testimonials SHALL appear only after evidence and publication consent exist.

## 6.2 Explore listings (`/opportunities`)

Desktop: sticky search bar; 260px filter column (when room permits); result cards in center; optional detail preview on right; preserve chosen filters and scroll after selection, login and back navigation. Categories: jobs, internships, research assistantships, fellowships, scholarships, hackathons, campus programs, verified relevant events. List data shall include role, organization, location, work mode, pay if published, experience, eligibility tags, source, last checked and close date. Filters: category, role, AI/ML specialization, location, onsite/hybrid/remote, paid/unpaid, stipend band, experience, qualification, graduation period when applicable, duration, deadline, organization type, verified listing status, sort. Do not use wealth/family-background filters for ordinary recruiting.

**DISC-001** Public keyword and filter search SHALL work without creating a user account.  
**DISC-002** Filtering SHALL use approved listing data with stable pagination/cursors and consistently ordered results.  
**DISC-003** Filter choices SHALL survive navigation; empty states SHALL suggest resets without claiming no jobs exist globally.  
**DISC-004** Sponsored content SHALL be clearly labeled, cap-controlled and separated from the base relevance order; cannot impersonate verified relevance.  
**DISC-005** Closed, suspended or expired listings SHALL not display as new active openings; deep-linked historical pages may explain their status.  
**DISC-006** Relevance explanation SHALL identify actual skill/title/location/goal signals, distinguishing known requirements from uncertainty.  
**DISC-007** A user SHALL have an option to see all eligible public listings without personalization.  
**DISC-008** Category filter/compensation/eligibility fields SHALL clearly distinguish “not specified” from zero/none.

## 6.3 Listing detail (`/opportunities/:slug-or-id`)

**Title example:** Actual role title and legitimate organization.  
Sections: overview; publisher identity/verification interpretation; employer description; responsibilities; hard and preferred eligibility; relevant skills; experience; compensation and benefits (only if supplied); application start/end dates; positions; workplace; source and last checked; application method; accessibility contact; warnings; similar roles; optional preparation/ERIS; Save, Share, Report, Apply. An external link must be shown as leaving AVSAR. Source URL and application destination must pass safety checks.

**DET-001** A listing SHALL expose publisher, application path, actual requirements and the difference between verified vs self-declared claims.  
**DET-002** “Apply” SHALL inspect listing status and jobseeker mandatory-linked-account entitlement.  
**DET-003** Hard eligibility rules SHALL not be silently expanded by AI predictions or unsupported personal-attribute inferences.  
**DET-004** User SHALL be able to report inaccurate or suspicious listing information without being forced to register.  
**DET-005** Saved application draft context SHALL survive the Core+Collaborate account-link journey where safely possible.  
**DET-006** Unavailable opportunities SHALL show truthful expired/removed states and approved alternatives.

## 6.4 Other public pages

| Route | Headline / promise | Mandatory sections and interactions |
|---|---|---|
| `/jobs` | “Find work that moves you forward.” | Job-specific filters, qualification, salary when given, freshness, real results |
| `/internships` | “Your first experience starts here.” | Stipend, duration, academic eligibility, work mode, start date |
| `/research` | “Curiosity deserves opportunity.” | Lab/program, research area, publications requested, eligibility, funding |
| `/scholarships` | “Find support for what comes next.” | Program conditions, need/merit rules from provider, award and deadline |
| `/fellowships` | “Turn ambition into meaningful work.” | Sponsor, domain, duration, funding and application paths |
| `/events` | “Find the communities and conversations that matter.” | Verified event dates, formats, organizers, registration |
| `/companies/:id` | “Explore opportunities at [Organization].” | Accurate publisher information, verified scope and live openings |
| `/how-it-works` | “From discovery to the next step.” | Browse, compare, prepare, share, apply, track with honest descriptions |
| `/fair-access` | “A fair chance starts with open access.” | Unbiased discovery, need support, privacy, appeals, nondiscrimination |
| `/trust-safety` | “Know who is posting. Know what you're applying for.” | Verification, scam reporting, limitations, prohibited conduct |
| `/for-employers` | “Find talent. Hire with clarity.” | Publisher flow, what paid plans unlock, verification, integrations |
| `/pricing` | “Flexible plans for real hiring needs.” | Transparent tiers, taxes/limits, terms, billing contact |
| `/help` | “We're here to help you move forward.” | Searchable FAQs, support, privacy/abuse reports, accessibility request |
| `/legal/*` | Clear policy documents | Terms, privacy, cookies, accessibility, employer rules, retention |

**PUB-001** Public pages SHALL have usable permanent URLs, SEO metadata and correct canonical tags without exposing private records.  
**PUB-002** Public forms SHALL rate-limit abuse and not require login for fraud/accessibility reports.  
**PUB-003** Public counts and statistics SHALL come from permissioned, current aggregate data, never fabricated seed marketing metrics.

# 7. Jobseeker workspace — complete screen-by-screen specification

## 7.1 Jobseeker navigation and layout

The jobseeker workspace is the authoritative home of saved listings, permitted sharing, application status and interview preparation. Desktop shell: left sidebar (Home, Explore, Saved, My Applications, My Profile, Preparation, Assessments, Interviews, Alerts, Support); centered main workspace; right-context panel only when useful; compact top bar (global search, EORA, notifications, linked-app status, account). Do not render every ecosystem module as an equally large card. Jobseekers whose **Primary** Core goal is Jobs/Internships may see opportunities as main focus; those joining independently can select and update interest categories without full invasive profiling.

## 7.2 Screen inventory and content

| ID / Route | Screen | Main content | Main action and important states |
|---|---|---|---|
| JS-01 `/me/home` | My Opportunity Dashboard | Welcome, current goal, recommended listings, saved opportunities, pending applications, next steps, genuine interview status, linked-account health | “Explore Opportunities”; no-results, incomplete profile, provider outage, pending action |
| JS-02 `/me/link-accounts` | Identity Connection | Core status, Collaborate status, scopes, optional profile consent, link repair guide | “Connect AI Tathastu”, “Connect Collaborate”; partial/failed/revoked states |
| JS-03 `/me/onboarding` | Jobseeker Preferences | Interests, opportunity categories, locations, work modes, availability, notification preference | “Continue”; support skip optional fields without false completion |
| JS-04 `/me/saved` | Saved Opportunities | Folders/tags, notes, deadline ordering, filter and sort, active/closed labels | “Apply”, “Remove”, “Set Reminder”; empty/expired states |
| JS-05 `/me/applications` | My Applications | Tabbed All/Drafts/Applied/Assessment/Interviews/Offers/Closed; employer-confirmed vs user-reported tags | “Open Application”; filter by employer/type/status |
| JS-06 `/me/applications/:id` | Application Detail | Submission snapshot, status timeline, recruiter updates, messages/requests, attached documents, assessment/meeting references, notes, next action | “Respond”, “Withdraw”, “Report”; sensitive confirmation |
| JS-07 `/me/profile` | Professional Profile | Identity, education, projects, experiences, skills, achievements, published Collaborate profile, Core record sources | “Edit”, “Preview”; don't overwrite profile without review |
| JS-08 `/me/profile/share` | Opportunity-Specific Share | Select CV, projects, skill evidence, contact, links, optional ERIS records; preview employer-visible snapshot | “Confirm Share”; defaults minimal, revocable future scopes |
| JS-09 `/me/preparation` | Opportunity Preparation | Requirements, known supporting evidence, unknown fields, optional learning/projects/ERIS actions | “Open Learning”, “Add Evidence”; no hiring score promise |
| JS-10 `/me/assessments` | My Assessments | Invitations, assessment purpose, time constraints, accommodation, ERIS state, authorized completion result | “Launch ERIS”; unavailable/expired/rescheduled |
| JS-11 `/me/interviews` | Interviews | Confirmed invitations, timezone, formats, Connect access, preparation materials, accommodation requests | “Confirm Slot”, “Join via Connect”; access scoped |
| JS-12 `/me/alerts` | Notifications & Alerts | Saved searches, deadline alerts, application events, digest frequency, pause | “Save Preferences”; opt-in/out |
| JS-13 `/me/support` | Opportunity Support | Application guidance, accessibility, mentoring, actual need-based program discovery, confidential ticket status | “Request Support”; private by default |
| JS-14 `/me/connections` | Ecosystem Connections | Core & Collaborate mandatory links; ERIS/Connect/Learn optional scopes and sync evidence | “Manage Access”; refresh, disconnect, error |
| JS-15 `/me/settings` | Account & Privacy | Session, security, visibility, interest preferences, language, export/deletion, contact | “Save”; reauthentication for sensitive actions |
| JS-16 `/me/messages` | Application Messages | Recruiter-initiated authorized requests, status changes, interview coordination, approved Collaborate messaging link | “Reply”; anti-spam, retention, mute/report |

## 7.3 Dashboard widget specifications

**JS-DASH-001** First visible area SHALL show selected jobseeker direction and one relevant next action with no fake deadlines or application updates.  
**JS-DASH-002** Opportunity recommendations SHALL distinguish goal relevance from hard eligibility and differentiate “missing evidence” from a deficiency.  
**JS-DASH-003** “New opportunities” SHALL reflect listings meeting freshness policy, not old jobs with resetted timestamps.  
**JS-DASH-004** “My applications” SHALL render genuine stored records and status attribution.  
**JS-DASH-005** “Upcoming interviews” SHALL appear only when a valid confirmed meeting invitation exists; if none, show an honest empty state.  
**JS-DASH-006** “Recommended preparation” SHALL link to actually available Learn/Projects/ERIS content, and indicate when a service is unavailable.  
**JS-DASH-007** A jobseeker SHALL be able to reorder, pin and hide noncritical widgets with persistence; mandatory security/privacy notices cannot be hidden.  
**JS-DASH-008** Core's Primary, Secondary and Tertiary goals SHALL influence default widget order; the user can override it.  
**JS-DASH-009** UI SHALL not imply recruiter interaction, shortlist or hiring success unless an authorized event exists.  
**JS-DASH-010** User SHALL be able to navigate into saved listings, applications and settings in one logical action without return loops.

## 7.4 Jobseeker profile and Core/Collaborate reuse

**JS-PROF-001** Core is authoritative for person goals, education, user-confirmed CV-derived fields, skills and evidence where recorded.  
**JS-PROF-002** Collaborate is authoritative for optional professional profile visibility, portfolio/public professional identity and relationship/messaging features.  
**JS-PROF-003** AVSAR SHALL cache or snapshot only the minimum approved data necessary for its own applications and history, subject to retention.  
**JS-PROF-004** User SHALL see field origins: self-reported, CV-extracted and confirmed, source-backed, ERIS-assessed, institution-verified, unknown.  
**JS-PROF-005** Cross-app data conflict SHALL be shown in a review screen; AVSAR SHALL not silently overwrite manually edited application data.  
**JS-PROF-006** Applicant can apply with a minimal permitted evidence bundle and add extra evidence selectively; a public Collaborate profile SHALL not be required.  
**JS-PROF-007** Application profile preview SHALL accurately represent what the recruiter receives.  
**JS-PROF-008** CV/OCR results SHALL never be treated as proof that a qualification is verified.  
**JS-PROF-009** Editing or disconnecting cross-app profile fields SHALL preserve lawful historical application snapshots separately from live profile data.  
**JS-PROF-010** Employer shall see application-specific contact only after application/authorized communication, not via bulk profile scraping.

## 7.5 Saved opportunities, tracking and alerts

**JS-APP-001** Jobseeker can save and unsave active public listings; duplicate saves are idempotent.  
**JS-APP-002** Jobseeker can add private notes and personal deadline reminders.  
**JS-APP-003** Applying internally SHALL require clear submission confirmation, record receipt ID and immutable application snapshot.  
**JS-APP-004** Opening an external application page SHALL be logged only as an external redirect, not as a completed application.  
**JS-APP-005** User can self-report an external submission with explicit “self-reported” attribution.  
**JS-APP-006** Recruiter updates SHALL include timestamp and attributable source; candidates SHALL be informed of material changes.  
**JS-APP-007** User can withdraw an internally submitted application with a confirmation; status changes require server-side enforcement.  
**JS-APP-008** A recruiter SHALL not alter candidate private notes or saved-search preferences.  
**JS-APP-009** Alerts SHALL have per-category controls and unsubscribe; urgency shall be driven by actual published deadline.  
**JS-APP-010** A failed submission SHALL preserve the draft and provide clear retry guidance without double-application creation.  
**JS-APP-011** Duplicate submissions for the same role/person SHALL be prevented or explained, subject to employer-specific policy and revision rules.  
**JS-APP-012** External application tracking SHALL never infer employer-side outcome without supported integration.

## 7.6 Jobseeker support and fairness

**JS-FAIR-001** All public listings remain searchable independent of completing CV, obtaining ERIS badges or subscribing to products.  
**JS-FAIR-002** Financial-need assistance SHALL be opt-in and separate from recruiter applicant records.  
**JS-FAIR-003** Support eligibility must be based only on stated program criteria, with minimum necessary sensitive data and human appeal.  
**JS-FAIR-004** Every application form shall support keyboard access, accessible error summaries, saved drafts and reasonable accommodation channels.  
**JS-FAIR-005** Candidate support requests shall not create negative employer-visible signals or secret candidate penalties.  
**JS-FAIR-006** Users must be able to contest incorrectly categorized eligibility fields and submit supporting correction.  
**JS-FAIR-007** Youth applicants must see age-specific opportunities and restrictions accurately and cannot be directed to evade legal eligibility.

# 8. Recruiter workspace — complete screen-by-screen specification

## 8.1 Recruiter registration, verification and membership

**REC-ONB-001** Recruiter SHALL register with verified contact and prove authorization to act for a particular organization; personal email alone is insufficient proof.  
**REC-ONB-002** Organization evidence may include official domain, registered entity information, verified affiliation and appropriate contact verification; admin reviews evidence under documented policy.  
**REC-ONB-003** Organization review states SHALL be Submitted, Under Review, More Information Needed, Approved, Rejected, Suspended and Appealed.  
**REC-ONB-004** Recruiter can create and edit private organization drafts while awaiting verification, but cannot make listings public.  
**REC-ONB-005** Organization owners can invite additional recruiter seats up to plan limits; all invitations require role and organization checks.  
**REC-ONB-006** Admin shall not approve a company solely because it paid a subscription.  
**REC-ONB-007** Suspended or revoked organization permissions SHALL immediately prevent new publishing and unauthorized access, subject to permitted resolution flows.

## 8.2 Recruiter route/screen inventory

| ID / Route | Screen | Main content and controls | Critical behavior |
|---|---|---|---|
| RC-01 `/employer` | Employer Dashboard | Active postings, drafts, applicant pipeline, upcoming interviews, verification, billing, recent operational events | Pending verification CTA; honest metrics |
| RC-02 `/employer/onboarding` | Organization Setup | Org legal/display name, official domain, address, relevant documents, recruiter authority | Submit to verification, track status |
| RC-03 `/employer/verification` | Verification Center | Evidence provided, review state, reason and remediation, appeal mechanism | No direct publishing before approval |
| RC-04 `/employer/opportunities` | Listings Manager | Draft/Submitted/Published/Paused/Closed, expiry, duplication, renewal and source info | Role- and subscription-scoped |
| RC-05 `/employer/opportunities/new` | Job Posting Wizard | Role, category, pay, tasks, requirements, accessibility, application method, deadline | Save Draft → Preview → Submit Review |
| RC-06 `/employer/opportunities/:id` | Listing Performance | Actual views, legitimate applications, review status, source freshness, moderation history | No access to unrelated publisher data |
| RC-07 `/employer/applicants` | Applicant Queue | Submitted applicant list for owned openings, structured fields shared by applicants, status | No search of private global profiles |
| RC-08 `/employer/applications/:id` | Applicant Detail | Submission, evidence labels, notes, human decisions, optional ERIS/invite | Context-scoped access |
| RC-09 `/employer/pipeline` | Hiring Pipeline | Received/Review/Assessment/Interview/Offer/Closed columns | Audited transitions, no opaque auto-rejection |
| RC-10 `/employer/assessments` | ERIS Assessments | Templates, invitations, assessments, purpose, accommodations, usage | Only actual supported ERIS integration |
| RC-11 `/employer/interviews` | Connect Interviews | Schedule, candidate availability, timezones, invitation, meeting links | Authenticated meeting participants |
| RC-12 `/employer/messages` | Candidate Communications | Application-related conversation, templates, sent/received history | Spam/marketing restrictions |
| RC-13 `/employer/team` | Seats & Permissions | Recruiter roles, invitations, deactivation, permissions | Org owner/admin permission gate |
| RC-14 `/employer/billing` | Plans, Payments & Invoices | Tier, quotas, add-ons, usage, invoices, cancellations, refunds | Server-side entitlements; no hidden charges |
| RC-15 `/employer/analytics` | Hiring Analytics | Funnel by listing, application processing time, interview outcomes, source health | Aggregate privacy and minimum group sizes |
| RC-16 `/employer/organization` | Organization Profile | Public organization info, actual verified scope, career page, contact | Material changes may trigger re-review |
| RC-17 `/employer/support` | Employer Help | Moderation issues, billing, account access, appeals | Ticket system with audit |
| RC-18 `/employer/settings` | Workspace Settings | Contact, notifications, billing admin, MFA/roles, integrations | Protected sensitive changes |

## 8.3 Job posting wizard

Required groups: **Opportunity category**, title, department or function, employer, number of openings if known, work location/mode, paid/unpaid status and rationale where legally applicable, published salary or stipend information if available, start date/duration as relevant, responsibilities, required vs preferred eligibility, skill requirements, education/experience, application method (AVSAR direct or externally hosted), safe external URL if used, deadline, assessment requirements if any, accommodation contact, and publisher attestations.

**REC-POST-001** Wizard SHALL save drafts and preserve input across sessions.  
**REC-POST-002** Requirements SHALL distinguish hard eligibility from preferred qualifications and avoid discriminatory prohibited filters.  
**REC-POST-003** Job posting SHALL require explicit employer affirmation of authenticity, authority, non-scam terms and accurate application mechanism.  
**REC-POST-004** Applicant-paid interview fees, recruitment deposit scams, suspicious payment instructions and impossible/unsupported compensation claims SHALL trigger moderation policy.  
**REC-POST-005** Posting preview SHALL show exactly what public candidates will see, including paid/sponsored markers.  
**REC-POST-006** Submitting SHALL create `SUBMITTED`, not directly `PUBLISHED`.  
**REC-POST-007** Important edits to live compensation, duties, eligibility, organization identity or application destination SHALL require a new review; version history maintained.  
**REC-POST-008** Rejected/request-changes postings SHALL show actionable reason and resubmission path.  
**REC-POST-009** Closed/filled postings SHALL automatically leave active search and notify saved applicants appropriately.  
**REC-POST-010** Subscription quotas SHALL cap concurrent listings/recruiter seats; never cap how many legitimate applicants may apply to an already published job.  
**REC-POST-011** Expiration, renewal and archive rules SHALL be visible to recruiter and auditable.  
**REC-POST-012** Duplicated job templates SHALL copy draft content but never copy approval status.

## 8.4 Applicant review and recruitment

**REC-HIRE-001** Applicant queue SHALL include only candidates who actually submitted to that organization's listing or granted a relevant explicit share.  
**REC-HIRE-002** Skills SHALL have source labels; “ERIS-assessed” may appear only with an attributable supported ERIS record and approved visibility.  
**REC-HIRE-003** System SHALL permit role-relevant applicant sorting/filtering only using lawful, clearly documented criteria.  
**REC-HIRE-004** Final selection and rejection SHALL remain under accountable authorized human control; no automatic rejection solely from model-inferred suitability.  
**REC-HIRE-005** All significant reviewer actions SHALL be timestamped and associated with an authorized recruiter.  
**REC-HIRE-006** Candidate interview/assessment invitations SHALL use actual integration states; invitations are not results.  
**REC-HIRE-007** Pipeline SHALL prevent contradictory statuses (e.g., offered and rejected simultaneously) without an auditable correction flow.  
**REC-HIRE-008** Recruiters SHALL be able to request additional information through consent-aware channels, without hidden access to private Core records.  
**REC-HIRE-009** Recruiter export SHALL be role-bound, watermarked/logged where appropriate, rate-limited and limited to explicit submitted records.  
**REC-HIRE-010** Bulk outreach SHALL have abuse limits and candidate mute/report options.  
**REC-HIRE-011** Employer metrics SHALL never display private financial-support or sensitive accommodation details to unauthorized personnel.  
**REC-HIRE-012** A post-application employer status update SHALL trigger appropriate candidate notification, barring preferences/legal exceptions.

# 9. Admin Control Center — complete dashboard and modules

## 9.1 Admin experience principle

The Admin interface is an **operational command center**, not an aesthetic marketing dashboard. Fast safe decisions, revenue visibility, fraud reduction, customer support, service health and auditability take precedence over animated charts. It must use permissions and data minimization rather than providing one unlimited account with access to all student details.

## 9.2 Dashboard and route inventory

| ID / Route | Screen | Main operational widgets | Authorized actions |
|---|---|---|---|
| AD-01 `/admin` | Command Center | Pending org reviews, listing queue, flagged risks, subscriptions, paid usage, integration incidents, support SLA, unresolved appeals | Role-specific work queue, not universal private access |
| AD-02 `/admin/organizations` | Organization Verification | Identity claims, evidence/checklist, official domain verification, history and reviewer | Approve, request more info, reject, revoke |
| AD-03 `/admin/opportunities` | Listing Review | New/edited listing queue, policy flags, duplicates, payment scams, original source checks | Approve, reject, request changes, schedule publication |
| AD-04 `/admin/published` | Active Marketplace | Live listings, expiry, source health, staleness and abnormal changes | Pause, expire, remove, review again |
| AD-05 `/admin/reports` | Abuse & Fraud Cases | Candidate reports, impersonation, fake employer signals, suspicious destinations, evidence | Investigate, apply reversible restriction, escalate |
| AD-06 `/admin/appeals` | Appeals | Rejected organizations, candidate account constraints, disputed information | Independent review, uphold/reverse with reason |
| AD-07 `/admin/users` | Account Operations | Jobseeker entitlement integrity, recruiter status, support flags (minimum needed), linking failures | Limited remedial actions, escalation |
| AD-08 `/admin/roles` | Staff Permissions | Admin RBAC, temporary access, MFA state, emergency access logs | Dual-control role approval where required |
| AD-09 `/admin/subscriptions` | Plan Management | Employer tiers, seats, quotas, add-ons, renewals, cancellations | Manage plan entitlements under finance policy |
| AD-10 `/admin/finance` | Revenue Operations | Invoices, collected/refunded payments, tax records, churn, failed charges, usage | Refund, reconcile, export scoped finance reports |
| AD-11 `/admin/sponsorships` | Sponsored Listings | Campaign disclosure, budget, caps, accepted postings, limits, attribution | Approve campaigns; cannot purchase trust badges |
| AD-12 `/admin/analytics` | Marketplace Analytics | Listings, approved publishers, candidate funnels, fairness metrics and service trends | Export appropriately aggregated reports |
| AD-13 `/admin/support` | Support Desk | Student, employer, accessibility, billing, ID-link, urgent safety tickets | Assign, respond, resolve, escalate |
| AD-14 `/admin/assistance` | Opportunity Support Programs | Actual support inventory, private approved applications, decisions, audit | Program-scoped assistance reviewer only |
| AD-15 `/admin/integrations` | Ecosystem Status | Core, Collaborate, ERIS, Connect, Learn, EORA, payments, email delivery | Retry safe events, disable failing nonessential integration |
| AD-16 `/admin/operations` | System Health | API latency, queue backlog, listing-sync failures, error classes, incident timeline | Diagnostic, recover and limited feature flags |
| AD-17 `/admin/audit` | Audit Trail | Admin/recruiter critical events, policy version, evidence access and exports | Search, view, export with permissions |
| AD-18 `/admin/policies` | Governance | Verification rules, listing rules, fairness policy, jobseeker limits and billing disclosures | Version, preview and approve policy updates |
| AD-19 `/admin/content` | CMS and Landing Content | Category copy, help pages, approved partner records, official announcements | Publish only reviewed content |
| AD-20 `/admin/settings` | Platform Configuration | Global controls, risk thresholds, notification templates, retention jobs, settings | Restricted; staged changes and rollback |

## 9.3 Admin command center specifications

**ADM-001** Home SHALL display assigned pending work with counts from live operational tables, not static demo values.  
**ADM-002** High-risk verification/abuse cases SHALL be prioritized visibly and never mixed with promotional tasks.  
**ADM-003** Every approval/rejection SHALL require authenticated actor, timestamp, reason code and relevant evidence reference.  
**ADM-004** Moderation decision SHALL not be delegated solely to a language model or unsupported score.  
**ADM-005** High-risk operations (restore banned recruiter, broad export, override payment restrictions, global shutdown) SHALL require scoped authorization, MFA/step-up and dual control where appropriate.  
**ADM-006** Finance metrics SHALL use actual payment processor records and reconciliation, not pageview-derived guesses.  
**ADM-007** Admin users SHALL see only sections permitted by their role and organization/platform scope.  
**ADM-008** Admin action history SHALL be tamper-evident and protected from casual deletion.  
**ADM-009** The platform SHALL support emergency disabling of compromised recruiter publishing, integration traffic and suspicious campaign placements.  
**ADM-010** Administrative bulk actions SHALL be limited to low-risk reversible changes or require explicit review/confirmation.  
**ADM-011** Admin dashboard SHALL expose true integration health, incident status, event backlog and per-provider dependency.  
**ADM-012** Support operators SHALL be able to resolve linking problems without impersonating jobseekers or seeing raw passwords.  
**ADM-013** Admin actions on sensitive assistance cases SHALL be restricted to designated program officers and excluded from normal recruiter analytics.  
**ADM-014** Policy changes SHALL be versioned, reviewable and accompanied by effective date, impact and rollback.

## 9.4 Verification and listing review checklist

Every organization review must consider: legal/display identity; official contact/domain confirmation; authorized representative evidence; consistency across public records; relevant compliance flags; previous suspension history; financial scam signs; any prior impersonation. A verification **badge** must state what was actually checked. Every posting review must check: authorization; role legitimacy; description quality; job category; required vs preferred eligibility; compensation claims; application destination; deadline and status; applicable youth restrictions; prohibited fee requests; duplicate/suspicious listing; safe links; employer contact information; and an appeal/revision route.

**ADM-VER-001** Every new publisher SHALL require human admin authorization prior to initial publication.  
**ADM-VER-002** A trusted or paid organization MAY receive reduced repetitive manual checks for low-risk revisions only under documented approval; new high-risk claims still reviewed.  
**ADM-VER-003** “Verified publisher” and “Approved listing” SHALL be distinct records/labels.  
**ADM-VER-004** Admin SHALL be able to pause a public posting immediately when credible safety concerns arise and record review outcome.  
**ADM-VER-005** Reporters SHALL receive safe receipt and follow-up information without disclosure of confidential investigation evidence.  
**ADM-VER-006** Appeals SHALL be reviewed without forcing the original moderator to be the sole final reviewer.  
**ADM-VER-007** The public listing view SHALL reflect current moderation state within the defined publication propagation SLA.  
**ADM-VER-008** Reviewer actions SHALL not be affected by employer subscription status or sponsorship payments.

# 10. Monetization, pricing, limitations and business control

## 10.1 Commercial model

AVSAR adopts **employer-funded monetization** as its primary source of revenue. Students can search, view, apply to standard jobs/internships, save and track legitimate applications without paying for basic access (but must have both required linked accounts for authenticated jobseeker functions). Employer payments may purchase legitimate posting capacity, recruiter seats, workflow tools, increased operational analytics, authorized ERIS assessments, supported Connect meeting services, and clearly disclosed sponsored listing exposure. Paid ranking SHALL not alter the employer's formal hiring decision or public verification status.

## 10.2 Illustrative employer tiers — subject to validation

| Tier | Indicative price | Example entitlements (configurable; not a final commercial offer) |
|---|---|---|
| Starter | Free | 1 active listing, 1 recruiter seat, basic applicant pipeline, standard admin review |
| Growth | INR 1,499/month | Up to 5 active listings, up to 2 recruiter seats, scheduling, applicant management |
| Business | INR 4,999/month | Up to 20 active listings, up to 5 recruiter seats, enhanced analytics, optional integrations |
| Enterprise / Institution | Negotiated | Contracted seats/listings, institute placement workflow, compliance terms, approved API access |

Billing terms must explicitly identify included vs extra services, taxes, renewals, trial terms, refunds, cancellation and quota enforcement. Pricing may change after pilot employer research. The tiers are **design assumptions**, not claimed verified market prices.

## 10.3 Commercial functional requirements

**BILL-001** Billing SHALL use an approved payment provider; client redirects alone SHALL not mark payment successful.  
**BILL-002** Webhook events SHALL be authenticated, replay-safe, idempotent and mapped to immutable accounting records.  
**BILL-003** Paid employer entitlements SHALL be enforced server-side: active listings, seats, candidate-management tools and purchased usage.  
**BILL-004** A plan downgrade SHALL not silently discard applications or hide already submitted candidate records without lawful retention and access notice.  
**BILL-005** Cancellation and refund policies SHALL be clearly accessible and actionable.  
**BILL-006** Failure to pay SHALL follow a grace/remediation policy, preserving transparency and legitimate candidate status.  
**BILL-007** Recruiters SHALL see quota consumption, billing cycles, taxes and any additional charges before confirmation.  
**BILL-008** Sponsorship SHALL be visually distinguished from organic listing relevance; sponsored inventory must remain admin-approved and subject to frequency cap.  
**BILL-009** Payment SHALL not change organization verification decision, jobseeker evidence trust labels or hiring result.  
**BILL-010** Basic jobseeker applications SHALL not require payment, paid subscription or platform-specific assessment purchase.  
**BILL-011** ERIS and Connect commercial add-ons SHALL bill the employer/institution according to explicit usage agreements, not surprise per-candidate charges.  
**BILL-012** Revenue and refund reports SHALL reconcile to actual processor transactions and credit notes.  
**BILL-013** Account suspension due to serious fraud risk SHALL have clear impact on active subscriptions and appeal/refund treatment.

## 10.4 Fraud, fairness and platform-control restrictions

- No unapproved employer can publish public postings.
- No recruiter may access private jobseeker details by searching the global Core/Collaborate user base.
- No paid recruiter can buy verified assessment outcomes or place an applicant ahead of others in formal selection.
- No applicant must pay to apply for ordinary jobs/internships; warn about third-party fees where lawfully disclosed, with fraud reporting.
- Limit spam messages, bulk exports, listing duplication, bot signups, suspicious links, invite frequency, job upload sizes, ERIS and Connect resource use with measured, configurable quotas.
- Use warnings, reversible limitations and human appeals rather than unexplained permanent bans.
- Public listing search, legally eligible applicants and necessary accessibility support SHALL not be restricted to compel subscriptions.
- Do not discriminate through proxies for economic status, disability, age beyond lawful eligibility, ethnicity, religion or other protected characteristics.

# 11. Opportunity support, accessible participation and equitable access

## 11.1 Support concept

An optional **Opportunity Support Center** assists students who need additional guidance, accessibility accommodations or access to real scholarship/funding/mentorship programs. “Needy” must not become a hidden model label inferred from surname, postal code, resume or social connections. Support should be opt-in, private, controlled by actual program terms, and separated from ordinary recruitment decisions. Basic fair-access features are available to everyone.

**FAIR-001** Platform SHALL provide public, anonymous searching and listing details, regardless of CV completeness or Core/Collaborate sign-in.  
**FAIR-002** A mandatory account link SHALL not require making Collaborate public, sharing full CV or paying fees.  
**FAIR-003** Eligibility decisions SHALL use stated lawful criteria and declared evidence; missing evidence SHALL be “unknown”, not a negative score.  
**FAIR-004** Public ranking SHALL offer a non-personalized sort so candidates can explore broadly.  
**FAIR-005** Need-related personal details SHALL be collected only when explicitly requested for a genuine support program and separated from recruiter records.  
**FAIR-006** Financially constrained students may receive available support services or scholarship discovery; this SHALL NOT secretly reduce other eligible applicants' chance to apply.  
**FAIR-007** Support applications SHALL support clear decision reasons, appeals and retention limits.  
**FAIR-008** Accessibility requests SHALL be accepted even when the user cannot complete ordinary sign-in or form workflows.  
**FAIR-009** No system SHALL rank a candidate based on unconsented hardship, popularity or private-network size.  
**FAIR-010** Users SHALL be able to correct incorrect eligibility/skill labels and identify source records.  
**FAIR-011** Candidate-facing AI explanations SHALL be non-authoritative guidance; final legal eligibility and hiring remain under documented rules and human review.  
**FAIR-012** Recruiters SHALL be offered appropriate accessible alternative assessment/interview paths where required by policy and law.

# 12. Cross-product integration contracts

## 12.1 Boundary rule and integration pattern

AVSAR does not share direct database access with Core, Collaborate, ERIS, Connect or Learn. Integrations use explicitly versioned APIs, server-validated identity, short-lived scoped delegation, consent receipts, audit/event records and a minimal event outbox or broker. Prefer pairwise pseudonymous IDs. Revoke prospective access when consent is withdrawn. Employ least privilege, data minimization, back-pressure and retry-safe event handling. A broken optional integration shall not corrupt applications.

| Product | Authority / information owner | AVSAR reads only when permitted | AVSAR may send back | Degradation behavior |
|---|---|---|---|---|
| AI Tathastu Core | Identity, goals, Person 360, reviewed education/skills/evidence | Link confirmation, user-approved claims and evidence refs | Saved/apply journey summary with consent | New linking blocked; public search continues; existing snapshot retained per policy |
| Collaborate | Account presence, professional identity, approved portfolio and messaging | Mandatory account link; optional selected portfolio/profile | Authorized recruiter conversations or opportunity context | New link blocked; private profile sharing unavailable; public search continues |
| ERIS | Assessments and supported result attestation | Actual invitations/completions/results that candidate can share | Assessment request and eligible candidate invitation | Offer alternative/manual process; do not invent pass/fail |
| Connect / Meet | Meeting invitations, access tokens, participation status | Authorized interview meeting reference and confirmed session status | Meeting creation requests, schedule, participants | Interview remains pending/reschedule; no fake meeting links |
| AI Learning | Learning catalogs, actual available courses/progress | Relevant lessons and student-approved completion progress | Opportunity requirement topics, user-approved preparation plan | Show independent preparation steps or unavailable state |
| EORA | Contextual guidance and orchestration UI | Only AVSAR data plus approved scoped content | Request scoped advice or next-step explanation | Deterministic/help alternatives; no blocking application |

## 12.2 Core + Collaborate federation is mandatory but data sharing remains granular

**INT-001** AVSAR SHALL verify both linked account identities for jobseeker entitlement.  
**INT-002** Core and Collaborate SHALL not be assumed to share sessions; AVSAR SHALL implement an explicit approved federation path.  
**INT-003** A verified Core/Collaborate account presence proof SHALL be sufficient to satisfy mandatory account linking; optional richer data access needs additional authorization.  
**INT-004** Required identity scopes and optional content scopes SHALL be distinguishable in the consent UI and access policy.  
**INT-005** User may decline optional import of Core education/projects or public Collaborate profile and still use basic AVSAR jobseeker functions if both identity accounts are linked.  
**INT-006** Server SHALL store authorization receipts, effective scopes, issuer, expiration and refresh/revocation state.  
**INT-007** Incoming event and response SHALL be cryptographically/authentically validated and schema-checked.  
**INT-008** No service may write directly into another product's authoritative person or project tables.  
**INT-009** User profile sync SHALL support conflicts, field origin, correction and removal/revocation policies.  
**INT-010** Service outage SHALL produce truthful degraded status, not silent mock completion.

## 12.3 ERIS skill verification

**ERIS-001** Recruiter may request only existing supported, role-relevant assessments after approval and disclosure.  
**ERIS-002** Candidate SHALL receive assessment purpose, test conditions, expected data access, accessibility path and deadline prior to accepting.  
**ERIS-003** AVSAR SHALL validate ERIS-signed completion/result evidence against assessment ID, candidate and authorization scope.  
**ERIS-004** “Verified skill” badge SHALL distinguish assessment-attested outcome from broader real-world proficiency or institutional verification.  
**ERIS-005** No recruiter shall infer an unrecorded ERIS grade or silently auto-reject on unreviewed, opaque risk/anomaly signals.  
**ERIS-006** Assessment results shared with employer SHALL be limited to consented, purpose-specific summary/details as policy allows, with revocation/retention semantics.  
**ERIS-007** If ERIS is unavailable, applicant status SHALL remain accurate and employer can choose permitted reschedule/alternative; no false failure is recorded.

## 12.4 Connect / Meet interview integration

**MEET-001** Authorized recruiter may request an interview slot for a specific submitted application.  
**MEET-002** Invitation SHALL record proposed times, timezones, accepted slot, authorized participants and any accessibility instructions.  
**MEET-003** Connect SHALL issue short-lived, participant-scoped meeting authorization, not public permanent links.  
**MEET-004** Invitation status (proposed, accepted, rescheduled, cancelled) SHALL be distinct from meeting completion.  
**MEET-005** AVSAR SHALL update “interview completed” only from supported attested events or transparent authorized manual entry.  
**MEET-006** Recording, transcription, analysis and retention SHALL be separately disclosed and consented where required; no covert emotion/personality scoring.  
**MEET-007** Connect outage SHALL preserve application state and permit reschedule/manual approved fallback.

## 12.5 Learning, Collaborate and EORA

**LEARN-001** Opportunity requirements MAY map to existing published AI Learning modules in the user's available catalog.  
**LEARN-002** AVSAR SHALL not claim course completion based solely on opening the course link.  
**LEARN-003** Preparation suggestions SHALL be optional and not gate applications.  
**COLL-001** Collaborate SHALL provide account-link proof; separately authorized professional card/portfolio share is selectable per application.  
**COLL-002** AVSAR SHALL not create public recruiter connections, messages or visible profiles without user action and actual Collaborate success.  
**EORA-001** EORA SHALL receive only scoped, necessary context and clear provenance flags.  
**EORA-002** EORA SHALL help interpret requirements and suggest actual available next steps, not promise job outcomes or invented employer activity.  
**EORA-003** Routine filters, deadlines, eligibility and status messages SHALL use deterministic code/data where possible to control cost and reliability.

# 13. Search, matching, explainability and responsible recommendations

## 13.1 Multi-stage discovery approach

**Stage 1 — listing validity:** indexed only if approved, published, within permitted publication window and not paused/removed.  
**Stage 2 — explicit user filters:** category, search words, location, remote preference, education and salary preferences applied faithfully.  
**Stage 3 — optional relevance signals:** role/title fit, user-selected goals, technical topics, known confirmed projects/skills, freshness and location preference.  
**Stage 4 — explanation:** show the actual matching factors and unknown fields without rendering an unsupported “job chance” score.  
**Stage 5 — sponsorship separation:** sponsored positions are visibly labeled, subject to eligibility and category relevance, and cannot displace or hide all organic results.  
**Stage 6 — corrections and opt-out:** user can edit goals/filters, disable personalization and recover ordinary chronological/relevance sorts.

## 13.2 Matching constraints and requirements

**MATCH-001** No model shall produce automatic hiring decisions, CV rejection or disqualification from inferred psychological, financial or private-background traits.  
**MATCH-002** Jobseeker may view why each opportunity was recommended using comprehensible reasons derived from recorded, authorized signals.  
**MATCH-003** Match signals SHALL distinguish confirmed, self-reported, assessment-backed and unknown skill evidence.  
**MATCH-004** Missing evidence SHALL NOT be converted into a negative proficiency value by default.  
**MATCH-005** Hard eligibility SHALL derive from published legal and employer requirements, not invented AI judgments.  
**MATCH-006** Users SHALL be able to disable personalization and browse a neutral listing order with the same public inventory.  
**MATCH-007** Recommendation cache SHALL be invalidated on new approved listing, meaningful user goal change, job closure or consent revocation, according to defined SLAs.  
**MATCH-008** No financial hardship attributes shall be read by ordinary recommendation or employer candidate-ranking pipelines.  
**MATCH-009** Sponsorship SHALL be labeled, limited and not buy shortlist/hiring priority.  
**MATCH-010** Relevance calculations SHOULD be deterministic/reproducible for a fixed model version, listing dataset, user-approved context and settings.  
**MATCH-011** Recommendations SHALL expose useful empty/unavailable states; no need to fabricate listings.  
**MATCH-012** Recommendation experiments SHALL be controlled by privacy-preserving testing, measuring legitimate usefulness and disparate error patterns.

# 14. Communication, notifications and workflow engagement

## 14.1 Communication surfaces

- **Transactional:** account linking, application submission, recruiter decision, assessment invitation, interview scheduling, moderation decisions, billing and support updates.
- **Optional:** new matching opportunities, saved search digest, preparation reminders, content updates, closing-soon alerts.
- **Urgent safety:** fraudulent-listing warning, account security event, compromised employer/meeting link.

**NOT-001** Notification settings SHALL expose channel, category and digest frequency with reliable opt-out for nonessential messages.  
**NOT-002** Message templates SHALL contain factual status and safe deep links, not raw tokens or private CV excerpts.  
**NOT-003** Notification delivery SHALL be idempotent and store attempts/outcomes; duplicate events must not repeatedly spam a candidate.  
**NOT-004** A “deadline soon” prompt SHALL use an actual source-reported timestamp and timezone.  
**NOT-005** Recruiter messaging SHALL be limited to legitimate applications or approved explicit contact channels and have anti-spam/report features.  
**NOT-006** Email and in-app messages SHALL distinguish platform statements from employer-provided text.  
**NOT-007** Candidate SHALL not be notified of fake profile views, false hiring probabilities or fabricated scarcity.  
**NOT-008** Meeting invites SHALL include timezone, format, participant information and rescheduling channel.  
**NOT-009** Users SHALL receive notices if an opportunity they applied to is suspended for safety, consistent with investigation needs.  
**NOT-010** Accessibility or legal-eligibility notices SHALL not be hidden behind marketing popups or paywalls.

## 14.2 Conversion and engagement principles

Visitors should succeed without marketing friction: the first public screen provides functional search; result cards have concise relevant facts; clicked listings preserve user search context; only actions requiring identity prompt linking; status/next action are obvious after submission. Engagement optimizes useful outcomes (applications finished, interviews prepared, deadlines met), **not addictive scrolling, forced referrals, endless badges, pushy notifications or hidden payment prompts**. Jobseeker-linked Core/Collaborate accounts must be explained with a two-step progress guide rather than surprise redirects.

# 15. Information model and suggested database design

## 15.1 Data ownership

AVSAR owns listing, recruiting, application, billing, support, admin and integration state. Core owns its canonical person records. Collaborate owns professional networking/profile state. ERIS owns assessment evidence and original results. Connect owns meeting control/session records. Learn owns its course/progress records. AVSAR stores only necessary identifiers, consent receipts and permitted snapshots/references; avoid synchronized copies of complete source databases.

## 15.2 Proposed AVSAR logical tables

| Table | Key fields / relationships | Security / retention notes |
|---|---|---|
| `avsar_users` | `id`, `account_kind`, `created_at`, `status` | Platform identity only; no raw provider tokens in logs |
| `external_identity_links` | `user_id`, `issuer`, `external_subject`, `link_status`, `verified_at` | Core and Collaborate links unique; rotate/revoke tokens |
| `external_consent_grants` | `user_id`, `provider`, `scopes`, `purpose`, `expires_at`, `revoked_at` | Optional scopes distinct from minimum presence |
| `jobseeker_profiles` | `user_id`, preferences, allowed visibility, linked onboarding status | Private by default; avoid duplicate CV storage |
| `profile_snapshots` | `user_id`, `source`, `reference`, `version`, approved fields | Application-specific snapshots; retention policy |
| `organizations` | `id`, legal/display name, domain, status, risk flags | Verification is decision, not payment result |
| `organization_representatives` | `org_id`, `user_id`, `role`, `verified_authority` | Membership permissions, event history |
| `organization_verifications` | `org_id`, evidence refs, reviewer, outcome, reason, version | Sensitive docs secured, finite retention |
| `employer_plan_subscriptions` | `org_id`, tier, payment reference, state, renewal | Provider-reconciled; audited |
| `billing_invoices` | `org_id`, amount/tax/currency, payment reference, state | Finance-only, lawful retention |
| `billing_ledger_events` | `event_id`, provider, idempotency key, financial fields | Immutable reconciliation source |
| `opportunities` | `id`, `org_id`, type, title, status, publish/deadline, work mode | Current approved version separate |
| `opportunity_versions` | `opportunity_id`, structured copy, version, change reason | Re-review material edits |
| `opportunity_review_decisions` | `opportunity_version_id`, admin, checks, decision, reason | Auditable publish gate |
| `opportunity_sources` | `opportunity_id`, origin URL, check method, checked_at | Last checked distinct from posting date |
| `opportunity_requirements` | `opportunity_id`, criteria, hard/preferred, evidence type | Transparent matching input |
| `sponsored_placements` | `opportunity_id`, placement window, label, caps, paid order | Separated from verification and candidate ranking |
| `saved_opportunities` | `user_id`, `opportunity_id`, notes, reminder | User-private; unique pair |
| `applications` | `id`, `opportunity_id`, `user_id`, channel, status, submitted_at | Ownership + org access; immutable receipt |
| `application_snapshots` | `application_id`, selected fields, consent reference, version | Exact applicant-visible submission copy |
| `application_status_events` | `application_id`, from/to, actor, source, reason, time | Append-only for truth and audit |
| `application_messages` | `application_id`, sender, type, body/ref, status | Restricted to participants; anti-abuse |
| `assessment_requests` | `application_id`, ERIS assessment ID, invitation/result ref, state | Result view permission enforced |
| `interview_requests` | `application_id`, Connect meeting ref, slots, timezone, state | Meeting tokens not stored as plaintext public IDs |
| `preparation_plans` | `user_id`, `opportunity_id`, requirements, item refs | Optional; not a hiring filter |
| `notifications` | recipient, category, payload ref, state, sent_at | Minimum data, retry-safe |
| `support_cases` | requester, category, restricted notes, state, escalation | PII isolation; public anonymous intake supported |
| `assistance_programs` | sponsor, real eligibility, access instructions, validity | No invented funding availability |
| `assistance_requests` | requester, program, sensitive references, case status | Strong partition; no recruiter visibility |
| `moderation_cases` | target, report ID, evidence refs, risk, decision | Appeal and data-minimization policy |
| `appeals` | target decision, appellant, status, independent reviewer | Reason and times recorded |
| `admin_audit_events` | actor, action, target, policy version, timestamp, changes | Tamper-evident and protected |
| `integration_events_outbox` | event ID, source, destination, schema version, status, attempts | At-least-once idempotent integration |
| `integration_delivery_receipts` | event ID, consumer, processed_at, outcome | Duplicate suppression |
| `feature_flags` | flag, scope, enabled, audit event | Controlled rollout / emergency kill switch |

## 15.3 Mandatory data constraints

**DATA-001** Provider external subjects SHALL have scoped unique constraints and cannot be linked to conflicting active users without secure recovery.  
**DATA-002** Jobseeker access policy SHALL derive from two active verified links and local entitlement, not only a frontend boolean.  
**DATA-003** Listing publishing SHALL be transactionally or conditionally coupled to its approved version and moderation status.  
**DATA-004** An application SHALL retain an immutable submitted snapshot and an append-only sequence of later status events.  
**DATA-005** Sensitive support/assistance records SHALL use separate access policies and not be embedded in ordinary applicant profiles.  
**DATA-006** Object files and CVs SHALL use private storage, short-lived authorized access and declared retention; never public static paths.  
**DATA-007** Consent grants, event deliveries and billing webhooks SHALL use idempotency keys and uniqueness where appropriate.  
**DATA-008** Soft-deletion, anonymization, data export and deletion requests SHALL respect legitimate retention/legal holds and cross-product ownership.  
**DATA-009** Deleting an AVSAR link SHALL not directly delete Core or Collaborate records; send separate authorized requests where needed.  
**DATA-010** All critical state transitions SHALL preserve traceability to actor, source and time.

# 16. Proposed APIs, events and contracts (not implemented endpoints)

## 16.1 AVSAR HTTP resources

| Method / path (proposed) | Role / scope | Function |
|---|---|---|
| `GET /api/v1/opportunities` | Public | Search and filter approved live listings |
| `GET /api/v1/opportunities/:id` | Public | Public detail and current status |
| `POST /api/v1/reports` | Public w/ abuse controls | Report suspicious listing/company/issue |
| `POST /api/v1/auth/link/core/start` | Auth/linking user | Start validated Core linkage |
| `POST /api/v1/auth/link/collaborate/start` | Auth/linking user | Start validated Collaborate linkage |
| `POST /api/v1/auth/link/:provider/callback` | Auth service | Validate code/state, associate user identity |
| `GET /api/v1/me/entitlement` | User | Server-calculated two-provider active state |
| `GET /api/v1/me/profile` | Jobseeker | View approved snapshot/preferences |
| `PATCH /api/v1/me/profile` | Jobseeker | Update AVSAR-owned preferences |
| `POST /api/v1/me/profile/consent` | Jobseeker | Grant selected optional scopes |
| `POST /api/v1/me/saved/:opportunityId` | Jobseeker | Idempotent save |
| `DELETE /api/v1/me/saved/:opportunityId` | Jobseeker | Remove save |
| `POST /api/v1/applications` | Active jobseeker | Create direct application draft |
| `POST /api/v1/applications/:id/submit` | Applicant | Validate and atomically submit |
| `GET /api/v1/applications/:id` | Applicant or authorized recruiter | Scoped detail/history |
| `POST /api/v1/applications/:id/withdraw` | Applicant | Audited withdrawal |
| `POST /api/v1/organizations` | Recruiter | Organization verification request |
| `GET /api/v1/employer/opportunities` | Recruiter | Own organization's listings |
| `POST /api/v1/employer/opportunities` | Verified recruiter | Draft posting |
| `POST /api/v1/employer/opportunities/:id/submit` | Verified recruiter | Submit listing to review |
| `PATCH /api/v1/employer/applications/:id/status` | Authorized recruiter | Actual applicant status update |
| `POST /api/v1/employer/applications/:id/assessment` | Authorized recruiter | Role-relevant ERIS request |
| `POST /api/v1/employer/applications/:id/interview` | Authorized recruiter | Connect meeting invitation |
| `GET /api/v1/admin/review-queue` | Scoped Admin | Pending cases with minimum metadata |
| `POST /api/v1/admin/opportunities/:id/decision` | Listing moderator | Approve/reject/request changes |
| `POST /api/v1/admin/organizations/:id/decision` | Verification officer | Organization decision |
| `GET /api/v1/admin/finance/summary` | Finance role | Processor-backed metrics |
| `GET /api/v1/admin/audit` | Audit-authorized Admin | Filtered sensitive audit |
| `POST /api/v1/billing/webhook` | Verified payment provider | Subscription/reconciliation state |
| `POST /api/v1/integrations/eris/events` | ERIS signed service | Assessment state/result event |
| `POST /api/v1/integrations/connect/events` | Connect signed service | Meeting scheduling/session event |

Each API must have versioned schemas, request validation, clear HTTP status semantics, authorization matrix, rate limits, pagination where applicable, redacted structured logs and safe retry contracts. These paths are **proposed**, not claimed to exist in any repository.

## 16.2 Core and Collaborate provider contracts

Minimum Core proof: issuer, subject, valid signature/session proof, link timestamp and active identity status. Optional scopes (independently granted) may include `profile.basic.read`, `goals.read`, `education.confirmed.read`, `skills.evidence.read`, `projects.selected.read`.  
Minimum Collaborate proof: issuer, subject, linked account status. Optional scopes may include `professional_profile.selected.read`, `portfolio.selected.read`, `messaging.open_conversation` (only for initiated/authorized participant context). **These are illustrative scope names to be negotiated**, not existing implementation facts.

## 16.3 Event contracts and consistency

Suggested event envelope: `event_id`, `schema_version`, `source_product`, `subject_pairwise_id`, `event_type`, `resource_ref`, `occurred_at`, `consent_ref` where relevant, `nonce/signature` or transport authentication, `correlation_id`. Examples: `OpportunityPublished`, `OpportunitySuspended`, `OpportunitySaved`, `ApplicationSubmitted`, `ApplicationStatusChanged`, `AssessmentInvitationIssued`, `AssessmentCompleted`, `InterviewAccepted`, `InterviewRescheduled`, `CoreEvidenceUpdated`, `ProfileScopeRevoked`. Event processing should be at-least-once safe with consumer idempotency and dead-letter review. No single event SHALL automatically create a verified assessment or an offer without matching authoritative source.

**API-001** All private APIs SHALL enforce role, resource ownership, tenant scope and consent independent of UI.  
**API-002** OAuth/code exchanges and inbound webhooks SHALL validate issuer, audience, expiry, replay, signature and state.  
**API-003** Writes SHALL use idempotency where duplicate submission is harmful.  
**API-004** Pagination SHALL avoid cross-tenant leaks and stable-sort anomalies.  
**API-005** API errors SHALL be safe and actionable, avoiding secrets/private records in responses.  
**API-006** Each integration SHALL have contract tests and deploy-time compatibility checks.  
**API-007** Client SHALL distinguish accepted request from completed asynchronous action.  
**API-008** Private cross-product resources SHALL not be transferred through unprotected redirect URLs.  
**API-009** Consent revocation SHALL prevent future source fetches and subscriptions after a defined grace/retry window.  
**API-010** Health endpoints SHALL disclose generic service status publicly and detailed provider diagnostics only to authorized operations users.

# 17. Security, privacy, safeguarding and compliance requirements

## 17.1 Security baseline

**SEC-001** Protect all sessions with supported secure, HttpOnly, SameSite cookies and robust CSRF protections for state-changing requests.  
**SEC-002** Use MFA/step-up for Admin and high-risk recruiter financial/organization operations.  
**SEC-003** Validate every untrusted string, URL, document and external service payload; mitigate XSS, SSRF, injection and unsafe redirects.  
**SEC-004** File uploads SHALL validate content type, signature, size and ownership and use safe private storage; malware scanning where applicable.  
**SEC-005** Secrets, tokens, CV contents, raw assessment responses and financial hardship SHALL NOT be logged.  
**SEC-006** Protect against automated abuse through per-endpoint rate limits, actor-aware quotas and human-readable recovery.  
**SEC-007** Enforce server-side tenant isolation across recruiters, applicants and organizations, with database security policies where supported.  
**SEC-008** Encrypt confidential data in transit and at rest using established provider mechanisms, with secret rotation and access management.  
**SEC-009** Integrations SHALL use narrowly scoped service credentials and explicit revocation/rotation procedures.  
**SEC-010** Critical admin operations and exports SHALL be fully audited, with anomaly alerting.  
**SEC-011** Passwords, if AVSAR ever stores them, SHALL use a modern established password hashing design and must not be shared across independent products.  
**SEC-012** Dependency updates, SAST/dependency scans, regression tests and safe deployment review SHALL gate production.  
**SEC-013** Public listing URLs SHALL be checked against phishing/unsafe destination indicators without claiming they are universally safe.  
**SEC-014** Candidate messaging SHALL have reporting, blocking/muting, anti-harassment and rate-limit pathways.  
**SEC-015** A compromised external provider shall not receive elevated Core/Collaborate or AVSAR token privileges.

## 17.2 Privacy and data rights

**PRIV-001** Collect the minimum necessary personal information; identify collection purpose and retention category.  
**PRIV-002** Account linkage SHALL NOT imply blanket consent to import all Core/Collaborate data.  
**PRIV-003** Candidate shall be able to preview submitted employer-visible data before direct application.  
**PRIV-004** Consent withdrawal SHALL immediately block future elective sync, with clear caveats for existing lawful application snapshots.  
**PRIV-005** Support-related personal circumstances and accommodations SHALL be separately access-controlled and not supplied to recruiter ranking/advertising.  
**PRIV-006** User-facing privacy controls SHALL explain public profile, shared application snapshot and private workspace as distinct visibility levels.  
**PRIV-007** Provide export, correction, objection/complaint and deletion request pathways consistent with applicable law and retention.  
**PRIV-008** Sensitive data export SHALL require least privilege, audit and appropriate secure delivery.  
**PRIV-009** Third-party data processors, cross-border transfers, payment processing and data retention SHALL be documented before launch.  
**PRIV-010** Candidate ages and legal eligibility SHALL be handled with data minimization and applicable safeguards; do not expose date of birth unnecessarily.

## 17.3 Fairness, youth safeguarding and hiring integrity

AVSAR may serve students below working-age thresholds for some categories. The platform MUST enforce lawful opportunity eligibility and provide age-appropriate browsing and preparation. It shall not support evasion of employer age checks. Recruiters must not be allowed to request invasive or irrelevant sensitive attributes in generic opportunity applications. Any protected-attribute processing for equal-opportunity monitoring needs a justified lawful basis, privacy constraints and separate governed pipelines. Final legal compliance needs professional review before launch, especially for minors, recruitment, local labor and Indian privacy rules.

**SAFE-001** Applicant SHALL have a pathway to report recruitment payment demands, impersonation, harassment, unsafe interview invitations and misleading claims.  
**SAFE-002** Do not offer illegitimate age-restricted opportunities as actionable to ineligible minors.  
**SAFE-003** No automatic psychologically sensitive personality/emotion scoring from Connect calls.  
**SAFE-004** No sale of student profile data or financial-need targeting data to recruiters/advertisers.  
**SAFE-005** Admin/Recruiter privileged screens SHALL not display data beyond job-related minimum necessity.  
**SAFE-006** Recruiter-initiated ERIS assessments must be role relevant, appropriately accommodated and transparently disclosed.  
**SAFE-007** Appeals and human correction available for materially consequential wrong data or restrictions.

# 18. Nonfunctional requirements: performance, availability and accessibility

These are **proposed engineering targets**, not currently measured results. Final SLAs should be approved after baseline testing and infrastructure cost review.

| ID | Quality attribute | Proposed measurable acceptance target |
|---|---|---|
| NFR-001 | Public availability | 99.9% monthly availability target for public browse/search after stabilization, excluding disclosed scheduled maintenance |
| NFR-002 | User-perceived search | P95 public search API response under 800ms at agreed test dataset/load, excluding client/network latency; fallback when source search unavailable |
| NFR-003 | Listing detail | P95 under 600ms API response under agreed load, with cache validity and moderation freshness safeguards |
| NFR-004 | Desktop UI | Key views usable at 1280×800, 1440×900 and 1920×1080, no horizontal overflow or clipped actions |
| NFR-005 | Accessibility | Aim for WCAG 2.2 AA; keyboard, focus order, labels, contrast, non-color-only states, reduced motion, accessible alternatives |
| NFR-006 | Forms and drafts | Autosave/explicit save; recover safe drafts after refresh or temporary connection loss, with clear confirmation |
| NFR-007 | Publication consistency | A suspension/closure should be reflected in search and apply checks promptly within a tested policy-defined delay; server always rechecks at apply |
| NFR-008 | Account federation | Recoverable linking with helpful timeout/error screen; never mark linked if external proof unavailable |
| NFR-009 | Sensitive operations | Step-up, audit and justified authorization for high-risk admin/finance/export operations |
| NFR-010 | Data isolation | Zero cross-account or cross-organization unauthorized record access in automated authorization tests |
| NFR-011 | Notification reliability | Retries, idempotent delivery and explicit delivery-state monitoring; no invented sent/success status |
| NFR-012 | Observability | Request IDs, structured privacy-safe telemetry, queue backlog, per-service error classification and dashboards |
| NFR-013 | Backup/recovery | Document/test backup frequency, restore procedure, RPO/RTO before production; targets based on budget and assessment |
| NFR-014 | Security updates | Routine dependency/security review and production rollback plan |
| NFR-015 | Localization | English first; architecture supports future Hinglish/Hindi copy with full translation and accessible date/time formats |
| NFR-016 | Data lifecycle | Defined retention classes for drafts, applications, interviews, consent and audit; scheduled deletion with actual test evidence |
| NFR-017 | UX performance | Avoid heavy hero animation on product screens; LCP/CLS/INP budgets defined per browser-test environment |
| NFR-018 | Graceful degradation | Optional ERIS/Connect/Learn/EORA outages do not destroy primary browse/apply records or fabricate downstream outcomes |
| NFR-019 | Mobile support | Basic accessible responsive public/read-only support; polished mobile launch deferred by product priority |
| NFR-020 | Cost controls | Measured service budgets, rate limits, alert thresholds and feature flags on paid API-heavy services |

## 18.1 Accessibility specification

- Use semantic headings, labels, descriptions, accessible forms, focus indicators and meaningful keyboard order.
- On public search, filter state must be discoverable and resettable without drag interactions.
- Opportunity cards need readable text beyond icon/color, and show whether the listing is expired, external or sponsored.
- When time-limited application/session expires, preserve draft where permitted and show explicit time remaining or retry.
- Provide a reasonable pathway to alternative interviews and assessments where necessary and supported.
- Avoid mandatory full-screen animations, inaccessible CAPTCHA or unreadable text-on-gradient as a blocking experience.
- EORA must be optional; all core tasks can be completed without using conversational AI.
- Screen reader announcements for validation, save success, job status updates and review decisions.

# 19. Visual system, information architecture and UI behavior

## 19.1 Design philosophy

AVSAR's **public marketing** inherits AI Tathastu's dark, spacious, cinema-inspired identity. Its **search and dashboard** surfaces should feel more like a highly usable Naukri/Indeed marketplace: fast search, strong hierarchy, predictable filters, detailed listing previews, clearly positioned actions and low cognitive burden. Student screens emphasize discovery and applications. Recruiter screens emphasize workflow, pipeline and billing. Admin screens emphasize cases, sources, risk, revenue and audit, not decorative hero animations.

## 19.2 Tokens and typography

| Token | Value | Use |
|---|---|---|
| `brand.obsidian` | `#08090B` | Public hero/nav and dark editorial sections |
| `brand.charcoal` | `#171513` | Dark cards and elevated public content |
| `brand.champagne` | `#C9A46D` | Warm secondary emphasis |
| `brand.amber` | `#F49A47` | High-contrast primary CTA in dark contexts |
| `surface.paper` | `#FAF9F6` | Main authenticated workspace |
| `surface.warm` | `#F4F1EA` | Filters, sidebars and card interiors |
| `ink.primary` | `#17171F` | Standard product text |
| `intelligence.violet` | `#7865F5` | Select contextual intelligence accents |
| `intelligence.cyan` | `#66D9F7` | Graph/learning signals when relevant |
| `font.heading` | Space Grotesk | Page titles, hero and clear hierarchy |
| `font.body` | DM Sans | Forms, listings and content |
| `font.meta` | JetBrains Mono | Source/date/status metadata |

## 19.3 Public and dashboard composition

**Public landing:** small nav → cinematic left-aligned hero + immediately usable prominent search → categories → sourced listings → differentiated “Opportunity to Action” journey → ecosystem integration → fair access/trust → employer CTA → FAQ/footer. Avoid a wall of feature cards before search.  
**Search results:** desktop 260px filter rail + central list 400–520px + right details panel where screen allows. Filters remain in view or collapse intentionally; active state preserved in URL where safe.  
**Jobseeker workspace:** warm paper side navigation + primary opportunity task panel + supporting application/preparation cards.  
**Recruiter workspace:** company-scoped top nav + operational sidebar + large grids/tables + actionable pipeline; allow screen reader alternatives to drag/drop.  
**Admin workspace:** permission-aware navigation, queues and evidence side panel, audit history, safe action footer; require reason confirmation for sensitive decisions.

## 19.4 Microcopy and interaction examples

| Context | Recommended exact interface text |
|---|---|
| Anonymous attempt to apply | “To apply through AVSAR, connect your AI Tathastu and Collaborate accounts. Your current opportunity will be saved while you complete setup.” |
| Link Core | “Connect AI Tathastu — confirms your account and lets you choose what to share.” |
| Link Collaborate | “Connect Collaborate — required for your AVSAR jobseeker account. Your professional profile stays private unless you choose to share it.” |
| Partial link | “One account connected. Finish connecting the other to use your Jobseeker Workspace.” |
| Provider outage | “We couldn't confirm this connection right now. You can keep browsing and try again later.” |
| Resume evidence | “Suggested from your CV — review before adding it to your application.” |
| Skill label | “Assessment record available from ERIS” only when actually attested |
| Uncertain eligibility | “We don't have enough information to confirm this requirement yet.” |
| External Apply | “You're leaving AVSAR for the organization's official application page. We may not receive application updates from that site.” |
| Draft saved | “Draft saved. You can finish later.” |
| Internal submit success | “Application submitted. Your receipt and submitted information are available in My Applications.” |
| Recruiter verification pending | “Your organization is under review. You can prepare drafts while we complete the checks.” |
| Listing awaiting review | “Submitted for approval. Your listing isn't public yet.” |
| Listing rejected | “This listing can't be published in its current form. Review the reason or request a new review.” |
| Sponsored label | “Sponsored — paid placement. Employer and listing review rules still apply.” |
| Candidate support | “This request is private and won't be shown on your public professional profile.” |
| No results | “No opportunities match those filters right now. Try a different keyword or clear a filter.” |
| No interviews | “You don't have a confirmed interview scheduled yet.” |
| Payment failure | “We couldn't confirm your payment. No new plan entitlements have been activated.” |

# 20. Implementation architecture and deployment

## 20.1 Proposed deployment boundary

AVSAR should be its own repository/deployable service at the proposed subdomain, connected to its own Neon Postgres logical database or strongly isolated cluster/database. A Next.js/TypeScript application deployed on Netlify is a possible choice given the broader ecosystem direction, **subject to actual runtime/preview verification**, while long-running ingestion/messaging jobs must use durable supported processing. The specific Netlify site, plan and workload limits must be audited before committing to architecture. Core/Collaborate/ERIS/Connect/Learn remain independent services and do not share writable databases with AVSAR.

## 20.2 Suggested application packages

- `app/(public)` — search, listings, categories, employer marketing, help.
- `app/(jobseeker)` — jobseeker dashboard, saved, applications, profile, alerts, support.
- `app/(employer)` — organization, jobs, applicants, interviews, billing, team.
- `app/(admin)` — verification, moderation, finance, support, audit, integrations.
- `src/modules/identity` — cross-app federation, entitlements, consent.
- `src/modules/opportunities` — catalog, review, source, freshness, search.
- `src/modules/applications` — submission, snapshots, statuses and messaging.
- `src/modules/organizations` — membership, verification, billing scopes.
- `src/modules/integrations` — typed adapters for Core, Collaborate, ERIS, Connect, Learn, EORA.
- `src/modules/fair-access` — accessibility and actual support programs.
- `src/modules/billing` — plans, webhooks, invoices, sponsorship.
- `src/modules/audit` — decision/event trails and operational safety.
- `src/shared` — common UI, types, validation, authentication/authorization, telemetry.

These are illustrative directories, not a mandate to overwrite existing repository structure if a canonical implementation is already present.

## 20.3 Non-negotiable engineering patterns

Typed validation at API boundaries; narrowly scoped data access; transactional or conditional state changes; outbox/idempotency for events and payment callbacks; migration-based schema management; explicit fixtures only in test environments; environment variables for provider configuration; independent preview/prod secrets and databases; feature flags for partial integrations; failure isolation; audit-safe admin changes; no direct production DB access from untrusted browser; provider outage simulation; test accounts for all three roles.

# 21. Detailed acceptance and regression test matrix

Each test must capture environment, fixture, actor, exact result and any defect ID. Expected outcomes below are **test definitions**, not execution claims.

| Test ID | Actor / feature | Scenario | Acceptance |
|---|---|---|---|
| T-001 | Visitor | Open homepage and search without login | Public results; no auth prompt |
| T-002 | Visitor | Open category and listing detail | Current public data and correct status |
| T-003 | Visitor | Click Apply while anonymous | Explicit two-account linking gate and return context |
| T-004 | Jobseeker | Start with no linked accounts | Core link then Collaborate link; no entitlement early |
| T-005 | Jobseeker | Core linked only | Cannot enter private workspace; clear Collaborate step |
| T-006 | Jobseeker | Collaborate linked only | Cannot enter private workspace; clear Core step |
| T-007 | Jobseeker | Both accounts linked | Jobseeker entitlement issued after server proof |
| T-008 | Jobseeker | Link different peoples' identities | Prevent incorrect association; secure recovery |
| T-009 | Jobseeker | Decline optional profile scope | Still use basic AVSAR after both account links |
| T-010 | Jobseeker | Collaborate profile private | No public professional exposure or surprise connections |
| T-011 | Jobseeker | Refresh/interrupt linking | Restore state safely; no duplicated users |
| T-012 | Jobseeker | Revoke one required link | No future private jobseeker actions; clear explanation |
| T-013 | Jobseeker | Core provider outage | Safe failure for link, public browse remains |
| T-014 | Jobseeker | Collaborate provider outage | Safe failure for link, public browse remains |
| T-015 | Jobseeker | Search and multi-filter | Correct query semantics, pagination and reset |
| T-016 | Jobseeker | Personalized and nonpersonalized search | Both available; explanation grounded |
| T-017 | Jobseeker | Missing skill evidence | “Unknown”; not false unqualified result |
| T-018 | Jobseeker | Save/unsave duplicate | Idempotent and persisted |
| T-019 | Jobseeker | Save expired opportunity | Correct expiry warning and state |
| T-020 | Jobseeker | Application draft autosave | Restored after reload and relogin |
| T-021 | Jobseeker | Preview Core/Collaborate data share | Correct exact employer-visible fields |
| T-022 | Jobseeker | Internal Apply | Server receipt, immutable snapshot, no duplicate |
| T-023 | Jobseeker | External Apply | Redirect tracked without false “applied” status |
| T-024 | Jobseeker | Self-report external Apply | Explicit self-reported attribution |
| T-025 | Jobseeker | Withdraw direct application | Authenticated update and audit |
| T-026 | Jobseeker | Access another candidate application | Forbidden; zero disclosed fields |
| T-027 | Jobseeker | Core record conflict | Review/correction, no overwrite |
| T-028 | Jobseeker | ERIS invite with consent | Correct role-relevant request, authentic source |
| T-029 | Jobseeker | ERIS outage | No false failure; reschedule/alternative |
| T-030 | Jobseeker | Share ERIS result | Authorized only, accurate source/trust label |
| T-031 | Jobseeker | Connect interview invitation | Timezones, participant scope and accepted status |
| T-032 | Jobseeker | Connect outage | Application status preserved, no fake meeting |
| T-033 | Jobseeker | Learn prep action | Real route/content; no fake course completion |
| T-034 | Jobseeker | Support/assistance request | Private; no employer access |
| T-035 | Jobseeker | Accessibility-only request | Usable without mandatory private account |
| T-036 | Jobseeker | Alerts disabled | No optional marketing messages; transactional as needed |
| T-037 | Recruiter | Signup unverified org | No public posting permission |
| T-038 | Recruiter | Org approved by admin | Authorized publishing review allowed |
| T-039 | Recruiter | Draft posting | Save and resume; no public listing |
| T-040 | Recruiter | Submit posting | Under review, not live |
| T-041 | Recruiter | Material edit live posting | Re-review required |
| T-042 | Recruiter | Basic posting quota exceeded | Clear plan limit without harming current applicants |
| T-043 | Recruiter | Attempt to see unrelated applications | Forbidden, no leakage |
| T-044 | Recruiter | Change actual application status | Audited, candidate notified appropriately |
| T-045 | Recruiter | Trigger bulk applicant export | Authorization, limits and audit required |
| T-046 | Recruiter | ERIS assessment request | Role relevant, authorized, proper state |
| T-047 | Recruiter | Schedule Connect interview | Genuine invitation, meeting scoped |
| T-048 | Recruiter | Invite team member | Seats, roles and org scope enforced |
| T-049 | Recruiter | Downgrade subscription | Transparent limits, no silent application deletion |
| T-050 | Recruiter | Payment webhook duplicate | One actual ledger/entitlement change |
| T-051 | Admin | Verify organization | Checklist, actor, date and reason recorded |
| T-052 | Admin | Reject organization | Transparent reasons, appeal workflow |
| T-053 | Admin | Approve listing | Correct approved version enters publish state |
| T-054 | Admin | Suspend suspicious listing | Apply blocked and search state promptly updated |
| T-055 | Admin | Verify badge on unverified org | Not shown |
| T-056 | Admin | Finance officer edits listings | Denied by role separation |
| T-057 | Admin | Moderator views assistance hardship record | Denied by restricted access |
| T-058 | Admin | Paid sponsor attempts bypass verification | Denied |
| T-059 | Admin | Alter important policy | Version/approval/rollback recorded |
| T-060 | Admin | Abuse report anonymous | Case created with safe receipt and routing |
| T-061 | Security | XSS/unsafe link in description | Rejected/sanitized with safe rendering |
| T-062 | Security | Cross-org ID enumeration | Not found/forbidden without content |
| T-063 | Security | Forged Core/Collaborate provider callback | Rejected; no entitlement |
| T-064 | Security | Forged ERIS/Connect webhook | Rejected; no fake evidence/meeting |
| T-065 | Security | Stolen/expired session | Access denied, safe login recovery |
| T-066 | Security | PII in server logs | Sensitive fields redacted |
| T-067 | Billing | Declined payment | No new paid entitlement |
| T-068 | Billing | Cancel plan | Correct end-of-term and invoice behavior |
| T-069 | UI | Desktop 1280×800 | No overflow; critical controls visible |
| T-070 | UI | Desktop 1440×900 | Search/sidebar/preview usable |
| T-071 | UI | Desktop 1920×1080 | Correct max width and whitespace |
| T-072 | A11y | Keyboard only application | Usable through submit, errors announced |
| T-073 | A11y | Screen reader listing details | Semantics, states, labels usable |
| T-074 | A11y | Reduced motion | Animations not required; motion reduced |
| T-075 | Reliability | Duplicate submit/retry | Idempotent; no double application |
| T-076 | Reliability | Queue provider failure | Correct error, safe retry, truthful status |
| T-077 | Data | Refresh/logout/relogin | Correct saved account and records restored |
| T-078 | Data | Consent revoked | Future optional sync stops; proper historic retention |
| T-079 | Search | Sponsored vs organic | Clear label, no false badge, normal results accessible |
| T-080 | Ops | Restore preview backup | Recovery exercise documented and successful |

## 21.1 Release acceptance gates

**G1 — Identity:** both mandatory linked accounts are proven for every active jobseeker, with secure linking and fallback.  
**G2 — Public marketplace:** verified public search, listings, categories, sources and safe external destinations.  
**G3 — Recruiter and verification:** org validation and admin-reviewed publishing enforce correct state.  
**G4 — Applications:** real direct submission, external distinction, ownership, history and draft persistence.  
**G5 — Dashboards:** Jobseeker, Recruiter and Admin primary routes/workflows pass browser tests with genuine data.  
**G6 — Governance:** permissions, reports, moderation, appeals, logging and privacy partition tests pass.  
**G7 — Monetization:** if payments launch, test real provider sandbox webhooks, plan entitlements, refunds/cancellation and invoice consistency.  
**G8 — Integrations:** actual required Core+Collaborate identity contracts tested; optional ERIS/Connect/Learn integrations enabled only when truly operational.  
**G9 — Accessibility:** critical journeys WCAG-audited and manual keyboard/screen reader checks conducted.  
**G10 — Deployment:** local unit/integration/E2E plus isolated deployed Preview success; authorized production DNS/cutover and rollback approval. No fabricated green status.

# 22. Project phases, dependencies and release sequence

## Phase 0 — Audit and contracts

Confirm existing Core, Collaborate, ERIS, Connect/Meet and Learn APIs; identity federation feasibility; directory naming; brand clearance; listing sources; initial employers; payment-provider options; privacy/legal constraints. Define prototype and test fixtures. **Gate:** signed interface contracts for Core and Collaborate mandatory identity linking before jobseeker workspace build.

## Phase 1 — Marketplace and trust foundation (P0)

Independent AVSAR app, own database, public landing/search/listing details, admin authentication, organization verification, admin-curated actual published listings, moderation and reporting, server-side authorization. Can launch a limited **public discovery preview** even before mandatory jobseeker linking is complete; cannot represent that as the full application platform. **Gate:** every public listing has real approved provenance.

## Phase 2 — Mandatory identity, jobseeker workspace and applications (P0)

Core + Collaborate link onboarding, entitlement, optional profile consent, saved jobs, drafts, direct/external application flows, submitted snapshot, application tracking and notifications. **Gate:** two-provider identity requirement never bypassed; new and returning user E2E passes.

## Phase 3 — Verified recruiter operations and B2B plans (P0/P1)

Recruiter onboarding and authority, company verified badge semantics, posting wizard, moderation loop, applicant pipeline, team roles, billing entitlements and invoicing after payment sandbox proof. **Gate:** paying cannot bypass moderation; app candidates not restricted by recruiter tier.

## Phase 4 — Ecosystem value layer (P1)

Core Person 360 read with granular consent, Collaborate selected portfolio sharing, ERIS assessments, Connect interviews, Learn preparation and EORA assistance, with independently tested adapters. **Gate:** each feature off by default until real provider contract/test proof exists; no invented cross-app status.

## Phase 5 — Fair-access programs, institutions and optimization (P1/P2)

Need-support center with actual programs, institutional placement workflows, transparent sponsored listing rules, advanced analytics, localization, accessible mobile refinement, measured search/matching optimizations. **Gate:** privacy impact review, fairness monitoring, support separation and truthful outcome reporting.

# 23. Risks, mitigations and unresolved product decisions

| Risk / decision | Consequence | Proposed mitigation / owner |
|---|---|---|
| Mandatory Core+Collaborate account requirement increases friction | Lower conversion; inaccessible if either product is down | Single guided linking journey, clear explanation, progress restore, honest service status; Product + Identity |
| Core/Collaborate identity federation APIs not implemented | Essential jobseeker gate impossible | Contract/POC in Phase 0; no fake “linked” state; Platform |
| Scarcity of real verified listings | Empty marketplace and poor retention | Admin-curated sources, employer pilots and freshness monitoring; Business Ops |
| Fraudulent employers and paid favoritism | Safety/trust and legal risk | Verification, moderation, separation from billing, appeals; Trust & Safety |
| Recruiters demand unrestricted candidate search | Privacy and user trust erosion | Applications-only default, explicit applicant share, consent; Product + Security |
| Sponsored result crowding | Fair-access concerns | Sponsored caps, labels, neutral sort, no false verification; Product + Governance |
| External application status unavailable | Misleading “under review” statuses | Mark redirects and self-report explicitly; Integrations |
| ERIS/Connect integration partially live | Fake verified records or missing interviews | Feature flag and strict attestation, degraded states; Platform |
| Assistance records exposed to recruiters | Serious privacy/fairness failure | Isolated data policies, audit and limited roles; Security |
| High OCR/API/meeting costs | Poor unit economics | Reuse existing verified profile records, asynchronous work, quotas and explicit B2B billing; Finance/Engineering |
| User-age/eligibility complexity | Unsafe or unlawful opportunities | Transparent age-eligible categories, policy/legal review; Legal/Product |
| Scope expansion to all industries immediately | Poor quality and long delivery | AI/ML-first, tech/early career, expandable schema; Product |
| Trademark availability for AVSAR | Rebrand risk | Formal registry, domain and conflict review before market launch; Legal/Brand |
| Payments compliance and tax invoicing | Financial/consumer risk | Sandbox trials, counsel/accounting review and processor reconciliation; Finance |
| Hosting/platform incompatibility | Failed deployed integrations | Preview load tests and cost checks before production; DevOps |

## 23.1 Explicit open decisions

1. **Single sign-on/federation:** Which verified OIDC/OAuth2 paths actually exist on Core and Collaborate? Who runs the consent server? Jobseeker activation cannot ship before this is proven.
2. **Linked account privacy:** Should Collaborate create a hidden private profile shell automatically after explicit consent, or require a separate user-managed completion step? This SRS requires an account, not automatic public visibility.
3. **Direct applications:** Which employers can receive in-platform submissions in MVP, vs using external source redirects?
4. **Public listing sources:** Which legally permitted ATS APIs, employer feeds and partners are available under acceptable terms?
5. **Employer KYC standard:** What documents and thresholds are proportionate for startups, universities, labs and individual grants?
6. **Payments:** Final provider, taxes, invoices, trials, cancellation and fee schedule need finance approval.
7. **Youth and eligibility:** What minimum age rules apply to each category/jurisdiction and which programs allow younger students?
8. **Data retention:** Final timeframes for jobseeker profiles, rejected CVs, employer data and evidence are pending legal/operational review.
9. **Default opportunities:** AI/ML and tech student-first; which additional industries and institutions launch next?
10. **Support funding:** Which real sponsored programs, mentors and financial-aid resources exist before advertising them?

# 24. Requirement traceability and change-management policy

Implementation planning must map each requirement ID to: user story, owning service, database entities, routes/UI components, test ID(s), privacy/security review, current implementation state and deploy evidence. Maintain one authoritative document; avoid duplicated “new versions” of the same dashboard without clear canonical routing. Any changes to required account linking, employer verification, application fee policy, sensitive data access, ERIS attestation or recruiter data-sharing require product/security sign-off and updated regression tests.

Recommended evidence labels in engineering reports: **NOT IMPLEMENTED**, **IN DEVELOPMENT**, **VERIFIED LOCALLY**, **VERIFIED ON PREVIEW**, **BLOCKED**, **PRODUCTION VERIFIED**. A compile or passing unit test alone shall never be reported as verified application behavior.

# 25. Glossary

| Term | Definition |
|---|---|
| AVSAR | Independent opportunity marketplace by AI Tathastu |
| Jobseeker entitlement | Authenticated AVSAR ability to save/apply/manage, requiring **both Core and Collaborate identity links** |
| Core | AI Tathastu central profile, goals, skills and Person 360 system |
| Collaborate | Independent professional profile, connection, messaging and collaboration application |
| ERIS | Independent assessment/examination platform with potentially shareable attested results |
| Connect / Meet | Independent authorized real-time meeting and interview platform |
| AI Learning | Independent AI/ML-focused learning and preparation product |
| EORA | AI guidance interface that uses permissioned available context |
| Listing approval | Human/admin-reviewed approval of a particular listing version, not hiring guarantee |
| Verified organization | Publisher review state describing checks actually completed |
| Source-backed skill | Skill assertion with a linked source; not automatically assessed proficiency |
| ERIS-assessed | A genuine authorized assessment record, not a universal skill guarantee |
| Direct application | Submitted to and received by AVSAR/participating employer within supported platform workflow |
| External application | Candidate redirected to original application destination; employer outcome unknown unless integrated |
| Sponsored listing | Paid visibility with mandatory disclosure and no verification/hiring priority advantage |
| Fair-access support | Optional, private guidance/assistance for users facing barriers; not a hidden hiring-rank attribute |
| Entitlement | Server-validated authorization for a role, product capability or commercial plan |
| Consent receipt | Audited record of who permitted which cross-product data access for which purpose |

---

**End of AVSAR by AI Tathastu SRS v1.0.**  
**Release position:** Product target specification; implementation and compliance verification remain outstanding.  
**Non-negotiable:** Every active AVSAR jobseeker must have validated linked **AI Tathastu Core and Collaborate accounts**, without requiring a public Collaborate profile, automatic private-data sharing or payment for ordinary applications.
