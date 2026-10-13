import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { opportunities, organizations } from "@/db/schema";
import { visibleConditions } from "@/lib/opportunities";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.APP_ORIGIN || "http://localhost:3000";
  const paths = [
    "",
    "/opportunities",
    "/pricing",
    "/ecosystem",
    "/resources",
    "/for-employers",
    "/fair-access",
    "/trust-safety",
    "/how-it-works",
    "/help",
  ];
  const base = paths.map((path) => ({
    url: new URL(path || "/", origin).toString(),
    changeFrequency: "weekly" as const,
  }));
  try {
    const items = await db()
      .select({ id: opportunities.id, publishedAt: opportunities.publishedAt })
      .from(opportunities)
      .innerJoin(organizations, eq(opportunities.orgId, organizations.id))
      .where(visibleConditions())
      .limit(5000);
    return [
      ...base,
      ...items.map((x) => ({
        url: new URL(`/opportunities/${x.id}`, origin).toString(),
        lastModified: x.publishedAt || undefined,
        changeFrequency: "daily" as const,
      })),
    ];
  } catch {
    return base;
  }
}
