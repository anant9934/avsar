import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { organizations, opportunities } from "@/db/schema";
import { actorForWrite, jsonError, parseBody } from "@/lib/api";
import { opportunitySchema } from "@/lib/validation";
import { currentUser } from "@/lib/auth";
export async function GET() {
  const actor = await currentUser();
  if (!actor || actor.role !== "recruiter")
    return jsonError("Unauthorized", 401);
  const items = await db()
    .select({ opportunity: opportunities, organization: organizations })
    .from(opportunities)
    .innerJoin(organizations, eq(opportunities.orgId, organizations.id))
    .where(eq(organizations.ownerId, actor.id));
  return NextResponse.json({ items });
}
export async function POST(req: Request) {
  const auth = await actorForWrite();
  if (auth.error) return auth.error;
  const actor = auth.actor!;
  if (actor.role !== "recruiter") return jsonError("Forbidden", 403);
  const parsed = opportunitySchema.safeParse(await parseBody(req));
  if (!parsed.success)
    return NextResponse.json(
      {
        error: "Check listing fields",
        issues: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  const [org] = await db()
    .select()
    .from(organizations)
    .where(eq(organizations.ownerId, actor.id))
    .limit(1);
  if (!org || org.status !== "approved")
    return jsonError(
      "Organization approval is required before creating listings",
      403,
    );
  const [item] = await db()
    .insert(opportunities)
    .values({
      ...parsed.data,
      orgId: org.id,
      deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
      status: "draft",
    })
    .returning();
  return NextResponse.json({ item }, { status: 201 });
}
