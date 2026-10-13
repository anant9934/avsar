import { createHmac } from "node:crypto";
import { and, count, eq, gt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { salesInquiries } from "@/db/schema";
import { validOrigin } from "@/lib/auth";
import { jsonError, parseBody } from "@/lib/api";
import { recordEvent } from "@/lib/analytics";
const schema = z.object({
  contactName: z.string().trim().min(2).max(120),
  workEmail: z.email().max(254),
  organization: z.string().trim().min(2).max(180),
  website: z.union([z.url().startsWith("https://"), z.literal("")]).optional(),
  hiringVolume: z.enum(["1-5", "6-20", "21-100", "100+"]),
  interest: z.enum(["Growth", "Business", "Enterprise", "Other"]),
  message: z.string().trim().min(20).max(4000),
  consent: z.literal(true),
  websiteTrap: z.literal("").optional(),
});
export async function POST(req: Request) {
  if (!(await validOrigin())) return jsonError("Invalid origin", 403);
  const parsed = schema.safeParse(await parseBody(req));
  if (!parsed.success)
    return jsonError(
      "Please complete all required fields and consent to contact.",
    );
  const secret = process.env.REPORT_HASH_SECRET;
  if (!secret) return jsonError("Inquiry service unavailable", 503);
  const ip =
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown";
  const senderHash = createHmac("sha256", secret)
    .update(`${ip.toLowerCase()}|${parsed.data.workEmail.toLowerCase()}`)
    .digest("hex");
  try {
    const [recent] = await db()
      .select({ value: count() })
      .from(salesInquiries)
      .where(
        and(
          eq(salesInquiries.senderHash, senderHash),
          gt(salesInquiries.createdAt, new Date(Date.now() - 24 * 3600000)),
        ),
      );
    if (recent.value >= 2)
      return jsonError(
        "An inquiry from this address was received recently. Please try again later.",
        429,
      );
    const {
      contactName,
      workEmail,
      organization,
      website,
      hiringVolume,
      interest,
      message,
    } = parsed.data;
    const [row] = await db()
      .insert(salesInquiries)
      .values({
        contactName,
        workEmail: workEmail.toLowerCase(),
        organization,
        website: website || null,
        hiringVolume,
        interest,
        message,
        senderHash,
      })
      .returning({ id: salesInquiries.id });
    await recordEvent("sales_inquiry_submitted", senderHash);
    return NextResponse.json({ receipt: row.id }, { status: 201 });
  } catch {
    return jsonError("Inquiry could not be saved right now", 503);
  }
}
