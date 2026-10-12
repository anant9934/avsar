import {
  randomBytes,
  createHash,
  scryptSync,
  timingSafeEqual,
  createHmac,
} from "node:crypto";
import { cookies, headers } from "next/headers";
import { eq, and, gt } from "drizzle-orm";
import { db } from "@/db";
import { users, sessions } from "@/db/schema";
export type Actor = { id: string; email: string; role: string; status: string };
export const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  return `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
};
export function verifyPassword(password: string, stored: string) {
  const [kind, salt, hash] = stored.split(":");
  if (kind !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export const tokenHash = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export async function currentUser(): Promise<Actor | null> {
  const token = (await cookies()).get("avsar_session")?.value;
  if (!token) return null;
  const [row] = await db()
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      status: users.status,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.tokenHash, tokenHash(token)),
        gt(sessions.expiresAt, new Date()),
      ),
    )
    .limit(1);
  return row?.status === "active" ? row : null;
}
export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  await db()
    .insert(sessions)
    .values({
      userId,
      tokenHash: tokenHash(token),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  (await cookies()).set("avsar_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}
export async function endSession() {
  const c = await cookies(),
    token = c.get("avsar_session")?.value;
  if (token)
    await db()
      .delete(sessions)
      .where(eq(sessions.tokenHash, tokenHash(token)));
  c.delete("avsar_session");
}
export async function validOrigin() {
  const h = await headers(),
    origin = h.get("origin"),
    host = h.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
const base32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export function verifyTotp(code: string, secret: string, now = Date.now()) {
  if (!/^\d{6}$/.test(code) || !/^[A-Z2-7]+=*$/.test(secret.toUpperCase()))
    return false;
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const ch of secret.toUpperCase().replace(/=+$/, "")) {
    value = (value << 5) | base32.indexOf(ch);
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  for (let offset = -1; offset <= 1; offset++) {
    const b = Buffer.alloc(8);
    b.writeBigUInt64BE(BigInt(Math.floor(now / 30000) + offset));
    const digest = createHmac("sha1", Buffer.from(bytes)).update(b).digest();
    const pos = digest[19] & 15;
    const value = (digest.readUInt32BE(pos) & 0x7fffffff) % 1000000;
    if (
      timingSafeEqual(
        Buffer.from(String(value).padStart(6, "0")),
        Buffer.from(code),
      )
    )
      return true;
  }
  return false;
}
export const isAdmin = (a: Actor | null) =>
  !!a &&
  ["super_admin", "verification_officer", "listing_moderator"].includes(a.role);
export const canVerifyOrg = (a: Actor | null) =>
  !!a && ["super_admin", "verification_officer"].includes(a.role);
export const canReviewListing = (a: Actor | null) =>
  !!a && ["super_admin", "listing_moderator"].includes(a.role);
