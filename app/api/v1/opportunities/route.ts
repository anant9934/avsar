import { NextResponse } from "next/server";
import { searchOpportunities } from "@/lib/opportunities";
import { demoMode } from "@/lib/demo-opportunities";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    return NextResponse.json(
      { ...(await searchOpportunities(new URL(req.url).searchParams)), demo: demoMode },
      { headers: { "Cache-Control": "public, max-age=15" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Search is temporarily unavailable" },
      { status: 503 },
    );
  }
}
