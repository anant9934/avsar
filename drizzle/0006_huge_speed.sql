CREATE TABLE "employer_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"price_label" text NOT NULL,
	"listing_limit" integer,
	"seat_limit" integer,
	"features" jsonb NOT NULL,
	"approved_by" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "employer_plans_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "employer_plans" ADD CONSTRAINT "employer_plans_approved_by_avsar_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."avsar_users"("id") ON DELETE no action ON UPDATE no action;