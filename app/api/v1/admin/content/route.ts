import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteContent, siteContentVersions } from "@/db/schema";
import { currentUser, isAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/api";
import { contentKeys } from "@/lib/site-content";
export async function GET() {
  try {
    const actor = await currentUser();
    if (!isAdmin(actor)) return jsonError("Forbidden", 403);
    const [records, versions] = await Promise.all([
      db().select().from(siteContent),
      db()
        .select({
          key: siteContentVersions.key,
          version: siteContentVersions.version,
          state: siteContentVersions.state,
          body: siteContentVersions.body,
          createdAt: siteContentVersions.createdAt,
        })
        .from(siteContentVersions)
        .orderBy(desc(siteContentVersions.createdAt))
        .limit(100),
    ]);
    return NextResponse.json({ keys: contentKeys, records, versions });
  } catch {
    return jsonError("Content unavailable", 503);
  }
}
