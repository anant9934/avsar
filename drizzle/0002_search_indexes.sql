CREATE EXTENSION IF NOT EXISTS pg_trgm;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS opportunities_title_trgm_idx ON opportunities USING gin (title gin_trgm_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS opportunities_description_trgm_idx ON opportunities USING gin (description gin_trgm_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS opportunities_requirements_trgm_idx ON opportunities USING gin (requirements gin_trgm_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS opportunities_type_mode_deadline_idx ON opportunities (type, mode, deadline);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS organizations_display_name_trgm_idx ON organizations USING gin (display_name gin_trgm_ops);
