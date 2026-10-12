import { NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { and, eq, gt, count } from "drizzle-orm";
import { db } from "@/db";
import { reports } from "@/db/schema";
import { validOrigin } from "@/lib/auth";
import { jsonError, parseBody } from "@/lib/api";
import { reportSchema } from "@/lib/validation";
export async function POST(req: Request) {
  if (!(await validOrigin())) return jsonError("Invalid origin", 403);
  const parsed = reportSchema.safeParse(await parseBody(req));
  if (!parsed.success)
    return jsonError(
      "Please include a category and at least 10 characters of detail",
    );
  const salt = process.env.REPORT_HASH_SECRET;
  if (!salt) return jsonError("Reporting is temporarily unavailable", 503);
  const ip =
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown";
  const reporterHash = createHmac("sha256", salt).update(ip).digest("hex");
  try {
    const [recent] = await db()
      .select({ value: count() })
      .from(reports)
      .where(
        and(
          eq(reports.reporterHash, reporterHash),
          gt(reports.createdAt, new Date(Date.now() - 3600000)),
        ),
      );
    if (recent.value >= 5)
      return jsonError("Too many reports. Please try later.", 429);
    const [row] = await db()
      .insert(reports)
      .values({ ...parsed.data, reporterHash })
      .returning({ id: reports.id });
    return NextResponse.json({ receipt: row.id }, { status: 201 });
  } catch {
    return jsonError("Report could not be submitted", 503);
  }
}
