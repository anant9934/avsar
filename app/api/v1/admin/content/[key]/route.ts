import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { audit, siteContent, siteContentVersions } from "@/db/schema";
import { currentUser, isAdmin, validOrigin } from "@/lib/auth";
import { jsonError, parseBody } from "@/lib/api";
import { contentSchemas, type ContentKey } from "@/lib/site-content";
const requestSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("save"), body: z.unknown() }),
  z.object({
    action: z.literal("publish"),
    version: z.number().int().positive(),
  }),
  z.object({
    action: z.literal("restore"),
    version: z.number().int().positive(),
  }),
]);
export async function POST(
  req: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  if (!(await validOrigin())) return jsonError("Invalid origin", 403);
  const actor = await currentUser().catch(() => null);
  if (!isAdmin(actor) || actor?.role !== "super_admin")
    return jsonError("Forbidden", 403);
  const { key } = await params;
  if (!(key in contentSchemas))
    return jsonError("Unknown content section", 404);
  const input = requestSchema.safeParse(await parseBody(req));
  if (!input.success) return jsonError("Invalid content action");
  let body: unknown = null;
  if (input.data.action === "save") {
    const parsed = contentSchemas[key as ContentKey].safeParse(input.data.body);
    if (!parsed.success)
      return jsonError(
        "Invalid content fields. Use plain text and safe links.",
      );
    body = parsed.data;
  }
  try {
    const result = await db().transaction(async (tx) => {
      await tx.insert(siteContent).values({ key }).onConflictDoNothing();
      const [record] = await tx
        .select()
        .from(siteContent)
        .where(eq(siteContent.key, key))
        .for("update")
        .limit(1);
      if (input.data.action === "publish") {
        const [version] = await tx
          .select()
          .from(siteContentVersions)
          .where(
            and(
              eq(siteContentVersions.key, key),
              eq(siteContentVersions.version, input.data.version),
            ),
          )
          .limit(1);
        if (!version) return { error: "Version not found", status: 404 };
        await tx
          .update(siteContent)
          .set({ publishedVersion: version.version, updatedAt: new Date() })
          .where(eq(siteContent.key, key));
        await tx.insert(audit).values({
          actorId: actor!.id,
          action: "content_publish",
          targetType: key,
          targetId: version.id,
          detail: { version: version.version },
        });
        return { version: version.version };
      }
      if (input.data.action === "restore") {
        const [source] = await tx
          .select()
          .from(siteContentVersions)
          .where(
            and(
              eq(siteContentVersions.key, key),
              eq(siteContentVersions.version, input.data.version),
            ),
          )
          .limit(1);
        if (!source) return { error: "Version not found", status: 404 };
        body = source.body;
      }
      const next = record.latestVersion + 1;
      const [version] = await tx
        .insert(siteContentVersions)
        .values({
          key,
          version: next,
          state: "draft",
          body: body!,
          actorId: actor!.id,
        })
        .returning({ id: siteContentVersions.id });
      await tx
        .update(siteContent)
        .set({ latestVersion: next, updatedAt: new Date() })
        .where(eq(siteContent.key, key));
      await tx.insert(audit).values({
        actorId: actor!.id,
        action:
          input.data.action === "restore"
            ? "content_restore_draft"
            : "content_save_draft",
        targetType: key,
        targetId: version.id,
        detail: { version: next },
      });
      return { version: next };
    });
    return "error" in result
      ? jsonError(result.error!, result.status)
      : NextResponse.json(result);
  } catch {
    return jsonError("Content update failed", 503);
  }
}
