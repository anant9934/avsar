import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { organizations, opportunities, reports } from "@/db/schema";
import { currentUser, isAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/api";
export async function GET() {
  const actor = await currentUser();
  if (!isAdmin(actor)) return jsonError("Forbidden", 403);
  const [orgs, listings, approved, published, flags] = await Promise.all([
    db()
      .select()
      .from(organizations)
      .where(eq(organizations.status, "submitted")),
    db()
      .select({
        item: opportunities,
        organization: organizations.displayName,
        orgStatus: organizations.status,
      })
      .from(opportunities)
      .innerJoin(organizations, eq(opportunities.orgId, organizations.id))
      .where(eq(opportunities.status, "submitted")),
    db()
      .select({
        item: opportunities,
        organization: organizations.displayName,
        orgStatus: organizations.status,
      })
      .from(opportunities)
      .innerJoin(organizations, eq(opportunities.orgId, organizations.id))
      .where(eq(opportunities.status, "approved")),
    db()
      .select({
        item: opportunities,
        organization: organizations.displayName,
        orgStatus: organizations.status,
      })
      .from(opportunities)
      .innerJoin(organizations, eq(opportunities.orgId, organizations.id))
      .where(eq(opportunities.status, "published")),
    db().select().from(reports).where(eq(reports.status, "open")),
  ]);
  return NextResponse.json({
    organizations: orgs,
    opportunities: listings,
    approved,
    published,
    reports: flags,
  });
}
