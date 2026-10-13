import { createHmac } from "node:crypto";
import { db } from "@/db";
import { publicEvents } from "@/db/schema";
export const publicEventKinds = [
  "landing_viewed",
  "search_started",
  "filter_used",
  "listing_opened",
  "registration_initiated",
  "pricing_viewed",
  "employer_registration_initiated",
] as const;
export type PublicEventKind = (typeof publicEventKinds)[number];
export type OperationalEventKind =
  | "registration_completed"
  | "opportunity_saved"
  | "application_started"
  | "application_submitted"
  | "employer_verification_submitted"
  | "sales_inquiry_submitted";
export async function recordEvent(
  kind: PublicEventKind | OperationalEventKind,
  subject: string,
) {
  const secret = process.env.REPORT_HASH_SECRET;
  if (!secret) return;
  const day = new Date().toISOString().slice(0, 10);
  const visitorHash = createHmac("sha256", secret)
    .update(`${day}|${subject}`)
    .digest("hex");
  try {
    await db().insert(publicEvents).values({ kind, visitorHash });
  } catch {
    /* Telemetry must not break the primary action. */
  }
}
