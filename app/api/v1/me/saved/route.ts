import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { saved, opportunities } from "@/db/schema";
import { currentUser } from "@/lib/auth";
import { entitlement } from "@/lib/entitlement";
import { jsonError } from "@/lib/api";
export async function GET() {
  try {
    const actor = await currentUser();
    if (!actor) return jsonError("Authentication required", 401);
    if (!(await entitlement(actor)).active)
      return jsonError("Verified Core and Collaborate links required", 403);
    const items = await db()
      .select({ save: saved, opportunity: opportunities })
      .from(saved)
      .innerJoin(opportunities, eq(saved.opportunityId, opportunities.id))
      .where(eq(saved.userId, actor.id))
      .orderBy(desc(saved.createdAt));
    return NextResponse.json({ items });
  } catch {
    return jsonError("Saved opportunities unavailable", 503);
  }
}
