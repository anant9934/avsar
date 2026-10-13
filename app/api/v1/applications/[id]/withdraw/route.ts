import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { applications, applicationEvents } from "@/db/schema";
import { currentUser, validOrigin } from "@/lib/auth";
import { entitlement } from "@/lib/entitlement";
import { jsonError } from "@/lib/api";
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
        .select()
        .from(applications)
        .where(and(eq(applications.id, id), eq(applications.userId, actor.id)))
        .for("update")
        .limit(1);
      if (!row) return false;
      if (row.status === "withdrawn") return true;
      if (!["submitted", "received", "under_review"].includes(row.status))
        return false;
      await tx
        .update(applications)
        .set({ status: "withdrawn" })
        .where(eq(applications.id, id));
      await tx.insert(applicationEvents).values({
        applicationId: id,
        actorId: actor.id,
        fromStatus: row.status,
        toStatus: "withdrawn",
      });
      return true;
    });
    return result
      ? NextResponse.json({ ok: true })
      : jsonError("Application cannot be withdrawn", 409);
  } catch {
    return jsonError("Withdrawal failed", 503);
  }
}
