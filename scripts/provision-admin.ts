import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { users } from "../src/db/schema";
import { hashPassword } from "../src/lib/auth";

async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const totpSecret = process.env.ADMIN_TOTP_SECRET;
  if (
    !email ||
    !password ||
    password.length < 16 ||
    !totpSecret ||
    !/^[A-Z2-7]{16,}$/i.test(totpSecret)
  ) {
    throw new Error(
      "ADMIN_EMAIL, a 16+ character ADMIN_PASSWORD, and a base32 ADMIN_TOTP_SECRET are required",
    );
  }
  const existing = await db()
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing.length)
    throw new Error("Admin email already exists; refusing to overwrite");
  await db()
    .insert(users)
    .values({ email, passwordHash: hashPassword(password), role: "super_admin" });
  console.log("Admin provisioned; keep the password and TOTP secret private.");
}
main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Provisioning failed");
  process.exitCode = 1;
});
