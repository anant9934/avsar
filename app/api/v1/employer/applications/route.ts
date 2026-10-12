import { NextResponse } from "next/server";
import { and, eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { applications, opportunities, organizations } from "@/db/schema";
import { currentUser } from "@/lib/auth";
import { jsonError } from "@/lib/api";
export async function GET() {
  try {
    const actor = await currentUser();
    if (!actor || actor.role !== "recruiter")
      return jsonError("Forbidden", 403);
    const items = await db()
      .select({
        application: applications,
        opportunityTitle: opportunities.title,
        organizationId: organizations.id,
      })
      .from(applications)
      .innerJoin(
        opportunities,
        eq(applications.opportunityId, opportunities.id),
      )
      .innerJoin(organizations, eq(opportunities.orgId, organizations.id))
      .where(
        and(
          eq(organizations.ownerId, actor.id),
          eq(organizations.status, "approved"),
        ),
      )
      .orderBy(desc(applications.submittedAt));
    return NextResponse.json({
      items: items.filter((x) => x.application.status !== "draft"),
    });
  } catch {
    return jsonError("Applicant queue unavailable", 503);
  }
}
