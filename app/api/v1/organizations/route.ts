import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { actorForWrite, jsonError, parseBody } from "@/lib/api";
import { organizationSchema } from "@/lib/validation";
import { currentUser } from "@/lib/auth";
export async function GET() {
  const actor = await currentUser();
  if (!actor || actor.role !== "recruiter")
    return jsonError("Unauthorized", 401);
  const items = await db()
    .select()
    .from(organizations)
    .where(eq(organizations.ownerId, actor.id));
  return NextResponse.json({ items });
}
export async function POST(req: Request) {
  const auth = await actorForWrite();
  if (auth.error) return auth.error;
  const actor = auth.actor!;
  if (actor.role !== "recruiter") return jsonError("Forbidden", 403);
  const parsed = organizationSchema.safeParse(await parseBody(req));
  if (!parsed.success) return jsonError("Check the organization information");
  const existing = await db()
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.ownerId, actor.id))
    .limit(1);
  if (existing.length)
    return jsonError("An organization request already exists", 409);
  const [org] = await db()
    .insert(organizations)
    .values({ ...parsed.data, ownerId: actor.id, status: "submitted" })
    .returning();
  return NextResponse.json({ organization: org }, { status: 201 });
}
