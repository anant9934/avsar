CREATE TABLE "site_content" (
	"key" text PRIMARY KEY NOT NULL,
	"published_version" integer,
	"latest_version" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_content_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"version" integer NOT NULL,
	"state" text NOT NULL,
	"body" jsonb NOT NULL,
	"actor_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "site_content_versions" ADD CONSTRAINT "site_content_versions_key_site_content_key_fk" FOREIGN KEY ("key") REFERENCES "public"."site_content"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_content_versions" ADD CONSTRAINT "site_content_versions_actor_id_avsar_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."avsar_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "site_content_key_version_unique" ON "site_content_versions" USING btree ("key","version");