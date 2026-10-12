import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { entitlement } from "@/lib/entitlement";
import { jsonError } from "@/lib/api";
export async function GET() {
  try {
    const actor = await currentUser();
    if (!actor) return jsonError("Authentication required", 401);
    return NextResponse.json(await entitlement(actor));
  } catch {
    return jsonError("Entitlement unavailable", 503);
  }
}
