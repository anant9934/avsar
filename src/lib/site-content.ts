import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { siteContent, siteContentVersions } from "@/db/schema";
const plain = z
  .string()
  .trim()
  .min(1)
  .max(800)
  .refine((x) => !/[<>]/.test(x), "HTML is not allowed");
const url = z
  .string()
  .max(2048)
  .refine((x) => {
    if (/^\/[A-Za-z0-9/_?&=#.%-]*$/.test(x)) return true;
    try {
      const parsed = new URL(x);
      return (
        parsed.protocol === "https:" && !parsed.username && !parsed.password
      );
    } catch {
      return false;
    }
  }, "Use a relative URL or HTTPS URL");
export const contentSchemas = {
  hero: z.object({
    eyebrow: plain,
    title: plain,
    subtitle: plain,
    description: plain,
  }),
  announcement: z.object({ text: plain, href: url }),
  categories: z.object({ descriptions: z.record(z.string(), plain) }),
  ecosystem: z.object({ descriptions: z.record(z.string(), plain) }),
  resources: z.object({
    articles: z
      .array(
        z.object({
          title: plain,
          body: z
            .string()
            .trim()
            .min(30)
            .max(4000)
            .refine((x) => !/[<>]/.test(x)),
        }),
      )
      .max(20),
  }),
  faq: z.object({
    jobseekers: z.array(z.object({ question: plain, answer: plain })).max(30),
    employers: z.array(z.object({ question: plain, answer: plain })).max(30),
  }),
  pricing_copy: z.object({ intro: plain }),
  featured: z.object({ listingIds: z.array(z.uuid()).max(12) }),
  partner_logos: z.object({
    partners: z.array(z.object({ name: plain, href: url })).max(30),
  }),
  footer_links: z.object({
    links: z.array(z.object({ label: plain, href: url })).max(30),
  }),
} as const;
export type ContentKey = keyof typeof contentSchemas;
export const contentKeys = Object.keys(contentSchemas) as ContentKey[];
export async function publishedContent<K extends ContentKey>(
  key: K,
): Promise<z.infer<(typeof contentSchemas)[K]> | null> {
  try {
    const [row] = await db()
      .select({ body: siteContentVersions.body })
      .from(siteContent)
      .innerJoin(
        siteContentVersions,
        and(
          eq(siteContentVersions.key, siteContent.key),
          eq(siteContentVersions.version, siteContent.publishedVersion),
        ),
      )
      .where(eq(siteContent.key, key))
      .limit(1);
    if (!row) return null;
    const parsed = contentSchemas[key].safeParse(row.body);
    return parsed.success
      ? (parsed.data as z.infer<(typeof contentSchemas)[K]>)
      : null;
  } catch {
    return null;
  }
}
