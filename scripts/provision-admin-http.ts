import { neon } from "@neondatabase/serverless";
import { hashPassword } from "../src/lib/auth";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const totpSecret = process.env.ADMIN_TOTP_SECRET;
  const connectionString = process.env.DATABASE_DIRECT_URL;
  if (
    !email ||
    !password ||
    password.length < 16 ||
    !totpSecret ||
    !/^[A-Z2-7]{16,}$/i.test(totpSecret) ||
    !connectionString
  )
    throw new Error(
      "ADMIN_EMAIL, a 16+ character ADMIN_PASSWORD, ADMIN_TOTP_SECRET, and DATABASE_DIRECT_URL are required",
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
    [email],
  );
  if (existing.length)
    throw new Error("Admin email already exists; refusing to overwrite");
  const inserted = await sql.query(
    "insert into avsar_users (email, password_hash, role, status) values ($1, $2, 'super_admin', 'active') on conflict (email) do nothing returning id",
    [email, hashPassword(password)],
  );
  if (inserted.length !== 1)
    throw new Error("Admin account was not created; email may already exist");
  console.log("Admin provisioned; keep the password and TOTP secret private.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Provisioning failed");
  process.exitCode = 1;
});
