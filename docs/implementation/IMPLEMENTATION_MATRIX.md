# SRS implementation matrix

Status reflects code and executed evidence on 13 October 2026. `IMPLEMENTED_NOT_VERIFIED` means code exists but its database-backed behavior was not exercised against Neon. `PARTIAL` means only part of the stated requirement is coded. `BLOCKED_EXTERNAL_DEPENDENCY` means a provider contract/credential is necessary and unavailable. `NOT_IMPLEMENTED` is used for all other gaps. This matrix does not certify production readiness. Totals: BLOCKED_EXTERNAL_DEPENDENCY 46, IMPLEMENTED_AND_TESTED 1, IMPLEMENTED_NOT_VERIFIED 19, NOT_IMPLEMENTED 91, PARTIAL 57.

| SRS ID | Status | Requirement / current evidence |
|---|---|---|
| ADM-001 | PARTIAL | Home SHALL display assigned pending work with counts from live operational tables, not static demo values. Subset coded; see architecture/readiness report. |
| ADM-002 | NOT_IMPLEMENTED | High-risk verification/abuse cases SHALL be prioritized visibly and never mixed with promotional tasks. No complete workflow or verified test. |
| ADM-003 | PARTIAL | Every approval/rejection SHALL require authenticated actor, timestamp, reason code and relevant evidence reference. Subset coded; see architecture/readiness report. |
| ADM-004 | PARTIAL | Moderation decision SHALL not be delegated solely to a language model or unsupported score. Subset coded; see architecture/readiness report. |
| ADM-005 | NOT_IMPLEMENTED | High-risk operations (restore banned recruiter, broad export, override payment restrictions, global shutdown) SHALL r… No complete workflow or verified test. |
| ADM-006 | NOT_IMPLEMENTED | Finance metrics SHALL use actual payment processor records and reconciliation, not pageview-derived guesses. No complete workflow or verified test. |
| ADM-007 | PARTIAL | Admin users SHALL see only sections permitted by their role and organization/platform scope. Subset coded; see architecture/readiness report. |
| ADM-008 | PARTIAL | Admin action history SHALL be tamper-evident and protected from casual deletion. Subset coded; see architecture/readiness report. |
| ADM-009 | NOT_IMPLEMENTED | The platform SHALL support emergency disabling of compromised recruiter publishing, integration traffic and suspiciou… No complete workflow or verified test. |
| ADM-010 | NOT_IMPLEMENTED | Administrative bulk actions SHALL be limited to low-risk reversible changes or require explicit review/confirmation. No complete workflow or verified test. |
| ADM-011 | PARTIAL | Admin dashboard SHALL expose true integration health, incident status, event backlog and per-provider dependency. Subset coded; see architecture/readiness report. |
| ADM-012 | NOT_IMPLEMENTED | Support operators SHALL be able to resolve linking problems without impersonating jobseekers or seeing raw passwords. No complete workflow or verified test. |
| ADM-013 | NOT_IMPLEMENTED | Admin actions on sensitive assistance cases SHALL be restricted to designated program officers and excluded from norm… No complete workflow or verified test. |
| ADM-014 | NOT_IMPLEMENTED | Policy changes SHALL be versioned, reviewable and accompanied by effective date, impact and rollback. No complete workflow or verified test. |
| API-001 | PARTIAL | All private APIs SHALL enforce role, resource ownership, tenant scope and consent independent of UI. Subset coded; see architecture/readiness report. |
| API-002 | BLOCKED_EXTERNAL_DEPENDENCY | OAuth/code exchanges and inbound webhooks SHALL validate issuer, audience, expiry, replay, signature and state. External provider contract/credentials absent. |
| API-003 | IMPLEMENTED_NOT_VERIFIED | Writes SHALL use idempotency where duplicate submission is harmful. Code present; no Neon runtime test. |
| API-004 | PARTIAL | Pagination SHALL avoid cross-tenant leaks and stable-sort anomalies. Subset coded; see architecture/readiness report. |
| API-005 | PARTIAL | API errors SHALL be safe and actionable, avoiding secrets/private records in responses. Subset coded; see architecture/readiness report. |
| API-006 | NOT_IMPLEMENTED | Each integration SHALL have contract tests and deploy-time compatibility checks. No complete workflow or verified test. |
| API-007 | PARTIAL | Client SHALL distinguish accepted request from completed asynchronous action. Subset coded; see architecture/readiness report. |
| API-008 | PARTIAL | Private cross-product resources SHALL not be transferred through unprotected redirect URLs. Subset coded; see architecture/readiness report. |
| API-009 | BLOCKED_EXTERNAL_DEPENDENCY | Consent revocation SHALL prevent future source fetches and subscriptions after a defined grace/retry window. External provider contract/credentials absent. |
| API-010 | PARTIAL | Health endpoints SHALL disclose generic service status publicly and detailed provider diagnostics only to authorized … Subset coded; see architecture/readiness report. |
| BILL-001 | NOT_IMPLEMENTED | Billing SHALL use an approved payment provider; client redirects alone SHALL not mark payment successful. No complete workflow or verified test. |
| BILL-002 | NOT_IMPLEMENTED | Webhook events SHALL be authenticated, replay-safe, idempotent and mapped to immutable accounting records. No complete workflow or verified test. |
| BILL-003 | PARTIAL | Paid employer entitlements SHALL be enforced server-side: active listings, seats, candidate-management tools and purc… Subset coded; see architecture/readiness report. |
| BILL-004 | NOT_IMPLEMENTED | A plan downgrade SHALL not silently discard applications or hide already submitted candidate records without lawful r… No complete workflow or verified test. |
| BILL-005 | NOT_IMPLEMENTED | Cancellation and refund policies SHALL be clearly accessible and actionable. No complete workflow or verified test. |
| BILL-006 | NOT_IMPLEMENTED | Failure to pay SHALL follow a grace/remediation policy, preserving transparency and legitimate candidate status. No complete workflow or verified test. |
| BILL-007 | NOT_IMPLEMENTED | Recruiters SHALL see quota consumption, billing cycles, taxes and any additional charges before confirmation. No complete workflow or verified test. |
| BILL-008 | NOT_IMPLEMENTED | Sponsorship SHALL be visually distinguished from organic listing relevance; sponsored inventory must remain admin-app… No complete workflow or verified test. |
| BILL-009 | PARTIAL | Payment SHALL not change organization verification decision, jobseeker evidence trust labels or hiring result. Subset coded; see architecture/readiness report. |
| BILL-010 | PARTIAL | Basic jobseeker applications SHALL not require payment, paid subscription or platform-specific assessment purchase. Subset coded; see architecture/readiness report. |
| BILL-011 | NOT_IMPLEMENTED | ERIS and Connect commercial add-ons SHALL bill the employer/institution according to explicit usage agreements, not s… No complete workflow or verified test. |
| BILL-012 | NOT_IMPLEMENTED | Revenue and refund reports SHALL reconcile to actual processor transactions and credit notes. No complete workflow or verified test. |
| BILL-013 | NOT_IMPLEMENTED | Account suspension due to serious fraud risk SHALL have clear impact on active subscriptions and appeal/refund treatm… No complete workflow or verified test. |
| COLL-001 | BLOCKED_EXTERNAL_DEPENDENCY | Collaborate SHALL provide account-link proof; separately authorized professional card/portfolio share is selectable p… External provider contract/credentials absent. |
| COLL-002 | BLOCKED_EXTERNAL_DEPENDENCY | AVSAR SHALL not create public recruiter connections, messages or visible profiles without user action and actual Coll… External provider contract/credentials absent. |
| DATA-001 | IMPLEMENTED_NOT_VERIFIED | Provider external subjects SHALL have scoped unique constraints and cannot be linked to conflicting active users with… Code present; no Neon runtime test. |
| DATA-002 | PARTIAL | Jobseeker access policy SHALL derive from two active verified links and local entitlement, not only a frontend boolean. Subset coded; see architecture/readiness report. |
| DATA-003 | IMPLEMENTED_NOT_VERIFIED | Listing publishing SHALL be transactionally or conditionally coupled to its approved version and moderation status. Code present; no Neon runtime test. |
| DATA-004 | IMPLEMENTED_NOT_VERIFIED | An application SHALL retain an immutable submitted snapshot and an append-only sequence of later status events. Code present; no Neon runtime test. |
| DATA-005 | PARTIAL | Sensitive support/assistance records SHALL use separate access policies and not be embedded in ordinary applicant pro… Subset coded; see architecture/readiness report. |
| DATA-006 | NOT_IMPLEMENTED | Object files and CVs SHALL use private storage, short-lived authorized access and declared retention; never public st… No complete workflow or verified test. |
| DATA-007 | PARTIAL | Consent grants, event deliveries and billing webhooks SHALL use idempotency keys and uniqueness where appropriate. Subset coded; see architecture/readiness report. |
| DATA-008 | NOT_IMPLEMENTED | Soft-deletion, anonymization, data export and deletion requests SHALL respect legitimate retention/legal holds and cr… No complete workflow or verified test. |
| DATA-009 | NOT_IMPLEMENTED | Deleting an AVSAR link SHALL not directly delete Core or Collaborate records; send separate authorized requests where… No complete workflow or verified test. |
| DATA-010 | IMPLEMENTED_NOT_VERIFIED | All critical state transitions SHALL preserve traceability to actor, source and time. Code present; no Neon runtime test. |
| DET-001 | IMPLEMENTED_NOT_VERIFIED | A listing SHALL expose publisher, application path, actual requirements and the difference between verified vs self-d… Code present; no Neon runtime test. |
| DET-002 | PARTIAL | “Apply” SHALL inspect listing status and jobseeker mandatory-linked-account entitlement. Subset coded; see architecture/readiness report. |
| DET-003 | PARTIAL | Hard eligibility rules SHALL not be silently expanded by AI predictions or unsupported personal-attribute inferences. Subset coded; see architecture/readiness report. |
| DET-004 | IMPLEMENTED_NOT_VERIFIED | User SHALL be able to report inaccurate or suspicious listing information without being forced to register. Code present; no Neon runtime test. |
| DET-005 | NOT_IMPLEMENTED | Saved application draft context SHALL survive the Core+Collaborate account-link journey where safely possible. No complete workflow or verified test. |
| DET-006 | NOT_IMPLEMENTED | Unavailable opportunities SHALL show truthful expired/removed states and approved alternatives. No complete workflow or verified test. |
| DISC-001 | IMPLEMENTED_NOT_VERIFIED | Public keyword and filter search SHALL work without creating a user account. Code present; no Neon runtime test. |
| DISC-002 | IMPLEMENTED_NOT_VERIFIED | Filtering SHALL use approved listing data with stable pagination/cursors and consistently ordered results. Code present; no Neon runtime test. |
| DISC-003 | PARTIAL | Filter choices SHALL survive navigation; empty states SHALL suggest resets without claiming no jobs exist globally. URL state and empty reset coded; selection-to-detail restoration unverified. |
| DISC-004 | NOT_IMPLEMENTED | Sponsored content SHALL be clearly labeled, cap-controlled and separated from the base relevance order; cannot impers… No complete workflow or verified test. |
| DISC-005 | IMPLEMENTED_NOT_VERIFIED | Closed, suspended or expired listings SHALL not display as new active openings; deep-linked historical pages may expl… Code present; no Neon runtime test. |
| DISC-006 | NOT_IMPLEMENTED | Relevance explanation SHALL identify actual skill/title/location/goal signals, distinguishing known requirements from… No complete workflow or verified test. |
| DISC-007 | IMPLEMENTED_NOT_VERIFIED | A user SHALL have an option to see all eligible public listings without personalization. Code present; no Neon runtime test. |
| DISC-008 | PARTIAL | Category filter/compensation/eligibility fields SHALL clearly distinguish “not specified” from zero/none. Subset coded; see architecture/readiness report. |
| EORA-001 | BLOCKED_EXTERNAL_DEPENDENCY | EORA SHALL receive only scoped, necessary context and clear provenance flags. External provider contract/credentials absent. |
| EORA-002 | BLOCKED_EXTERNAL_DEPENDENCY | EORA SHALL help interpret requirements and suggest actual available next steps, not promise job outcomes or invented … External provider contract/credentials absent. |
| EORA-003 | BLOCKED_EXTERNAL_DEPENDENCY | Routine filters, deadlines, eligibility and status messages SHALL use deterministic code/data where possible to contr… External provider contract/credentials absent. |
| ERIS-001 | BLOCKED_EXTERNAL_DEPENDENCY | Recruiter may request only existing supported, role-relevant assessments after approval and disclosure. External provider contract/credentials absent. |
| ERIS-002 | BLOCKED_EXTERNAL_DEPENDENCY | Candidate SHALL receive assessment purpose, test conditions, expected data access, accessibility path and deadline pr… External provider contract/credentials absent. |
| ERIS-003 | BLOCKED_EXTERNAL_DEPENDENCY | AVSAR SHALL validate ERIS-signed completion/result evidence against assessment ID, candidate and authorization scope. External provider contract/credentials absent. |
| ERIS-004 | BLOCKED_EXTERNAL_DEPENDENCY | “Verified skill” badge SHALL distinguish assessment-attested outcome from broader real-world proficiency or instituti… External provider contract/credentials absent. |
| ERIS-005 | BLOCKED_EXTERNAL_DEPENDENCY | No recruiter shall infer an unrecorded ERIS grade or silently auto-reject on unreviewed, opaque risk/anomaly signals. External provider contract/credentials absent. |
| ERIS-006 | BLOCKED_EXTERNAL_DEPENDENCY | Assessment results shared with employer SHALL be limited to consented, purpose-specific summary/details as policy all… External provider contract/credentials absent. |
| ERIS-007 | BLOCKED_EXTERNAL_DEPENDENCY | If ERIS is unavailable, applicant status SHALL remain accurate and employer can choose permitted reschedule/alternati… External provider contract/credentials absent. |
| FAIR-001 | IMPLEMENTED_NOT_VERIFIED | Platform SHALL provide public, anonymous searching and listing details, regardless of CV completeness or Core/Collabo… Code present; no Neon runtime test. |
| FAIR-002 | PARTIAL | A mandatory account link SHALL not require making Collaborate public, sharing full CV or paying fees. Subset coded; see architecture/readiness report. |
| FAIR-003 | NOT_IMPLEMENTED | Eligibility decisions SHALL use stated lawful criteria and declared evidence; missing evidence SHALL be “unknown”, no… No complete workflow or verified test. |
| FAIR-004 | IMPLEMENTED_NOT_VERIFIED | Public ranking SHALL offer a non-personalized sort so candidates can explore broadly. Code present; no Neon runtime test. |
| FAIR-005 | NOT_IMPLEMENTED | Need-related personal details SHALL be collected only when explicitly requested for a genuine support program and sep… No complete workflow or verified test. |
| FAIR-006 | NOT_IMPLEMENTED | Financially constrained students may receive available support services or scholarship discovery; this SHALL NOT secr… No complete workflow or verified test. |
| FAIR-007 | NOT_IMPLEMENTED | Support applications SHALL support clear decision reasons, appeals and retention limits. No complete workflow or verified test. |
| FAIR-008 | IMPLEMENTED_NOT_VERIFIED | Accessibility requests SHALL be accepted even when the user cannot complete ordinary sign-in or form workflows. Code present; no Neon runtime test. |
| FAIR-009 | PARTIAL | No system SHALL rank a candidate based on unconsented hardship, popularity or private-network size. Subset coded; see architecture/readiness report. |
| FAIR-010 | NOT_IMPLEMENTED | Users SHALL be able to correct incorrect eligibility/skill labels and identify source records. No complete workflow or verified test. |
| FAIR-011 | PARTIAL | Candidate-facing AI explanations SHALL be non-authoritative guidance; final legal eligibility and hiring remain under… Subset coded; see architecture/readiness report. |
| FAIR-012 | NOT_IMPLEMENTED | Recruiters SHALL be offered appropriate accessible alternative assessment/interview paths where required by policy an… No complete workflow or verified test. |
| IAM-001 | PARTIAL | Every write and confidential read SHALL use server-validated account ownership and resource-level authorization; fron… Subset coded; see architecture/readiness report. |
| IAM-002 | IMPLEMENTED_NOT_VERIFIED | Roles SHALL be assigned only through authenticated, approved role provisioning, not user-controlled signup fields. Code present; no Neon runtime test. |
| IAM-003 | IMPLEMENTED_NOT_VERIFIED | Recruiter access SHALL be scoped to a verified organization and the listings/applicants it owns. Code present; no Neon runtime test. |
| IAM-004 | PARTIAL | A recruiter SHALL not view full student profiles, private Core or Collaborate data, financial hardship information, E… Subset coded; see architecture/readiness report. |
| IAM-005 | PARTIAL | Admin privileges SHALL be separated by operational duty; sensitive export, access elevation and irreversible restrict… Subset coded; see architecture/readiness report. |
| IAM-006 | NOT_IMPLEMENTED | Organizational users SHALL be immediately deauthorized on seat removal, offboarding, subscription restriction (where … No complete workflow or verified test. |
| IAM-007 | PARTIAL | Admin actions SHALL carry actor, timestamp, affected resource, before/after policy-relevant state, reason and immutab… Subset coded; see architecture/readiness report. |
| IAM-008 | NOT_IMPLEMENTED | Deletion, export, organization membership and role changes SHALL not bypass active privacy or legal hold obligations. No complete workflow or verified test. |
| ID-001 | PARTIAL | System SHALL allow anonymous viewing of public opportunity lists and details. Subset coded; see architecture/readiness report. |
| ID-002 | BLOCKED_EXTERNAL_DEPENDENCY | System SHALL require validated Core and Collaborate identities before issuing jobseeker entitlement. External provider contract/credentials absent. |
| ID-003 | BLOCKED_EXTERNAL_DEPENDENCY | AVSAR SHALL verify provider tokens server-side, using supported OAuth2/OIDC or equivalent audited federation; never t… External provider contract/credentials absent. |
| ID-004 | BLOCKED_EXTERNAL_DEPENDENCY | Each cross-app identity relation SHALL use stable pairwise IDs, issuer, subject, authorization timestamp and status, … External provider contract/credentials absent. |
| ID-005 | BLOCKED_EXTERNAL_DEPENDENCY | AVSAR SHALL separately request minimum scopes for Core and Collaborate; read-only account presence is different from … External provider contract/credentials absent. |
| ID-006 | BLOCKED_EXTERNAL_DEPENDENCY | User SHALL be able to preview and approve any application-specific profile/evidence share. External provider contract/credentials absent. |
| ID-007 | BLOCKED_EXTERNAL_DEPENDENCY | Incomplete linking SHALL not lose search filters, chosen listing, draft application or manual entries, subject to saf… External provider contract/credentials absent. |
| ID-008 | BLOCKED_EXTERNAL_DEPENDENCY | Creation/linking SHALL be retry-safe and not duplicate identities after network failures or refresh. External provider contract/credentials absent. |
| ID-009 | BLOCKED_EXTERNAL_DEPENDENCY | Users SHALL be able to manage and revoke nonessential data scopes; revocation of a mandatory identity link SHALL deac… External provider contract/credentials absent. |
| ID-010 | BLOCKED_EXTERNAL_DEPENDENCY | Previously submitted employer-visible application snapshots SHALL follow disclosed retention rules; revoking a link m… External provider contract/credentials absent. |
| ID-011 | BLOCKED_EXTERNAL_DEPENDENCY | Session exchange SHALL never put credentials, resume bytes or access tokens in URL query parameters; use short-lived … External provider contract/credentials absent. |
| ID-012 | BLOCKED_EXTERNAL_DEPENDENCY | Core and Collaborate provider outages SHALL fail closed for new entitlement checks but preserve public browse and sho… External provider contract/credentials absent. |
| ID-013 | BLOCKED_EXTERNAL_DEPENDENCY | Account email change, provider account deletion, mistaken link and duplicate-link conflict SHALL have secure recovery… External provider contract/credentials absent. |
| ID-014 | BLOCKED_EXTERNAL_DEPENDENCY | The system SHALL not require a public Collaborate profile or accepting unwanted recruiter connections to satisfy the … External provider contract/credentials absent. |
| ID-015 | BLOCKED_EXTERNAL_DEPENDENCY | A normal jobseeker with both verified links SHALL enter the workspace without repeating a full Core onboarding unless… External provider contract/credentials absent. |
| ID-016 | PARTIAL | Employer and Admin identity flows SHALL remain separate from the jobseeker federation requirement. Subset coded; see architecture/readiness report. |
| ID-017 | NOT_IMPLEMENTED | Underage individuals SHALL be prevented from applying to listings for which published law/eligibility makes them inel… No complete workflow or verified test. |
| INT-001 | BLOCKED_EXTERNAL_DEPENDENCY | AVSAR SHALL verify both linked account identities for jobseeker entitlement. External provider contract/credentials absent. |
| INT-002 | BLOCKED_EXTERNAL_DEPENDENCY | Core and Collaborate SHALL not be assumed to share sessions; AVSAR SHALL implement an explicit approved federation path. External provider contract/credentials absent. |
| INT-003 | BLOCKED_EXTERNAL_DEPENDENCY | A verified Core/Collaborate account presence proof SHALL be sufficient to satisfy mandatory account linking; optional… External provider contract/credentials absent. |
| INT-004 | BLOCKED_EXTERNAL_DEPENDENCY | Required identity scopes and optional content scopes SHALL be distinguishable in the consent UI and access policy. External provider contract/credentials absent. |
| INT-005 | BLOCKED_EXTERNAL_DEPENDENCY | User may decline optional import of Core education/projects or public Collaborate profile and still use basic AVSAR j… External provider contract/credentials absent. |
| INT-006 | BLOCKED_EXTERNAL_DEPENDENCY | Server SHALL store authorization receipts, effective scopes, issuer, expiration and refresh/revocation state. External provider contract/credentials absent. |
| INT-007 | BLOCKED_EXTERNAL_DEPENDENCY | Incoming event and response SHALL be cryptographically/authentically validated and schema-checked. External provider contract/credentials absent. |
| INT-008 | IMPLEMENTED_NOT_VERIFIED | No service may write directly into another product's authoritative person or project tables. Code present; no Neon runtime test. |
| INT-009 | BLOCKED_EXTERNAL_DEPENDENCY | User profile sync SHALL support conflicts, field origin, correction and removal/revocation policies. External provider contract/credentials absent. |
| INT-010 | PARTIAL | Service outage SHALL produce truthful degraded status, not silent mock completion. Subset coded; see architecture/readiness report. |
| LAND-001 | IMPLEMENTED_AND_TESTED | Hero SHALL not require login before a search. Public browser interaction observed. |
| LAND-002 | IMPLEMENTED_NOT_VERIFIED | Every featured card SHALL be backed by a currently publishable listing ID; no invented employer logos, salaries or ap… Code present; no Neon runtime test. |
| LAND-003 | PARTIAL | Public “Verified” labeling SHALL disclose its exact scope; no placement guarantee. Subset coded; see architecture/readiness report. |
| LAND-004 | PARTIAL | Jobseeker account CTA SHALL explain that Core and Collaborate linked accounts are required for workspace and applicat… Subset coded; see architecture/readiness report. |
| LAND-005 | PARTIAL | Recruiter CTA SHALL explain organization verification is required before publishing. Subset coded; see architecture/readiness report. |
| LAND-006 | PARTIAL | Main navigation SHALL expose Jobs, Internships, Research & More, Companies, For Employers, Sign In / My Dashboard. Subset coded; see architecture/readiness report. |
| LAND-007 | PARTIAL | Marketing stats/testimonials SHALL appear only after evidence and publication consent exist. Subset coded; see architecture/readiness report. |
| LEARN-001 | BLOCKED_EXTERNAL_DEPENDENCY | Opportunity requirements MAY map to existing published AI Learning modules in the user's available catalog. External provider contract/credentials absent. |
| LEARN-002 | BLOCKED_EXTERNAL_DEPENDENCY | AVSAR SHALL not claim course completion based solely on opening the course link. External provider contract/credentials absent. |
| LEARN-003 | BLOCKED_EXTERNAL_DEPENDENCY | Preparation suggestions SHALL be optional and not gate applications. External provider contract/credentials absent. |
| MATCH-001 | NOT_IMPLEMENTED | No model shall produce automatic hiring decisions, CV rejection or disqualification from inferred psychological, fina… No complete workflow or verified test. |
| MATCH-002 | NOT_IMPLEMENTED | Jobseeker may view why each opportunity was recommended using comprehensible reasons derived from recorded, authorize… No complete workflow or verified test. |
| MATCH-003 | NOT_IMPLEMENTED | Match signals SHALL distinguish confirmed, self-reported, assessment-backed and unknown skill evidence. No complete workflow or verified test. |
| MATCH-004 | NOT_IMPLEMENTED | Missing evidence SHALL NOT be converted into a negative proficiency value by default. No complete workflow or verified test. |
| MATCH-005 | NOT_IMPLEMENTED | Hard eligibility SHALL derive from published legal and employer requirements, not invented AI judgments. No complete workflow or verified test. |
| MATCH-006 | NOT_IMPLEMENTED | Users SHALL be able to disable personalization and browse a neutral listing order with the same public inventory. No complete workflow or verified test. |
| MATCH-007 | NOT_IMPLEMENTED | Recommendation cache SHALL be invalidated on new approved listing, meaningful user goal change, job closure or consen… No complete workflow or verified test. |
| MATCH-008 | NOT_IMPLEMENTED | No financial hardship attributes shall be read by ordinary recommendation or employer candidate-ranking pipelines. No complete workflow or verified test. |
| MATCH-009 | NOT_IMPLEMENTED | Sponsorship SHALL be labeled, limited and not buy shortlist/hiring priority. No complete workflow or verified test. |
| MATCH-010 | NOT_IMPLEMENTED | Relevance calculations SHOULD be deterministic/reproducible for a fixed model version, listing dataset, user-approved… No complete workflow or verified test. |
| MATCH-011 | NOT_IMPLEMENTED | Recommendations SHALL expose useful empty/unavailable states; no need to fabricate listings. No complete workflow or verified test. |
| MATCH-012 | NOT_IMPLEMENTED | Recommendation experiments SHALL be controlled by privacy-preserving testing, measuring legitimate usefulness and dis… No complete workflow or verified test. |
| MEET-001 | BLOCKED_EXTERNAL_DEPENDENCY | Authorized recruiter may request an interview slot for a specific submitted application. External provider contract/credentials absent. |
| MEET-002 | BLOCKED_EXTERNAL_DEPENDENCY | Invitation SHALL record proposed times, timezones, accepted slot, authorized participants and any accessibility instr… External provider contract/credentials absent. |
| MEET-003 | BLOCKED_EXTERNAL_DEPENDENCY | Connect SHALL issue short-lived, participant-scoped meeting authorization, not public permanent links. External provider contract/credentials absent. |
| MEET-004 | BLOCKED_EXTERNAL_DEPENDENCY | Invitation status (proposed, accepted, rescheduled, cancelled) SHALL be distinct from meeting completion. External provider contract/credentials absent. |
| MEET-005 | BLOCKED_EXTERNAL_DEPENDENCY | AVSAR SHALL update “interview completed” only from supported attested events or transparent authorized manual entry. External provider contract/credentials absent. |
| MEET-006 | BLOCKED_EXTERNAL_DEPENDENCY | Recording, transcription, analysis and retention SHALL be separately disclosed and consented where required; no cover… External provider contract/credentials absent. |
| MEET-007 | BLOCKED_EXTERNAL_DEPENDENCY | Connect outage SHALL preserve application state and permit reschedule/manual approved fallback. External provider contract/credentials absent. |
| NFR-001 | NOT_IMPLEMENTED | Public availability No complete workflow or verified test. |
| NFR-002 | NOT_IMPLEMENTED | User-perceived search No complete workflow or verified test. |
| NFR-003 | NOT_IMPLEMENTED | Listing detail No complete workflow or verified test. |
| NFR-004 | PARTIAL | Desktop UI Subset coded; see architecture/readiness report. |
| NFR-005 | PARTIAL | Accessibility Subset coded; see architecture/readiness report. |
| NFR-006 | PARTIAL | Forms and drafts Subset coded; see architecture/readiness report. |
| NFR-007 | PARTIAL | Publication consistency Subset coded; see architecture/readiness report. |
| NFR-008 | PARTIAL | Account federation Subset coded; see architecture/readiness report. |
| NFR-009 | NOT_IMPLEMENTED | Sensitive operations No complete workflow or verified test. |
| NFR-010 | PARTIAL | Data isolation Subset coded; see architecture/readiness report. |
| NFR-011 | PARTIAL | Notification reliability Subset coded; see architecture/readiness report. |
| NFR-012 | NOT_IMPLEMENTED | Observability No complete workflow or verified test. |
| NFR-013 | NOT_IMPLEMENTED | Backup/recovery No complete workflow or verified test. |
| NFR-014 | NOT_IMPLEMENTED | Security updates No complete workflow or verified test. |
| NFR-015 | NOT_IMPLEMENTED | Localization No complete workflow or verified test. |
| NFR-016 | NOT_IMPLEMENTED | Data lifecycle No complete workflow or verified test. |
| NFR-017 | NOT_IMPLEMENTED | UX performance No complete workflow or verified test. |
| NFR-018 | PARTIAL | Graceful degradation Subset coded; see architecture/readiness report. |
| NFR-019 | PARTIAL | Mobile support Subset coded; see architecture/readiness report. |
| NFR-020 | NOT_IMPLEMENTED | Cost controls No complete workflow or verified test. |
| NOT-001 | NOT_IMPLEMENTED | Notification settings SHALL expose channel, category and digest frequency with reliable opt-out for nonessential mess… No complete workflow or verified test. |
| NOT-002 | NOT_IMPLEMENTED | Message templates SHALL contain factual status and safe deep links, not raw tokens or private CV excerpts. No complete workflow or verified test. |
| NOT-003 | NOT_IMPLEMENTED | Notification delivery SHALL be idempotent and store attempts/outcomes; duplicate events must not repeatedly spam a ca… No complete workflow or verified test. |
| NOT-004 | NOT_IMPLEMENTED | A “deadline soon” prompt SHALL use an actual source-reported timestamp and timezone. No complete workflow or verified test. |
| NOT-005 | NOT_IMPLEMENTED | Recruiter messaging SHALL be limited to legitimate applications or approved explicit contact channels and have anti-s… No complete workflow or verified test. |
| NOT-006 | NOT_IMPLEMENTED | Email and in-app messages SHALL distinguish platform statements from employer-provided text. No complete workflow or verified test. |
| NOT-007 | NOT_IMPLEMENTED | Candidate SHALL not be notified of fake profile views, false hiring probabilities or fabricated scarcity. No complete workflow or verified test. |
| NOT-008 | NOT_IMPLEMENTED | Meeting invites SHALL include timezone, format, participant information and rescheduling channel. No complete workflow or verified test. |
| NOT-009 | NOT_IMPLEMENTED | Users SHALL receive notices if an opportunity they applied to is suspended for safety, consistent with investigation … No complete workflow or verified test. |
| NOT-010 | NOT_IMPLEMENTED | Accessibility or legal-eligibility notices SHALL not be hidden behind marketing popups or paywalls. No complete workflow or verified test. |
| PRIV-001 | PARTIAL | Collect the minimum necessary personal information; identify collection purpose and retention category. Subset coded; see architecture/readiness report. |
| PRIV-002 | NOT_IMPLEMENTED | Account linkage SHALL NOT imply blanket consent to import all Core/Collaborate data. No complete workflow or verified test. |
| PRIV-003 | PARTIAL | Candidate shall be able to preview submitted employer-visible data before direct application. Subset coded; see architecture/readiness report. |
| PRIV-004 | NOT_IMPLEMENTED | Consent withdrawal SHALL immediately block future elective sync, with clear caveats for existing lawful application s… No complete workflow or verified test. |
| PRIV-005 | NOT_IMPLEMENTED | Support-related personal circumstances and accommodations SHALL be separately access-controlled and not supplied to r… No complete workflow or verified test. |
| PRIV-006 | NOT_IMPLEMENTED | User-facing privacy controls SHALL explain public profile, shared application snapshot and private workspace as disti… No complete workflow or verified test. |
| PRIV-007 | NOT_IMPLEMENTED | Provide export, correction, objection/complaint and deletion request pathways consistent with applicable law and rete… No complete workflow or verified test. |
| PRIV-008 | NOT_IMPLEMENTED | Sensitive data export SHALL require least privilege, audit and appropriate secure delivery. No complete workflow or verified test. |
| PRIV-009 | NOT_IMPLEMENTED | Third-party data processors, cross-border transfers, payment processing and data retention SHALL be documented before… No complete workflow or verified test. |
| PRIV-010 | NOT_IMPLEMENTED | Candidate ages and legal eligibility SHALL be handled with data minimization and applicable safeguards; do not expose… No complete workflow or verified test. |
| PUB-001 | PARTIAL | Public pages SHALL have usable permanent URLs, SEO metadata and correct canonical tags without exposing private records. Subset coded; see architecture/readiness report. |
| PUB-002 | PARTIAL | Public forms SHALL rate-limit abuse and not require login for fraud/accessibility reports. Subset coded; see architecture/readiness report. |
| PUB-003 | IMPLEMENTED_NOT_VERIFIED | Public counts and statistics SHALL come from permissioned, current aggregate data, never fabricated seed marketing me… Code present; no Neon runtime test. |
| SAFE-001 | NOT_IMPLEMENTED | Applicant SHALL have a pathway to report recruitment payment demands, impersonation, harassment, unsafe interview inv… No complete workflow or verified test. |
| SAFE-002 | NOT_IMPLEMENTED | Do not offer illegitimate age-restricted opportunities as actionable to ineligible minors. No complete workflow or verified test. |
| SAFE-003 | NOT_IMPLEMENTED | No automatic psychologically sensitive personality/emotion scoring from Connect calls. No complete workflow or verified test. |
| SAFE-004 | NOT_IMPLEMENTED | No sale of student profile data or financial-need targeting data to recruiters/advertisers. No complete workflow or verified test. |
| SAFE-005 | NOT_IMPLEMENTED | Admin/Recruiter privileged screens SHALL not display data beyond job-related minimum necessity. No complete workflow or verified test. |
| SAFE-006 | NOT_IMPLEMENTED | Recruiter-initiated ERIS assessments must be role relevant, appropriately accommodated and transparently disclosed. No complete workflow or verified test. |
| SAFE-007 | NOT_IMPLEMENTED | Appeals and human correction available for materially consequential wrong data or restrictions. No complete workflow or verified test. |
| SEC-001 | PARTIAL | Protect all sessions with supported secure, HttpOnly, SameSite cookies and robust CSRF protections for state-changing… Subset coded; see architecture/readiness report. |
| SEC-002 | NOT_IMPLEMENTED | Use MFA/step-up for Admin and high-risk recruiter financial/organization operations. No complete workflow or verified test. |
| SEC-003 | PARTIAL | Validate every untrusted string, URL, document and external service payload; mitigate XSS, SSRF, injection and unsafe… Subset coded; see architecture/readiness report. |
| SEC-004 | NOT_IMPLEMENTED | File uploads SHALL validate content type, signature, size and ownership and use safe private storage; malware scannin… No complete workflow or verified test. |
| SEC-005 | NOT_IMPLEMENTED | Secrets, tokens, CV contents, raw assessment responses and financial hardship SHALL NOT be logged. No complete workflow or verified test. |
| SEC-006 | PARTIAL | Protect against automated abuse through per-endpoint rate limits, actor-aware quotas and human-readable recovery. Subset coded; see architecture/readiness report. |
| SEC-007 | PARTIAL | Enforce server-side tenant isolation across recruiters, applicants and organizations, with database security policies… Subset coded; see architecture/readiness report. |
| SEC-008 | NOT_IMPLEMENTED | Encrypt confidential data in transit and at rest using established provider mechanisms, with secret rotation and acce… No complete workflow or verified test. |
| SEC-009 | NOT_IMPLEMENTED | Integrations SHALL use narrowly scoped service credentials and explicit revocation/rotation procedures. No complete workflow or verified test. |
| SEC-010 | PARTIAL | Critical admin operations and exports SHALL be fully audited, with anomaly alerting. Subset coded; see architecture/readiness report. |
| SEC-011 | NOT_IMPLEMENTED | Passwords, if AVSAR ever stores them, SHALL use a modern established password hashing design and must not be shared a… No complete workflow or verified test. |
| SEC-012 | PARTIAL | Dependency updates, SAST/dependency scans, regression tests and safe deployment review SHALL gate production. Subset coded; see architecture/readiness report. |
| SEC-013 | PARTIAL | Public listing URLs SHALL be checked against phishing/unsafe destination indicators without claiming they are univers… Subset coded; see architecture/readiness report. |
| SEC-014 | NOT_IMPLEMENTED | Candidate messaging SHALL have reporting, blocking/muting, anti-harassment and rate-limit pathways. No complete workflow or verified test. |
| SEC-015 | NOT_IMPLEMENTED | A compromised external provider shall not receive elevated Core/Collaborate or AVSAR token privileges. No complete workflow or verified test. |
