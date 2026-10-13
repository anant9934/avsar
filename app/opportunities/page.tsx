import Link from "next/link";
import type { Metadata } from "next";
import { searchOpportunities } from "@/lib/opportunities";
import { EventPing } from "@/components/EventPing";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Find Opportunities | AVSAR",
  description:
    "Search reviewed jobs, internships, research positions and other public opportunities on AVSAR.",
};
type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export default async function Opportunities({ searchParams }: Props) {
  const raw = await searchParams;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(raw))
    if (typeof v === "string") params.set(k, v);
  let data: Awaited<ReturnType<typeof searchOpportunities>> | null = null;
  try {
    data = await searchOpportunities(params);
  } catch {}
  const page = data?.page || 1;
  const next = new URLSearchParams(params);
  next.set("page", String(page + 1));
  const prev = new URLSearchParams(params);
  prev.set("page", String(page - 1));
  return (
    <>
      {params.get("q") && <EventPing kind="search_started" />}
      {(params.get("type") || params.get("mode") || params.get("location")) && (
        <EventPing kind="filter_used" />
      )}
      <div className="route-head">
        <div className="container">
          <span className="eyebrow">THE OPPORTUNITY MARKETPLACE</span>
          <h1>Find your next opening.</h1>
          <p>
            Search public listings freely. Each active result passed
            organization and listing review.
          </p>
        </div>
      </div>
      <div className="container search-layout">
        <aside className="filter-panel">
          <h2>Refine results</h2>
          <form action="/opportunities">
            <label>
              Keyword
              <input
                name="q"
                defaultValue={params.get("q") || ""}
                placeholder="Role, skill, organization"
              />
            </label>
            <label>
              Category
              <select name="type" defaultValue={params.get("type") || ""}>
                <option value="">All categories</option>
                {[
                  "Job",
                  "Internship",
                  "Research",
                  "Scholarship",
                  "Fellowship",
                  "Hackathon",
                  "Event",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Work mode
              <select name="mode" defaultValue={params.get("mode") || ""}>
                <option value="">Any mode</option>
                {["Remote", "Hybrid", "Onsite"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Location
              <input
                name="location"
                defaultValue={params.get("location") || ""}
                placeholder="City or remote"
              />
            </label>
            <label>
              Sort
              <select name="sort" defaultValue={params.get("sort") || "newest"}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
            <button type="submit">Apply filters</button>
            <Link className="clear-link" href="/opportunities">
              Clear filters
            </Link>
          </form>
        </aside>
        <section className="results" aria-live="polite">
          <div className="results-top">
            <h2>
              {data ? `${data.total} opportunities` : "Search unavailable"}
            </h2>
            <span>Page {page}</span>
          </div>
          {data?.items.length ? (
            data.items.map((x) => (
              <Link
                href={`/opportunities/${x.id}?${params}`}
                className="result-card"
                key={x.id}
              >
                <div>
                  <span className="pill">{x.type}</span>
                  <span className="result-mode">{x.mode}</span>
                </div>
                <h3>{x.title}</h3>
                <p className="org-name">
                  {x.organization} · {x.location}
                </p>
                <p className="summary">
                  {x.description.slice(0, 220)}
                  {x.description.length > 220 ? "…" : ""}
                </p>
                <div className="result-footer">
                  <span>{x.compensation || "Compensation not specified"}</span>
                  <b>View details ↗</b>
                </div>
              </Link>
            ))
          ) : (
            <div className="empty">
              <h3>
                {data
                  ? "No matching opportunities"
                  : "The database is not available"}
              </h3>
              <p>
                {data
                  ? "Try a broader search or clear your filters."
                  : "Please try again after the service is configured or restored."}
              </p>
            </div>
          )}
          <nav className="pagination" aria-label="Results pages">
            {page > 1 && (
              <Link href={`/opportunities?${prev}`}>← Previous</Link>
            )}
            {data && page * data.pageSize < data.total && (
              <Link href={`/opportunities?${next}`}>Next →</Link>
            )}
          </nav>
        </section>
      </div>
    </>
  );
}
