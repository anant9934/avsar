import { jsonError } from "@/lib/api";
import { validOrigin } from "@/lib/auth";

export async function POST() {
  if (!(await validOrigin())) return jsonError("Invalid request origin", 403);
  // A provider authorization URL must come from a verified server adapter.
  return jsonError(
    "Core and Collaborate account linking is not available yet",
    503,
  );
}
