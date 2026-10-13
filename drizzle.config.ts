import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Migrations must never fall back to the runtime's pooled URL.
    url: process.env.DATABASE_DIRECT_URL || "",
  },
});
