CREATE TABLE "sales_inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_name" text NOT NULL,
	"work_email" text NOT NULL,
	"organization" text NOT NULL,
	"website" text,
	"hiring_volume" text NOT NULL,
	"interest" text NOT NULL,
	"message" text NOT NULL,
	"sender_hash" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "sales_inquiries_sender_idx" ON "sales_inquiries" USING btree ("sender_hash","created_at");