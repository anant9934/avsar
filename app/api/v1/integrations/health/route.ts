import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    core: "not_configured",
    collaborate: "not_configured",
    eris: "not_configured",
    connect: "not_configured",
    aiLearning: "not_configured",
    eora: "not_configured",
    payments: "not_configured",
  });
}
