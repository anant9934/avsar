import { NextResponse } from "next/server";
import { and, eq, count } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { organizations, opportunities, reviews, audit } from "@/db/schema";
import { currentUser, canReviewListing, validOrigin } from "@/lib/auth";
import { jsonError, parseBody } from "@/lib/api";
import { decisionSchema } from "@/lib/validation";
import { canTransition, ListingStatus, starterQuota } from "@/lib/workflows";
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await validOrigin())) return jsonError("Invalid origin", 403);
  const actor = await currentUser();
  if (!canReviewListing(actor)) return jsonError("Forbidden", 403);
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) return jsonError("Not found", 404);
  const parsed = decisionSchema.safeParse(await parseBody(req));
  if (!parsed.success)
    return jsonError(
      "Decision and a reason of at least 10 characters required",
    );
  const { decision, reason } = parsed.data;
  const to = {
    approve: "approved",
    reject: "rejected",
    needs_changes: "needs_changes",
    publish: "published",
    suspend: "suspended",
  }[decision] as ListingStatus;
  try {
    const result = await db().transaction(async (tx) => {
      const [row] = await tx
        .select({ item: opportunities, org: organizations })
        .from(opportunities)
        .innerJoin(organizations, eq(opportunities.orgId, organizations.id))
        .where(eq(opportunities.id, id))
        .for("update")
        .limit(1);
      if (
        !row ||
        !canTransition(row.item.status as ListingStatus, to) ||
        row.org.status !== "approved"
      )
        return { error: "Invalid listing or organization state" };
      if (to === "published") {
        if (row.item.approvedVersion !== row.item.version)
          return { error: "Current listing version is not approved" };
        if (row.item.deadline && row.item.deadline <= new Date())
          return { error: "Deadline has passed" };
        const [active] = await tx
          .select({ value: count() })
          .from(opportunities)
          .where(
            and(
              eq(opportunities.orgId, row.org.id),
              eq(opportunities.status, "published"),
            ),
          );
        if (!starterQuota(active.value))
          return { error: "Starter plan allows one active listing" };
      }
      await tx
        .update(opportunities)
        .set({
          status: to,
          approvedVersion:
            to === "approved" ? row.item.version : row.item.approvedVersion,
          publishedAt: to === "published" ? new Date() : row.item.publishedAt,
          updatedAt: new Date(),
        })
        .where(eq(opportunities.id, id));
      await tx
        .insert(reviews)
        .values({
          opportunityId: id,
          version: row.item.version,
          reviewerId: actor!.id,
          decision: to,
          reason,
        });
      await tx
        .insert(audit)
        .values({
          actorId: actor!.id,
          action: `opportunity.${to}`,
          targetType: "opportunity",
          targetId: id,
          detail: { reason, version: row.item.version },
        });
      return { ok: true };
    });
    return "error" in result
      ? jsonError(result.error || "Decision rejected", 409)
      : NextResponse.json(result);
  } catch {
    return jsonError("Decision could not be saved", 503);
  }
}
