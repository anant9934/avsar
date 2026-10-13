import { count, desc, eq, gte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  publicEvents,
  opportunities,
  organizations,
  applications,
} from "@/db/schema";
import { currentUser, isAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/api";
export async function GET() {
  try {
    const actor = await currentUser();
    if (!isAdmin(actor)) return jsonError("Forbidden", 403);
    const [events, published, approvedOrgs, submittedApps] = await Promise.all([
      db()
        .select({ kind: publicEvents.kind, total: count() })
        .from(publicEvents)
        .where(
          gte(publicEvents.createdAt, new Date(Date.now() - 30 * 24 * 3600000)),
        )
        .groupBy(publicEvents.kind)
        .orderBy(desc(count())),
      db()
        .select({ total: count() })
        .from(opportunities)
        .where(eq(opportunities.status, "published")),
      db()
        .select({ total: count() })
        .from(organizations)
        .where(eq(organizations.status, "approved")),
      db()
        .select({ total: count() })
        .from(applications)
        .where(eq(applications.status, "submitted")),
    ]);
    return NextResponse.json({
      window: "last 30 days for events",
      events,
      operational: {
        publishedListings: published[0].total,
        approvedOrganizations: approvedOrgs[0].total,
        submittedApplications: submittedApps[0].total,
      },
    });
  } catch {
    return jsonError("Analytics unavailable", 503);
  }
}
