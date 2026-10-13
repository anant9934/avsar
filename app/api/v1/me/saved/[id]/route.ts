import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { saved } from "@/db/schema";
import { currentUser, validOrigin } from "@/lib/auth";
import { entitlement } from "@/lib/entitlement";
import { getPublicOpportunity } from "@/lib/opportunities";
import { jsonError, parseBody } from "@/lib/api";
import { recordEvent } from "@/lib/analytics";
async function gate(id: string) {
  if (!z.uuid().safeParse(id).success)
    return { error: jsonError("Not found", 404) };
  const actor = await currentUser();
  if (!actor) return { error: jsonError("Authentication required", 401) };
  if (!(await entitlement(actor)).active)
    return {
      error: jsonError("Jobseeker access is unavailable for this account", 403),
    };
  return { actor };
}
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await validOrigin())) return jsonError("Invalid origin", 403);
  const { id } = await params;
  try {
    const auth = await gate(id);
    if (auth.error) return auth.error;
    const listing = await getPublicOpportunity(id);
    if (!listing) return jsonError("Listing is unavailable", 409);
    const note = z
      .object({ note: z.string().max(1000).optional() })
      .safeParse(await parseBody(req));
    if (!note.success) return jsonError("Note too long");
    await db()
      .insert(saved)
      .values({
        userId: auth.actor!.id,
        opportunityId: id,
        note: note.data.note || "",
      })
      .onConflictDoUpdate({
        target: [saved.userId, saved.opportunityId],
        set: { note: note.data.note || "" },
      });
    await recordEvent("opportunity_saved", auth.actor!.id);
    return NextResponse.json({ ok: true });
  } catch {
    return jsonError("Save unavailable", 503);
  }
}
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await validOrigin())) return jsonError("Invalid origin", 403);
  const { id } = await params;
  try {
    const auth = await gate(id);
    if (auth.error) return auth.error;
    await db()
      .delete(saved)
      .where(
        and(eq(saved.userId, auth.actor!.id), eq(saved.opportunityId, id)),
      );
    return NextResponse.json({ ok: true });
  } catch {
    return jsonError("Remove unavailable", 503);
  }
}
