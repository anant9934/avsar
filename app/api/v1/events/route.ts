import { and, count, eq, gt } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { publicEvents } from "@/db/schema";
import { validOrigin } from "@/lib/auth";
import { jsonError, parseBody } from "@/lib/api";
import { publicEventKinds, recordEvent } from "@/lib/analytics";
const schema = z.object({ kind: z.enum(publicEventKinds) });
export async function POST(req: Request) {
  if (!(await validOrigin())) return jsonError("Invalid origin", 403);
  const parsed = schema.safeParse(await parseBody(req));
  if (!parsed.success) return jsonError("Invalid event");
  const ip =
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown";
  try {
    const [recent] = await db()
      .select({ value: count() })
      .from(publicEvents)
      .where(
        and(
          eq(publicEvents.kind, parsed.data.kind),
          gt(publicEvents.createdAt, new Date(Date.now() - 60000)),
        ),
      );
    if (recent.value > 5000) return jsonError("Telemetry busy", 429);
    await recordEvent(parsed.data.kind, ip);
    return new Response(null, { status: 204 });
  } catch {
    return jsonError("Telemetry unavailable", 503);
  }
}
