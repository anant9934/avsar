import { NextResponse } from "next/server";
import { z } from "zod";
import { getPublicOpportunity } from "@/lib/opportunities";
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
      ? NextResponse.json(row, {
          headers: { "Cache-Control": "public, max-age=15" },
        })
      : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Listing unavailable" }, { status: 503 });
  }
}
