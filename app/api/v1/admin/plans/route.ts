import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { audit, employerPlans } from "@/db/schema";
import { currentUser, validOrigin } from "@/lib/auth";
import { jsonError, parseBody } from "@/lib/api";
const schema = z
  .object({
    name: z.enum(["Starter", "Growth", "Business", "Enterprise"]),
    priceLabel: z
      .string()
      .trim()
      .min(1)
      .max(60)
      .refine((x) => !/[<>]/.test(x)),
    listingLimit: z.number().int().min(1).max(10000).nullable(),
    seatLimit: z.number().int().min(1).max(1000).nullable(),
    features: z
      .array(
        z
          .string()
          .trim()
          .min(2)
          .max(160)
          .refine((x) => !/[<>]/.test(x)),
      )
      .min(1)
      .max(15),
  })
  .refine(
    (x) =>
      x.name !== "Starter" ||
      (x.priceLabel === "Free" && x.listingLimit === 1 && x.seatLimit === 1),
    { message: "Starter must remain free with one listing and one seat" },
  );
export async function GET() {
  try {
    const actor = await currentUser();
    if (actor?.role !== "super_admin") return jsonError("Forbidden", 403);
    return NextResponse.json({
      items: await db().select().from(employerPlans),
    });
  } catch {
    return jsonError("Plans unavailable", 503);
  }
}
export async function POST(req: Request) {
  if (!(await validOrigin())) return jsonError("Invalid origin", 403);
  const actor = await currentUser().catch(() => null);
  if (actor?.role !== "super_admin") return jsonError("Forbidden", 403);
  const parsed = schema.safeParse(await parseBody(req));
  if (!parsed.success) return jsonError("Invalid plan configuration");
  try {
    const result = await db().transaction(async (tx) => {
      const [row] = await tx
        .insert(employerPlans)
        .values({ ...parsed.data, approvedBy: actor.id })
        .onConflictDoUpdate({
          target: employerPlans.name,
          set: { ...parsed.data, approvedBy: actor.id, updatedAt: new Date() },
        })
        .returning({ id: employerPlans.id });
      await tx
        .insert(audit)
        .values({
          actorId: actor.id,
          action: "plan_catalog_approved",
          targetType: "employer_plan",
          targetId: row.id,
          detail: {
            name: parsed.data.name,
            priceLabel: parsed.data.priceLabel,
            listingLimit: parsed.data.listingLimit,
            seatLimit: parsed.data.seatLimit,
          },
        });
      return row;
    });
    return NextResponse.json({ id: result.id });
  } catch {
    return jsonError("Plan could not be saved", 503);
  }
}
