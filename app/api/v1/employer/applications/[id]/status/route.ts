import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import {
  applications,
  applicationEvents,
  opportunities,
  organizations,
  notifications,
} from "@/db/schema";
import { currentUser, validOrigin } from "@/lib/auth";
import { jsonError, parseBody } from "@/lib/api";
const next: Record<string, string[]> = {
  submitted: ["received", "under_review", "not_selected"],
  received: ["under_review", "not_selected"],
  under_review: ["offered", "not_selected"],
  offered: ["closed"],
  not_selected: [],
  withdrawn: [],
  closed: [],
};
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await validOrigin())) return jsonError("Invalid origin", 403);
  const actor = await currentUser();
  if (!actor || actor.role !== "recruiter") return jsonError("Forbidden", 403);
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) return jsonError("Not found", 404);
  const parsed = z
    .object({
      status: z.enum([
        "received",
        "under_review",
        "offered",
        "not_selected",
        "closed",
      ]),
      reason: z.string().trim().min(5).max(1000),
    })
    .safeParse(await parseBody(req));
  if (!parsed.success) return jsonError("Valid status and reason required");
  try {
    const result = await db().transaction(async (tx) => {
      const [row] = await tx
        .select({ application: applications, organization: organizations })
        .from(applications)
        .innerJoin(
          opportunities,
          eq(applications.opportunityId, opportunities.id),
        )
        .innerJoin(organizations, eq(opportunities.orgId, organizations.id))
        .where(
          and(
            eq(applications.id, id),
            eq(organizations.ownerId, actor.id),
            eq(organizations.status, "approved"),
          ),
        )
        .for("update")
        .limit(1);
      if (!row) return { error: "Application not found", status: 404 };
      if (!next[row.application.status]?.includes(parsed.data.status))
        return { error: "Invalid application transition", status: 409 };
      await tx
        .update(applications)
        .set({ status: parsed.data.status })
        .where(eq(applications.id, id));
      await tx
        .insert(applicationEvents)
        .values({
          applicationId: id,
          actorId: actor.id,
          fromStatus: row.application.status,
          toStatus: parsed.data.status,
          reason: parsed.data.reason,
        });
      await tx
        .insert(notifications)
        .values({
          recipientId: row.application.userId,
          category: "application_status",
          payload: { applicationId: id, status: parsed.data.status },
          state: "pending",
        });
      return { ok: true };
    });
    return "error" in result
      ? jsonError(result.error!, result.status)
      : NextResponse.json(result);
  } catch {
    return jsonError("Status update failed", 503);
  }
}
