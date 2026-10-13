import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { demoMode } from "@/lib/demo-opportunities";
let pool: Pool | undefined;
export function db() {
  const connectionString = demoMode
    ? process.env.DATABASE_PREVIEW_URL
    : process.env.DATABASE_URL;
  if (!connectionString)
    throw new Error(
      demoMode
        ? "DATABASE_PREVIEW_URL is not configured"
        : "DATABASE_URL is not configured",
    );
  pool ??= new Pool({
    connectionString,
    max: 5,
    connectionTimeoutMillis: 3000,
    ssl: { rejectUnauthorized: true },
  });
  return drizzle(pool, { schema });
}
