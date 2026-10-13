import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { salesInquiries } from "@/db/schema";
import { currentUser, isAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/api";
export async function GET() {
  try {
    const actor = await currentUser();
    if (!isAdmin(actor) || actor?.role !== "super_admin")
      return jsonError("Forbidden", 403);
    const items = await db()
      .select({
        id: salesInquiries.id,
        contactName: salesInquiries.contactName,
        workEmail: salesInquiries.workEmail,
        organization: salesInquiries.organization,
        website: salesInquiries.website,
        hiringVolume: salesInquiries.hiringVolume,
        interest: salesInquiries.interest,
        message: salesInquiries.message,
        status: salesInquiries.status,
        createdAt: salesInquiries.createdAt,
      })
      .from(salesInquiries)
      .orderBy(desc(salesInquiries.createdAt))
      .limit(50);
    return NextResponse.json({ items });
  } catch {
    return jsonError("Inquiry queue unavailable", 503);
  }
}
