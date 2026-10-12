import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { organizations, opportunities } from "@/db/schema";
export const dynamic = "force-dynamic";
export default async function Organization({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  let org;
  try {
    [org] = await db()
      .select({
        id: organizations.id,
        displayName: organizations.displayName,
        website: organizations.website,
        category: organizations.category,
      })
      .from(organizations)
      .where(
        and(eq(organizations.id, id), eq(organizations.status, "approved")),
      )
      .limit(1);
  } catch {
    throw new Error("Organization service unavailable");
  }
  if (!org) notFound();
  const listings = await db()
    .select({
      id: opportunities.id,
      title: opportunities.title,
      type: opportunities.type,
    })
    .from(opportunities)
    .where(
      and(
        eq(opportunities.orgId, id),
        eq(opportunities.status, "published"),
        eq(opportunities.approvedVersion, opportunities.version),
      ),
    );
  return (
    <>
      <div className="route-head">
        <div className="container">
          <span className="eyebrow">APPROVED ORGANIZATION</span>
          <h1>{org.displayName}</h1>
          <p>
            {org.category}. Organization identity was reviewed separately from
            each listing.
          </p>
        </div>
      </div>
      <div className="container info-layout">
        <div className="panel">
          <h2>Current opportunities</h2>
          {listings.length ? (
            listings.map((x) => (
              <p key={x.id}>
                <Link className="text-link" href={`/opportunities/${x.id}`}>
                  {x.title} · {x.type} ↗
                </Link>
              </p>
            ))
          ) : (
            <p>No active opportunities.</p>
          )}
        </div>
        <aside className="panel">
          <h2>Original website</h2>
          <a
            className="text-link"
            href={org.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit official website ↗
          </a>
          <p>
            Approval is a review decision, not a guarantee of all employer
            conduct.
          </p>
        </aside>
      </div>
    </>
  );
}
