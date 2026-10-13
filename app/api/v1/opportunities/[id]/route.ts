import { NextResponse } from "next/server";
import { z } from "zod";
import { getPublicOpportunity } from "@/lib/opportunities";
import { demoMode } from "@/lib/demo-opportunities";
export const dynamic = "force-dynamic";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const row = await getPublicOpportunity(id);
    return row
      ? NextResponse.json({
          opportunity: {
            id: row.opportunity.id,
            title: row.opportunity.title,
            type: row.opportunity.type,
            description: row.opportunity.description,
            responsibilities: row.opportunity.responsibilities,
            requirements: row.opportunity.requirements,
            preferred: row.opportunity.preferred,
            location: row.opportunity.location,
            mode: row.opportunity.mode,
            employmentType: row.opportunity.employmentType,
            compensation: row.opportunity.compensation,
            duration: row.opportunity.duration,
            eligibility: row.opportunity.eligibility,
            deadline: row.opportunity.deadline,
            applicationMethod: row.opportunity.applicationMethod,
            applicationUrl: row.opportunity.applicationUrl,
            sourceUrl: row.opportunity.sourceUrl,
            sourceCheckedAt: row.opportunity.sourceCheckedAt,
            publishedAt: row.opportunity.publishedAt,
          },
          organization: {
            id: row.organization.id,
            displayName: row.organization.displayName,
            website: row.organization.website,
            category: row.organization.category,
          },
          demo: demoMode,
        }, {
          headers: { "Cache-Control": "public, max-age=15" },
        })
      : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Listing unavailable" }, { status: 503 });
  }
}
