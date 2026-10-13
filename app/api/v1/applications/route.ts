import { NextResponse } from "next/server";
import { eq, desc, and } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { applications, opportunities } from "@/db/schema";
import { currentUser, validOrigin } from "@/lib/auth";
import { entitlement } from "@/lib/entitlement";
import { getPublicOpportunity } from "@/lib/opportunities";
import { jsonError, parseBody } from "@/lib/api";
import { recordEvent } from "@/lib/analytics";
export async function GET() {
  try {
    const actor = await currentUser();
    if (!actor) return jsonError("Authentication required", 401);
    if (!(await entitlement(actor)).active)
      return jsonError("Jobseeker access is unavailable for this account", 403);
    const items = await db()
      .select({ application: applications, title: opportunities.title })
      .from(applications)
      .innerJoin(
        opportunities,
        eq(applications.opportunityId, opportunities.id),
      )
      .where(eq(applications.userId, actor.id))
      .orderBy(desc(applications.createdAt));
    return NextResponse.json({ items });
  } catch {
    return jsonError("Applications unavailable", 503);
  }
}
export async function POST(req: Request) {
  if (!(await validOrigin())) return jsonError("Invalid origin", 403);
  try {
    const actor = await currentUser();
    if (!actor) return jsonError("Authentication required", 401);
    if (!(await entitlement(actor)).active)
      return jsonError("Jobseeker access is unavailable for this account", 403);
    const parsed = z
      .object({
        opportunityId: z.uuid(),
        idempotencyKey: z.string().uuid(),
        candidateStatement: z.string().trim().min(20).max(5000),
        consentConfirmed: z.literal(true),
      })
      .safeParse(await parseBody(req));
    if (!parsed.success)
      return jsonError("Invalid application draft or missing consent");
    const listing = await getPublicOpportunity(parsed.data.opportunityId);
    if (!listing || listing.opportunity.applicationMethod !== "internal")
      return jsonError("Internal application is unavailable", 409);
    const snapshot = {
      candidateEmail: actor.email,
      candidateStatement: parsed.data.candidateStatement,
      opportunityTitle: listing.opportunity.title,
      organization: listing.organization.displayName,
      consentConfirmed: true,
      source: "candidate-entered",
    };
    const [item] = await db()
      .insert(applications)
      .values({
        userId: actor.id,
        opportunityId: parsed.data.opportunityId,
        idempotencyKey: parsed.data.idempotencyKey,
        snapshot,
        status: "draft",
      })
      .onConflictDoNothing()
      .returning({ id: applications.id });
    if (item) {
      await recordEvent("application_started", actor.id);
      return NextResponse.json({ draftId: item.id, snapshot }, { status: 201 });
    }
    const [existing] = await db()
      .select({
        id: applications.id,
        opportunityId: applications.opportunityId,
        snapshot: applications.snapshot,
      })
      .from(applications)
      .where(
        and(
          eq(applications.userId, actor.id),
          eq(applications.idempotencyKey, parsed.data.idempotencyKey),
        ),
      )
      .limit(1);
    return existing?.opportunityId === parsed.data.opportunityId
      ? NextResponse.json({
          draftId: existing.id,
          snapshot: existing.snapshot,
          alreadyExists: true,
        })
      : jsonError("An application draft already exists", 409);
  } catch {
    return jsonError("Draft could not be saved", 503);
  }
}
