import { neon } from "@neondatabase/serverless";
import { registerSchema } from "../src/lib/validation";
import { hashPassword } from "../src/lib/auth";

async function main() {
  const parsed = registerSchema.safeParse({
    email: process.env.RECRUITER_EMAIL,
    password: process.env.RECRUITER_PASSWORD,
  });
  const connectionString = process.env.DATABASE_DIRECT_URL;
  if (!parsed.success || !connectionString)
    throw new Error(
      "Valid RECRUITER_EMAIL, a 12+ character RECRUITER_PASSWORD, and DATABASE_DIRECT_URL are required",
    );
  const target = new URL(connectionString);
  if (
    (target.protocol !== "postgresql:" && target.protocol !== "postgres:") ||
    target.hostname.includes("-pooler")
  )
    throw new Error("A direct, non-pooled PostgreSQL URL is required");

  const sql = neon(connectionString);
  const existing = await sql.query(
    "select id from avsar_users where lower(email) = $1 limit 1",
    [parsed.data.email],
  );
  if (existing.length)
    throw new Error("Recruiter email already exists; refusing to overwrite");
  const inserted = await sql.query(
    "insert into avsar_users (email, password_hash, role, status) values ($1, $2, 'recruiter', 'active') on conflict (email) do nothing returning id",
    [parsed.data.email, hashPassword(parsed.data.password)],
  );
  if (inserted.length !== 1)
    throw new Error("Recruiter account was not created; email may already exist");
  console.log("Recruiter account created. Organization approval is still required before posting.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Provisioning failed");
  process.exitCode = 1;
});
