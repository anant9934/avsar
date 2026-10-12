import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { organizations, organizationVerifications, audit } from "@/db/schema";
import { currentUser, canVerifyOrg, validOrigin } from "@/lib/auth";
import { jsonError, parseBody } from "@/lib/api";
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await validOrigin())) return jsonError("Invalid origin", 403);
  const actor = await currentUser();
  if (!canVerifyOrg(actor)) return jsonError("Forbidden", 403);
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) return jsonError("Not found", 404);
  const parsed = z
    .object({
      decision: z.enum(["approved", "rejected", "more_information_required"]),
      reason: z.string().trim().min(10).max(2000),
      evidenceReference: z.string().trim().max(300).optional(),
      workEmailChecked: z.boolean().default(false),
      domainChecked: z.boolean().default(false),
      authorityChecked: z.boolean().default(false),
    })
    .safeParse(await parseBody(req));
  if (!parsed.success) return jsonError("Decision and reason required");
  if (
    parsed.data.decision === "approved" &&
    (!parsed.data.evidenceReference ||
      !parsed.data.workEmailChecked ||
      !parsed.data.domainChecked ||
      !parsed.data.authorityChecked)
  )
    return jsonError(
      "Approval requires an evidence reference and confirmation of work email, domain, and recruiter authority",
    );
  try {
    const result = await db().transaction(async (tx) => {
      const [org] = await tx
        .update(organizations)
        .set({
          status: parsed.data.decision,
          reviewReason: parsed.data.reason,
          reviewerId: actor!.id,
          reviewedAt: new Date(),
        })
        .where(
          and(eq(organizations.id, id), eq(organizations.status, "submitted")),
        )
        .returning({ id: organizations.id });
      if (!org) return null;
      await tx
        .insert(organizationVerifications)
        .values({ orgId: id, reviewerId: actor!.id, ...parsed.data });
      await tx
        .insert(audit)
        .values({
          actorId: actor!.id,
          action: `organization.${parsed.data.decision}`,
          targetType: "organization",
          targetId: id,
          detail: {
            reason: parsed.data.reason,
            evidenceReference: parsed.data.evidenceReference,
            workEmailChecked: parsed.data.workEmailChecked,
            domainChecked: parsed.data.domainChecked,
            authorityChecked: parsed.data.authorityChecked,
          },
        });
      return org;
    });
    return result
      ? NextResponse.json({ ok: true })
      : jsonError("Organization has changed or is unavailable", 409);
  } catch {
    return jsonError("Decision could not be saved", 503);
  }
}
