CREATE TABLE "organization_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"reviewer_id" uuid NOT NULL,
	"decision" text NOT NULL,
	"reason" text NOT NULL,
	"evidence_reference" text,
	"work_email_checked" boolean DEFAULT false NOT NULL,
	"domain_checked" boolean DEFAULT false NOT NULL,
	"authority_checked" boolean DEFAULT false NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "organizations_owner_idx";--> statement-breakpoint
ALTER TABLE "organization_verifications" ADD CONSTRAINT "organization_verifications_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_verifications" ADD CONSTRAINT "organization_verifications_reviewer_id_avsar_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."avsar_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "organizations_owner_unique" ON "organizations" USING btree ("owner_id");