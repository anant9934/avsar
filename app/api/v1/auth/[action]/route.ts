import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { registerSchema, loginSchema } from "@/lib/validation";
import {
  hashPassword,
  verifyPassword,
  createSession,
  endSession,
  validOrigin,
  verifyTotp,
  currentUser,
} from "@/lib/auth";
import { jsonError, parseBody } from "@/lib/api";
export async function POST(
  req: Request,
  { params }: { params: Promise<{ action: string }> },
) {
  const { action } = await params;
  if (!(await validOrigin())) return jsonError("Invalid request origin", 403);
  if (action === "logout") {
    await endSession();
    return NextResponse.json({ ok: true });
  }
  const body = await parseBody(req);
  if (action === "register") {
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success)
      return jsonError(
        "Provide a valid email and a password of at least 12 characters",
      );
    try {
      const [user] = await db()
        .insert(users)
        .values({
          email: parsed.data.email,
          passwordHash: hashPassword(parsed.data.password),
          role: "recruiter",
        })
        .returning({ id: users.id });
      await createSession(user.id);
      return NextResponse.json(
        { ok: true, role: "recruiter" },
        { status: 201 },
      );
    } catch {
      return jsonError(
        "Account could not be created. Email may already be registered.",
        409,
      );
    }
  }
  if (action === "login") {
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return jsonError("Invalid credentials", 401);
    try {
      const [user] = await db()
        .select()
        .from(users)
        .where(eq(users.email, parsed.data.email))
        .limit(1);
      if (
        !user ||
        !verifyPassword(parsed.data.password, user.passwordHash) ||
        user.status !== "active"
      )
        return jsonError("Invalid credentials", 401);
      if (
        user.role !== "recruiter" &&
        (!process.env.ADMIN_TOTP_SECRET ||
          !verifyTotp(parsed.data.otp || "", process.env.ADMIN_TOTP_SECRET))
      )
        return jsonError(
          "Administrator verification code required or invalid",
          401,
        );
      await createSession(user.id);
      return NextResponse.json({ ok: true, role: user.role });
    } catch {
      return jsonError("Sign in is temporarily unavailable", 503);
    }
  }
  return jsonError("Not found", 404);
}
export async function GET(
  _: Request,
  { params }: { params: Promise<{ action: string }> },
) {
  const { action } = await params;
  if (action !== "session") return jsonError("Not found", 404);
  try {
    const actor = await currentUser();
    return NextResponse.json({ actor });
  } catch {
    return jsonError("Session service unavailable", 503);
  }
}
