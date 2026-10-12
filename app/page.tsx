import Link from "next/link";
import { searchOpportunities } from "@/lib/opportunities";
export const dynamic = "force-dynamic";
export default async function Home() {
  let latest: Awaited<ReturnType<typeof searchOpportunities>> | null = null;
  try {
    latest = await searchOpportunities(new URLSearchParams());
  } catch {}
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">
              ACCESS · VERIFICATION · SKILLS · ADVANCEMENT · RECRUITMENT
            </div>
            <h1>
              Every opportunity.
              <br />
              <span>A fair chance.</span>
            </h1>
            <p>
              Discover genuine jobs, internships, research and more. See what
              each opportunity asks for, who published it, and how to apply.
            </p>
            <form className="hero-search" action="/opportunities">
              <label className="sr-only" htmlFor="hero-q">
                Search opportunities
              </label>
              <input
                id="hero-q"
                name="q"
                placeholder="Job title, skill, or organization"
              />
              <button type="submit">Search ↗</button>
            </form>
            <div className="hero-links">
              <Link href="/opportunities">Explore opportunities ↗</Link>
              <Link href="/recruiter">I’m hiring →</Link>
            </div>
            <div className="trustline">
              <span>✓ Browse without an account</span>
              <span>◇ Admin reviewed listings</span>
              <span>♡ Fair access</span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="glow-orb">
              <span>✦</span>
            </div>
            <div className="float-note note-one">
              <small>DISCOVER</small>
              <strong>Career opportunities</strong>
              <p>Find a role worth exploring</p>
            </div>
            <div className="float-note note-two">
              <small>FAIR ACCESS</small>
              <strong>Clear requirements</strong>
              <p>Decide with confidence</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-title">
            <div>
              <span className="eyebrow">DISCOVER YOUR PATH</span>
              <h2>Where will you go next?</h2>
            </div>
            <p>
              Search across opportunities. Listings only appear after
              organization verification and platform review.
            </p>
          </div>
          <div className="category-grid">
            {[
              ["Jobs", "Job"],
              ["Internships", "Internship"],
              ["Research", "Research"],
              ["Scholarships", "Scholarship"],
              ["Fellowships", "Fellowship"],
              ["Hackathons", "Hackathon"],
              ["Events", "Event"],
            ].map(([label, type]) => (
              <Link
                className="category"
                key={type}
                href={`/opportunities?type=${type}`}
              >
                <span>✧</span>
                <strong>{label}</strong>
                <b>↗</b>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section warm">
        <div className="container">
          <div className="section-title">
            <div>
              <span className="eyebrow">RECENTLY PUBLISHED</span>
              <h2>Real opportunities, clearly presented.</h2>
            </div>
            <Link className="text-link" href="/opportunities">
              See all opportunities ↗
            </Link>
          </div>
          {latest?.items.length ? (
            <div className="cards">
              {latest.items.slice(0, 3).map((x) => (
                <Link
                  className="listing-card"
                  key={x.id}
                  href={`/opportunities/${x.id}`}
                >
                  <span className="pill">{x.type}</span>
                  <h3>{x.title}</h3>
                  <p>{x.organization}</p>
                  <div className="card-meta">
                    {x.location} · {x.mode}
                  </div>
                  <span className="card-link">View details ↗</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3>No approved listings yet</h3>
              <p>
                AVSAR displays real opportunities only after review. Check back
                as verified organizations publish.
              </p>
            </div>
          )}
        </div>
      </section>
      <section className="section">
        <div className="container feature-row">
          <div>
            <span className="eyebrow">HOW IT WORKS</span>
            <h2>Open discovery. Accountable publishing.</h2>
          </div>
          <p>
            Anyone can browse. Employers submit opportunities through an
            organization review process. Jobseeker saving and applications
            require secure AI Tathastu Core and Collaborate links, which will
            become available when both providers support verified federation.
          </p>
          <Link className="button-dark" href="/opportunities">
            Explore now ↗
          </Link>
        </div>
      </section>
    </>
  );
}
