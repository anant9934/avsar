import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getPublicOpportunity } from "@/lib/opportunities";
import { ReportForm } from "@/components/ReportForm";
import { EventPing } from "@/components/EventPing";
import { OpportunityActions } from "@/components/OpportunityActions";
import { federationReady } from "@/modules/identity/providers";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) return {};
  try {
    const row = await getPublicOpportunity(id);
    if (!row) return {};
    const origin = process.env.APP_ORIGIN || "http://localhost:3000";
    return {
      title: `${row.opportunity.title} at ${row.organization.displayName} | AVSAR`,
      description: row.opportunity.description.slice(0, 155),
      alternates: {
        canonical: new URL(`/opportunities/${id}`, origin).toString(),
      },
    };
  } catch {
    return {};
  }
}

export default async function OpportunityDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const rawFilters = await searchParams;
  const retained = new URLSearchParams();
  for (const key of ["q", "location", "type", "mode", "sort", "page"]) {
    const value = rawFilters[key];
    if (typeof value === "string" && value.length <= 100)
      retained.set(key, value);
  }
  if (!z.uuid().safeParse(id).success) notFound();
  let row: Awaited<ReturnType<typeof getPublicOpportunity>>;
  try {
    row = await getPublicOpportunity(id);
  } catch {
    throw new Error("Listing service unavailable");
  }
  if (!row) notFound();
  const { opportunity: o, organization: g } = row;
  const jobPosting =
    o.type === "Job"
      ? {
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title: o.title,
          description: `${o.description}\n\nResponsibilities: ${o.responsibilities}\n\nRequirements: ${o.requirements}`,
          datePosted: o.publishedAt?.toISOString(),
          ...(o.deadline ? { validThrough: o.deadline.toISOString() } : {}),
          hiringOrganization: {
            "@type": "Organization",
            name: g.displayName,
            sameAs: g.website,
          },
          jobLocationType: o.mode === "Remote" ? "TELECOMMUTE" : undefined,
          employmentType: o.employmentType || undefined,
          identifier: { "@type": "PropertyValue", name: "AVSAR", value: o.id },
        }
      : null;
  return (
    <div className="container detail-layout">
      <EventPing kind="listing_opened" />
      {jobPosting && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jobPosting).replaceAll("<", "\\u003c"),
          }}
        />
      )}
      <div>
        <Link className="back-link" href={`/opportunities?${retained}`}>
          ← Back to opportunities
        </Link>
        <article className="detail">
          <span className="eyebrow">
            {o.type.toUpperCase()} · {o.mode.toUpperCase()}
          </span>
          <h1>{o.title}</h1>
          <p className="detail-org">
            <Link className="text-link" href={`/organizations/${g.id}`}>
              {g.displayName}
            </Link>{" "}
            · {o.location}
          </p>
          <div className="detail-pills">
            <span className="pill">Organization approved</span>
            <span className="pill">Listing reviewed</span>
            <span className="pill">
              {o.compensation || "Compensation not specified"}
            </span>
          </div>
          <section>
            <h2>About the opportunity</h2>
            <p>{o.description}</p>
          </section>
          <section>
            <h2>Responsibilities</h2>
            <p>{o.responsibilities}</p>
          </section>
          <section>
            <h2>Required qualifications</h2>
            <p>{o.requirements}</p>
          </section>
          {o.preferred && (
            <section>
              <h2>Preferred qualifications</h2>
              <p>{o.preferred}</p>
            </section>
          )}
          <section>
            <h2>Eligibility</h2>
            <p>{o.eligibility}</p>
          </section>
          <section>
            <h2>Source and verification</h2>
            <p>
              Published{" "}
              {o.publishedAt?.toLocaleDateString("en-IN") || "date unavailable"}
              . Organization approval and listing review are separate checks.{" "}
              {o.sourceCheckedAt
                ? `Source last checked ${o.sourceCheckedAt.toLocaleDateString("en-IN")}.`
                : "External source freshness has not been confirmed."}
            </p>
            {o.sourceUrl && (
              <a
                className="text-link"
                href={o.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Original source ↗
              </a>
            )}
          </section>
        </article>
      </div>
      <aside className="detail-side">
        <h2>Interested in this opportunity?</h2>
        <p>
          {o.deadline
            ? `Apply by ${o.deadline.toLocaleDateString("en-IN")}.`
            : "No deadline was supplied."}
        </p>
        {o.applicationMethod === "external" && o.applicationUrl ? (
          <>
            <a
              className="button-dark"
              href={o.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open original application ↗
            </a>
            <small>
              Opening the employer’s site does not submit or track an
              application on AVSAR.
            </small>
          </>
        ) : null}
        <OpportunityActions
          id={o.id}
          internal={o.applicationMethod === "internal"}
          enabled={federationReady()}
        />
        <p>
          <Link className="text-link" href="/me">
            Learn about saving and applying with AVSAR →
          </Link>
        </p>
        <div className="side-separator" />
        <h3>Report a concern</h3>
        <p>
          Tell our review team about suspicious fees, impersonation or
          misleading details.
        </p>
        <ReportForm opportunityId={o.id} />
      </aside>
    </div>
  );
}
