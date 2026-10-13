import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import {
  applications,
  applicationEvents,
  notifications,
  opportunities,
  organizations,
} from "@/db/schema";
import { currentUser, validOrigin } from "@/lib/auth";
import { entitlement } from "@/lib/entitlement";
import { jsonError } from "@/lib/api";
import { isPublicListing } from "@/lib/workflows";
import { recordEvent } from "@/lib/analytics";
export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await validOrigin())) return jsonError("Invalid origin", 403);
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) return jsonError("Not found", 404);
  try {
    const actor = await currentUser();
    if (!actor) return jsonError("Authentication required", 401);
    if (!(await entitlement(actor)).active)
      return jsonError("Jobseeker access is unavailable for this account", 403);
    const result = await db().transaction(async (tx) => {
      const [row] = await tx
        .select({
          application: applications,
          opportunity: opportunities,
          organization: organizations,
        })
        .from(applications)
        .innerJoin(
          opportunities,
          eq(applications.opportunityId, opportunities.id),
        )
        .innerJoin(organizations, eq(opportunities.orgId, organizations.id))
        .where(and(eq(applications.id, id), eq(applications.userId, actor.id)))
        .for("update")
        .limit(1);
      if (!row) return { error: "Application not found", status: 404 };
      if (row.application.status === "submitted")
        return { receipt: row.application.id, alreadySubmitted: true };
      if (row.application.status !== "draft")
        return { error: "Application cannot be submitted", status: 409 };
      if (
        row.opportunity.applicationMethod !== "internal" ||
        !isPublicListing(
          row.opportunity.status,
          row.organization.status,
          row.opportunity.deadline,
          row.opportunity.approvedVersion,
          row.opportunity.version,
        )
      )
        return { error: "Listing is no longer available", status: 409 };
      await tx
        .update(applications)
        .set({ status: "submitted", submittedAt: new Date() })
        .where(eq(applications.id, id));
      await tx.insert(applicationEvents).values({
        applicationId: id,
        actorId: actor.id,
        fromStatus: "draft",
        toStatus: "submitted",
      });
      await tx.insert(notifications).values({
        recipientId: row.organization.ownerId,
        category: "application_submitted",
        payload: { applicationId: id, opportunityId: row.opportunity.id },
        state: "pending",
      });
      return { receipt: id, alreadySubmitted: false };
    });
    if (!("error" in result) && !result.alreadySubmitted)
      await recordEvent("application_submitted", actor.id);
    return "error" in result
      ? jsonError(result.error!, result.status)
      : NextResponse.json(result);
  } catch {
    return jsonError("Submission failed; draft was preserved", 503);
  }
}
