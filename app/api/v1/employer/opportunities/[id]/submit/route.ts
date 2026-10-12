import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { organizations, opportunities } from "@/db/schema";
import { actorForWrite, jsonError } from "@/lib/api";
export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await actorForWrite();
  if (auth.error) return auth.error;
  const actor = auth.actor!;
  const { id } = await params;
  if (actor.role !== "recruiter" || !z.uuid().safeParse(id).success)
    return jsonError("Forbidden", 403);
  const [row] = await db()
    .select({ item: opportunities, org: organizations })
    .from(opportunities)
    .innerJoin(organizations, eq(opportunities.orgId, organizations.id))
    .where(and(eq(opportunities.id, id), eq(organizations.ownerId, actor.id)))
    .limit(1);
  if (
    !row ||
    row.org.status !== "approved" ||
    !["draft", "needs_changes"].includes(row.item.status)
  )
    return jsonError("Listing cannot be submitted", 409);
  const [updated] = await db()
    .update(opportunities)
    .set({ status: "submitted", updatedAt: new Date() })
    .where(
      and(eq(opportunities.id, id), eq(opportunities.status, row.item.status)),
    )
    .returning({ id: opportunities.id });
  return updated
    ? NextResponse.json({ ok: true })
    : jsonError("Listing changed; retry", 409);
}
