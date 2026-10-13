import { jsonError } from "@/lib/api";

export async function POST() {
  // Never accept a browser-supplied subject, email, or token as link proof.
  return jsonError("Provider callback integration is not configured", 503);
}
