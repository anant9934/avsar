import {
  and,
  eq,
  gt,
  isNull,
  or,
  ilike,
  desc,
  asc,
  count,
  SQL,
  isNotNull,
} from "drizzle-orm";
import { db } from "@/db";
import { opportunities, organizations } from "@/db/schema";
import {
  demoMode,
  getDemoOpportunity,
  searchDemoOpportunities,
} from "@/lib/demo-opportunities";
export function visibleConditions() {
  return and(
    eq(opportunities.status, "published"),
    eq(organizations.status, "approved"),
    eq(opportunities.approvedVersion, opportunities.version),
    or(isNull(opportunities.deadline), gt(opportunities.deadline, new Date())),
  )!;
}
export function searchConditions(params: URLSearchParams) {
  const clauses: SQL[] = [visibleConditions()];
  const q = params.get("q")?.trim().slice(0, 100);
  if (q) {
    const pattern = `%${q.replace(/[\\%_]/g, "\\$&")}%`;
    clauses.push(
      or(
        ilike(opportunities.title, pattern),
        ilike(opportunities.description, pattern),
        ilike(opportunities.requirements, pattern),
        ilike(organizations.displayName, pattern),
      )!,
    );
  }
  const type = params.get("type");
  if (type) clauses.push(eq(opportunities.type, type));
  const mode = params.get("mode");
  if (mode) clauses.push(eq(opportunities.mode, mode));
  const location = params.get("location")?.trim().slice(0, 100);
  if (location)
    clauses.push(
      ilike(opportunities.location, `%${location.replace(/[\\%_]/g, "\\$&")}%`),
    );
  if (params.get("sort") === "closing")
    clauses.push(isNotNull(opportunities.deadline));
  return and(...clauses)!;
}
export async function searchOpportunities(params: URLSearchParams) {
  if (demoMode) return searchDemoOpportunities(params);
  const page = Math.max(1, Math.min(10000, Number(params.get("page")) || 1));
  const size = 12;
  const where = searchConditions(params);
  const order =
    params.get("sort") === "closing"
      ? asc(opportunities.deadline)
      : params.get("sort") === "oldest"
        ? asc(opportunities.publishedAt)
        : desc(opportunities.publishedAt);
  const [items, total] = await Promise.all([
    db()
      .select({
        id: opportunities.id,
        title: opportunities.title,
        type: opportunities.type,
        description: opportunities.description,
        requirements: opportunities.requirements,
        location: opportunities.location,
        mode: opportunities.mode,
        compensation: opportunities.compensation,
        deadline: opportunities.deadline,
        publishedAt: opportunities.publishedAt,
        organization: organizations.displayName,
        organizationId: organizations.id,
      })
      .from(opportunities)
      .innerJoin(organizations, eq(opportunities.orgId, organizations.id))
      .where(where)
      .orderBy(order, desc(opportunities.id))
      .limit(size)
      .offset((page - 1) * size),
    db()
      .select({ value: count() })
      .from(opportunities)
      .innerJoin(organizations, eq(opportunities.orgId, organizations.id))
      .where(where),
  ]);
  return { items, total: total[0]?.value || 0, page, pageSize: size };
}
export async function getPublicOpportunity(id: string) {
  if (demoMode) return getDemoOpportunity(id);
  const [row] = await db()
    .select({ opportunity: opportunities, organization: organizations })
    .from(opportunities)
    .innerJoin(organizations, eq(opportunities.orgId, organizations.id))
    .where(and(eq(opportunities.id, id), visibleConditions()))
    .limit(1);
  if (!row || row.opportunity.approvedVersion !== row.opportunity.version)
    return null;
  return row;
}
