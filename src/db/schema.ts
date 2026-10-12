import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
const id = () => uuid("id").defaultRandom().primaryKey();
const created = () =>
  timestamp("created_at", { withTimezone: true }).defaultNow().notNull();
export const users = pgTable("avsar_users", {
  id: id(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("recruiter"),
  status: text("status").notNull().default("active"),
  createdAt: created(),
});
export const sessions = pgTable("sessions", {
  id: id(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: created(),
});
export const organizations = pgTable(
  "organizations",
  {
    id: id(),
    ownerId: uuid("owner_id")
      .references(() => users.id)
      .notNull(),
    legalName: text("legal_name").notNull(),
    displayName: text("display_name").notNull(),
    website: text("website").notNull(),
    workEmail: text("work_email").notNull(),
    category: text("category").notNull(),
    authority: text("authority").notNull(),
    status: text("status").notNull().default("submitted"),
    reviewReason: text("review_reason"),
    reviewerId: uuid("reviewer_id").references(() => users.id),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: created(),
  },
  (t) => [uniqueIndex("organizations_owner_unique").on(t.ownerId)],
);
export const organizationVerifications = pgTable("organization_verifications", {
  id: id(),
  orgId: uuid("org_id")
    .references(() => organizations.id)
    .notNull(),
  reviewerId: uuid("reviewer_id")
    .references(() => users.id)
    .notNull(),
  decision: text("decision").notNull(),
  reason: text("reason").notNull(),
  evidenceReference: text("evidence_reference"),
  workEmailChecked: boolean("work_email_checked").notNull().default(false),
  domainChecked: boolean("domain_checked").notNull().default(false),
  authorityChecked: boolean("authority_checked").notNull().default(false),
  version: integer("version").notNull().default(1),
  createdAt: created(),
});
export const opportunities = pgTable(
  "opportunities",
  {
    id: id(),
    orgId: uuid("org_id")
      .references(() => organizations.id)
      .notNull(),
    title: text("title").notNull(),
    type: text("type").notNull(),
    description: text("description").notNull(),
    responsibilities: text("responsibilities").notNull(),
    requirements: text("requirements").notNull(),
    preferred: text("preferred").notNull().default(""),
    location: text("location").notNull(),
    mode: text("mode").notNull(),
    employmentType: text("employment_type"),
    compensation: text("compensation"),
    duration: text("duration"),
    eligibility: text("eligibility").notNull(),
    deadline: timestamp("deadline", { withTimezone: true }),
    applicationMethod: text("application_method").notNull(),
    applicationUrl: text("application_url"),
    status: text("status").notNull().default("draft"),
    version: integer("version").notNull().default(1),
    approvedVersion: integer("approved_version"),
    sourceUrl: text("source_url"),
    sourceCheckedAt: timestamp("source_checked_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: created(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("opportunities_status_idx").on(t.status, t.publishedAt),
    index("opportunities_org_idx").on(t.orgId),
  ],
);
export const reviews = pgTable("opportunity_review_decisions", {
  id: id(),
  opportunityId: uuid("opportunity_id")
    .references(() => opportunities.id)
    .notNull(),
  version: integer("version").notNull(),
  reviewerId: uuid("reviewer_id")
    .references(() => users.id)
    .notNull(),
  decision: text("decision").notNull(),
  reason: text("reason").notNull(),
  createdAt: created(),
});
export const reports = pgTable("moderation_reports", {
  id: id(),
  opportunityId: uuid("opportunity_id").references(() => opportunities.id),
  category: text("category").notNull(),
  details: text("details").notNull(),
  status: text("status").notNull().default("open"),
  reporterHash: text("reporter_hash").notNull(),
  createdAt: created(),
});
export const audit = pgTable("admin_audit_events", {
  id: id(),
  actorId: uuid("actor_id")
    .references(() => users.id)
    .notNull(),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: uuid("target_id").notNull(),
  detail: jsonb("detail").notNull().default({}),
  createdAt: created(),
});
export const identityLinks = pgTable(
  "external_identity_links",
  {
    id: id(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    provider: text("provider").notNull(),
    issuer: text("issuer").notNull(),
    subject: text("subject").notNull(),
    status: text("status").notNull(),
    verifiedAt: timestamp("verified_at", { withTimezone: true }).notNull(),
    createdAt: created(),
  },
  (t) => [
    uniqueIndex("external_identity_subject_unique").on(
      t.provider,
      t.issuer,
      t.subject,
    ),
    uniqueIndex("external_identity_user_provider_unique").on(
      t.userId,
      t.provider,
    ),
  ],
);
export const saved = pgTable(
  "saved_opportunities",
  {
    id: id(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    opportunityId: uuid("opportunity_id")
      .references(() => opportunities.id)
      .notNull(),
    note: text("note").notNull().default(""),
    createdAt: created(),
  },
  (t) => [
    uniqueIndex("saved_user_opportunity_unique").on(t.userId, t.opportunityId),
  ],
);
export const applications = pgTable(
  "applications",
  {
    id: id(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    opportunityId: uuid("opportunity_id")
      .references(() => opportunities.id)
      .notNull(),
    status: text("status").notNull().default("draft"),
    snapshot: jsonb("snapshot").notNull(),
    idempotencyKey: text("idempotency_key").notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    createdAt: created(),
  },
  (t) => [
    uniqueIndex("applications_user_opportunity_unique").on(
      t.userId,
      t.opportunityId,
    ),
    uniqueIndex("applications_idempotency_unique").on(
      t.userId,
      t.idempotencyKey,
    ),
  ],
);
export const applicationEvents = pgTable("application_status_events", {
  id: id(),
  applicationId: uuid("application_id")
    .references(() => applications.id)
    .notNull(),
  actorId: uuid("actor_id")
    .references(() => users.id)
    .notNull(),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  reason: text("reason"),
  createdAt: created(),
});
export const notifications = pgTable("notifications", {
  id: id(),
  recipientId: uuid("recipient_id")
    .references(() => users.id)
    .notNull(),
  category: text("category").notNull(),
  payload: jsonb("payload").notNull(),
  state: text("state").notNull().default("pending"),
  createdAt: created(),
});
