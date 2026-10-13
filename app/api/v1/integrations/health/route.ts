import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    enabled: false,
    authMode: "provider_linking_unavailable",
    core: "not_configured",
    collaborate: "not_configured",
    eris: "not_configured",
    connect: "not_configured",
    aiLearning: "not_configured",
    eora: "not_configured",
    payments: "not_configured",
  });
}
