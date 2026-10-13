import Link from "next/link";
import { searchOpportunities, getPublicOpportunity } from "@/lib/opportunities";
import { publishedContent } from "@/lib/site-content";
import { getPublicPlans } from "@/lib/plans";
import {
  categories,
  categoryHref,
  products,
  productHref,
} from "@/lib/public-content";
import { FeaturedTabs, type FeaturedItem } from "@/components/FeaturedTabs";
import { FaqTabs, JourneyTabs, PreviewTabs } from "@/components/PublicTabs";
import { EventPing } from "@/components/EventPing";
import { demoMode } from "@/lib/demo-opportunities";

export const dynamic = "force-dynamic";
const section = (eyebrow: string, title: string, description?: string) => (
  <div className="section-title">
    <div>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
    </div>
    {description && <p>{description}</p>}
  </div>
);
const features = [
  [
    "Reviewed Opportunities",
    "Published listings pass AVSAR's organization and listing review process.",
  ],
  [
    "Clear Requirements",
    "Read eligibility, responsibilities and application details before acting.",
  ],
  [
    "Fair Access",
    "Browse freely and review each publisher's application destination.",
  ],
  [
    "Organized Applications",
    "Saving and internal application tracking are planned after verified account linking.",
  ],
  [
    "Professional Profiles",
    "Present your experience and skills in applications. A richer profile workspace is planned.",
  ],
  [
    "Connected Career Tools",
    "Optional AI Tathastu preparation and assessment connections are planned, not active.",
  ],
];
const resources = [
  [
    "Build a clearer CV",
    "Lead with relevant work, quantify what you did, and tailor your evidence to the role.",
  ],
  [
    "Prepare for an internship",
    "Read the duties, confirm the dates and stipend, then prepare examples of work you can discuss.",
  ],
  [
    "Understand eligibility",
    "Separate required qualifications from preferences. Ask the publisher when a condition is unclear.",
  ],
  [
    "Prepare for interviews",
    "Practice explaining decisions, tradeoffs and your own contribution to a project.",
  ],
  [
    "Spot suspicious postings",
    "Be cautious about payment requests, unverifiable domains and requests for sensitive documents too early.",
  ],
  [
    "Apply for research",
    "Read the project scope, cite relevant methods and describe the specific contribution you hope to make.",
  ],
];
export default async function Home() {
  const planPromise = getPublicPlans();
  const [
    heroContent,
    categoryContent,
    ecosystemContent,
    resourceContent,
    faqContent,
    pricingContent,
    announcement,
    featuredContent,
    partnersContent,
  ] = await Promise.all(
    [
      "hero",
      "categories",
      "ecosystem",
      "resources",
      "faq",
      "pricing_copy",
      "announcement",
      "featured",
      "partner_logos",
    ].map((key) =>
      publishedContent(
        key as
          | "hero"
          | "categories"
          | "ecosystem"
          | "resources"
          | "faq"
          | "pricing_copy"
          | "announcement",
      ),
    ),
  );
  const hero = heroContent as Awaited<
    ReturnType<typeof publishedContent<"hero">>
  >;
  const categoryCopy = categoryContent as Awaited<
    ReturnType<typeof publishedContent<"categories">>
  >;
  const ecosystemCopy = ecosystemContent as Awaited<
    ReturnType<typeof publishedContent<"ecosystem">>
  >;
  const resourceCopy = resourceContent as Awaited<
    ReturnType<typeof publishedContent<"resources">>
  >;
  const faqCopy = faqContent as Awaited<
    ReturnType<typeof publishedContent<"faq">>
  >;
  const pricingCopy = pricingContent as Awaited<
    ReturnType<typeof publishedContent<"pricing_copy">>
  >;
  const notice = announcement as Awaited<
    ReturnType<typeof publishedContent<"announcement">>
  >;
  const curated = featuredContent as Awaited<
    ReturnType<typeof publishedContent<"featured">>
  >;
  const partners = partnersContent as Awaited<
    ReturnType<typeof publishedContent<"partner_logos">>
  >;
  const filters = [
    new URLSearchParams({ type: "Job" }),
    new URLSearchParams({ type: "Internship" }),
    new URLSearchParams({ mode: "Remote" }),
    new URLSearchParams({ type: "Research" }),
    new URLSearchParams({ sort: "closing" }),
  ];
  const results = await Promise.all(
    filters.map((filter) => searchOpportunities(filter).catch(() => null)),
  );
  const approvedPlans = await planPromise;
  const labels = [
    "Latest Jobs",
    "Internships",
    "Remote",
    "Research",
    "Closing Soon",
  ];
  const groups: Record<string, FeaturedItem[]> = {};
  labels.forEach((label, i) => {
    groups[label] = (results[i]?.items || []).map((item) => ({
      ...item,
      deadline: item.deadline?.toISOString() || null,
    }));
  });
  if (curated?.listingIds.length) {
    const pinned = await Promise.all(
      curated.listingIds.map((id) =>
        getPublicOpportunity(id).catch(() => null),
      ),
    );
    const active = pinned
      .filter((x): x is NonNullable<typeof x> => !!x)
      .map(({ opportunity: o, organization: g }) => ({
        id: o.id,
        title: o.title,
        organization: g.displayName,
        location: o.location,
        mode: o.mode,
        type: o.type,
        requirements: o.requirements,
        compensation: o.compensation,
        deadline: o.deadline?.toISOString() || null,
      }));
    for (const label of labels) {
      const match = active.filter((x) =>
        label === "Latest Jobs"
          ? x.type === "Job"
          : label === "Internships"
            ? x.type === "Internship"
            : label === "Remote"
              ? x.mode === "Remote"
              : label === "Research"
                ? x.type === "Research"
                : !!x.deadline,
      );
      groups[label] = [
        ...match,
        ...groups[label].filter((x) => !match.some((p) => p.id === x.id)),
      ];
    }
  }
  return (
    <>
      <EventPing kind="landing_viewed" />
      {notice && (
        <div className="site-announcement">
          <div className="container">
            {notice.text} <Link href={notice.href}>Learn more ↗</Link>
          </div>
        </div>
      )}
      <section className="hero landing-hero">
        <div className="container landing-hero-inner">
          <span className="eyebrow">
            {hero?.eyebrow || "YOUR NEXT OPPORTUNITY STARTS HERE"}
          </span>
          <h1>
            {hero?.title || (
              <>
                Every Opportunity.
                <br />
                <span>A Fair Chance.</span>
              </>
            )}
          </h1>
          <h2>
            {hero?.subtitle ||
              "Find the right opportunity. Take the next step."}
          </h2>
          <p>
            {hero?.description ||
              "Discover jobs, internships, research openings, scholarships and more. Explore trusted listings, understand their requirements and move forward with confidence."}
          </p>
          <div className="hero-links">
            <Link className="hero-primary" href="/opportunities">
              Find Opportunities ↗
            </Link>
            <Link href="/register">Post an Opportunity →</Link>
          </div>
          <form className="landing-search" action="/opportunities">
            <label>
              <span>WHAT</span>
              <input name="q" placeholder="Role, skill, company or keyword" />
            </label>
            <label>
              <span>WHERE</span>
              <input name="location" placeholder="City or location" />
            </label>
            <label>
              <span>CATEGORY</span>
              <select name="type" defaultValue="">
                <option value="">All opportunities</option>
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
            <button type="submit">Search Opportunities ↗</button>
          </form>
          <div className="quick-search">
            <span>POPULAR SEARCHES</span>
            {[
              ["AI/ML Internships", "/opportunities?type=Internship&q=AI"],
              ["Fresher Jobs", "/opportunities?type=Job&q=fresher"],
              ["Remote Opportunities", "/opportunities?mode=Remote"],
              ["Research Roles", "/opportunities?type=Research"],
            ].map(([label, href]) => (
              <Link href={href} key={label}>
                {label} ↗
              </Link>
            ))}
          </div>
          <p className="hero-footnote">
            Free to explore. No account required to browse.
          </p>
        </div>
      </section>
      <section className="section" id="categories">
        <div className="container">
          {section(
            "EXPLORE BY CATEGORY",
            "Whatever your ambition, there's a place to begin.",
            "Explore opportunities across careers, education, research and innovation.",
          )}
          <div className="category-grid category-grid-v2">
            {categories.map((item) => (
              <Link
                className="category category-v2"
                key={item.name}
                href={categoryHref(item)}
              >
                <span aria-hidden="true">{item.icon}</span>
                <strong>{item.name}</strong>
                <small>
                  {categoryCopy?.descriptions[item.name] || item.description}
                </small>
                <b>Explore ↗</b>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section warm" id="featured">
        <div className="container">
          {section(
            "CURRENT OPENINGS",
            "Explore opportunities worth your attention.",
            demoMode
              ? "Explore fictional examples in this development or preview build. No applications are accepted."
              : "Browse current openings from approved publishers and review the information before you apply.",
          )}
          <FeaturedTabs groups={groups} available={results.some(Boolean)} demo={demoMode} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          {section("WHY AVSAR", "More than a listing. A clearer way forward.")}
          <div className="value-grid">
            {features.map(([title, copy], i) => (
              <article className="value-card" key={title}>
                <span className="value-number">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section dark-band" id="how-it-works">
        <div className="container">
          {section(
            "HOW IT WORKS",
            "A clear path for both sides.",
            "Recruiters need organization verification and Admin approval before publication.",
          )}
          <JourneyTabs />
        </div>
      </section>
      <section className="section" id="ecosystem">
        <div className="container">
          {section(
            "AI TATHASTU ECOSYSTEM",
            "One vision. More ways to grow.",
            "Public browsing stands on its own. Jobseeker actions require Core and Collaborate identity links; those integrations are not active yet.",
          )}
          <div className="ecosystem-grid">
            {products.map((item) => (
              <article className="ecosystem-card" key={item.key}>
                <span className="eyebrow">{item.category}</span>
                <h3>{item.name}</h3>
                <strong>{item.purpose}</strong>
                <p>
                  {ecosystemCopy?.descriptions[item.key] || item.description}
                </p>
                <div className="chip-row">
                  {item.features.map((feature) => (
                    <span key={feature}>{feature}</span>
                  ))}
                </div>
                <span className="status-label">
                  {item.key === "AVSAR"
                    ? "AVSAR prelaunch"
                    : productHref(item.key)
                      ? "Official URL configured · AVSAR integration unavailable"
                      : "Official URL not configured"}
                </span>
                {productHref(item.key) ? (
                  <a
                    className="text-link"
                    href={productHref(item.key)!}
                    target={item.key === "AVSAR" ? undefined : "_blank"}
                    rel={
                      item.key === "AVSAR" ? undefined : "noopener noreferrer"
                    }
                  >
                    Explore Product ↗
                  </a>
                ) : (
                  <span className="muted-action">Explore link unavailable</span>
                )}
              </article>
            ))}
          </div>
          <p className="section-end">
            <Link className="text-link" href="/ecosystem">
              Explore the ecosystem directory ↗
            </Link>
          </p>
        </div>
      </section>
      {partners?.partners.length ? (
        <section className="partners-strip">
          <div className="container">
            <span className="eyebrow">APPROVED PARTNERS</span>
            <div>
              {partners.partners.map((partner) => (
                <a
                  href={partner.href}
                  key={partner.name}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {partner.name} ↗
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <section className="section warm" id="preview">
        <div className="container">
          {section(
            "PLATFORM PREVIEW",
            "See how AVSAR works.",
            "A closer look at discovery, private workspaces and review. Previews are illustrative.",
          )}
          <PreviewTabs />
        </div>
      </section>
      <section className="section" id="pricing">
        <div className="container">
          {section(
            "EMPLOYER PRICING",
            "Simple plans for better hiring.",
            pricingCopy?.intro ||
              "Start with essential recruitment tools and choose more capacity as your team grows.",
          )}
          <p className="honest-note">
            Paid prices and capacities are proposed. Paid checkout, billing and
            subscriptions are not active.
          </p>
          <div className="pricing-grid">
            {approvedPlans.map((plan) => (
              <article className="pricing-card" key={plan.name}>
                <span className="eyebrow">{plan.status}</span>
                <h3>{plan.name}</h3>
                <div className="price">{plan.price}</div>
                <ul>
                  <li>{plan.listings}</li>
                  <li>{plan.seats}</li>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Link className="button-dark" href={plan.href}>
                  {plan.action} ↗
                </Link>
              </article>
            ))}
          </div>
          <p className="section-end">
            Jobseekers can browse opportunities for free. Internal AVSAR applications are not active yet.{" "}
            <Link className="text-link" href="/pricing">
              Compare All Plans ↗
            </Link>
          </p>
        </div>
      </section>
      <section className="section warm">
        <div className="container split-info">
          <div>
            <span className="eyebrow">FAIR PRICING</span>
            <h2>Opportunity access stays open.</h2>
            <p>
              Public browsing is free. Future standard applications, saves and
              tracking will be free after verified identity linking. There is
              no payment for recruitment priority.
            </p>
            <Link className="text-link" href="/pricing">
              Review full pricing ↗
            </Link>
          </div>
          <div className="panel">
            <h3>Employers fund hiring tools</h3>
            <p>
              Proposed employer plans cover posting capacity, seats and optional
              advanced workflows. Verification and candidate ranking cannot be
              purchased.
            </p>
          </div>
        </div>
      </section>
      <section className="section employer-band" id="employers">
        <div className="container split-info">
          <div>
            <span className="eyebrow">FOR EMPLOYERS</span>
            <h2>Great hiring starts with a clear opportunity.</h2>
            <p>
              Publish opportunities, manage candidates and organize hiring with
              a professional recruiting workspace. Publication requires Admin
              review.
            </p>
            <div className="action-row">
              <Link className="button-dark" href="/register">
                Post an Opportunity ↗
              </Link>
              <Link className="text-link" href="/pricing">
                Explore Employer Plans →
              </Link>
            </div>
          </div>
          <div className="feature-list">
            {[
              "Organization verification",
              "Opportunity drafting",
              "Applicant management",
              "Hiring pipeline",
              "Interview scheduling · planned",
              "Assessments · integration unavailable",
              "Team permissions · planned",
              "Billing management · unavailable",
            ].map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {section(
            "FAIR ACCESS",
            "Talent can come from anywhere.",
            "A strong network or premium subscription is not required to discover opportunities.",
          )}
          <div className="value-grid four">
            {[
              ["Open Discovery", "Explore public listings without signing in."],
              [
                "Transparent Eligibility",
                "Review published requirements and what remains unspecified.",
              ],
              [
                "Practical Support",
                "Ask for available guidance and accessibility help.",
              ],
              [
                "Respectful Recruitment",
                "Selection should rely on legitimate qualifications, not paid visibility.",
              ],
            ].map(([a, b]) => (
              <article className="value-card" key={a}>
                <h3>{a}</h3>
                <p>{b}</p>
              </article>
            ))}
          </div>
          <p className="section-end">
            <Link className="text-link" href="/fair-access">
              Explore Fair Access ↗
            </Link>
          </p>
        </div>
      </section>
      <section className="section warm">
        <div className="container split-info">
          <div>
            <span className="eyebrow">TRUST & SAFETY</span>
            <h2>Trust should be visible, not assumed.</h2>
            <p>
              Organizations and listing versions receive separate review.
              Visitors can report concerns. Review is not a guarantee of
              employment or employer conduct.
            </p>
            <Link className="text-link" href="/trust-safety">
              How AVSAR Reviews Opportunities ↗
            </Link>
          </div>
          <div className="feature-list">
            {[
              "Organization verification",
              "Admin-controlled publishing",
              "Listing review",
              "Scam reporting",
              "Private application access",
              "Accessible support",
              "Transparent sourcing",
            ].map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="section eora-band">
        <div className="container split-info">
          <div>
            <span className="eyebrow">EORA GUIDANCE</span>
            <h2>Not sure what to do next? Ask EORA.</h2>
            <p>
              Live EORA assistance is not connected to AVSAR yet. For now,
              search openings or use the practical guidance below.
            </p>
            <Link className="text-link" href="/help">
              Get help ↗
            </Link>
          </div>
          <div className="suggestions">
            {[
              ["Find AI/ML internships", "/opportunities?type=Internship&q=AI"],
              ["Understand eligibility", "/resources"],
              ["Prepare my profile", "/resources"],
              ["Find research opportunities", "/opportunities?type=Research"],
            ].map(([a, b]) => (
              <Link href={b} key={a}>
                {a} ↗
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section" id="resources">
        <div className="container">
          {section("RESOURCE CENTER", "Useful advice for your next step.")}
          <div className="resource-grid">
            {(
              resourceCopy?.articles.map((a) => [a.title, a.body]) || resources
            ).map(([title, copy]) => (
              <article className="resource-card" key={title}>
                <span className="eyebrow">CAREER GUIDE</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <p className="section-end">
            <Link className="text-link" href="/resources">
              Explore Resources ↗
            </Link>
          </p>
        </div>
      </section>
      <section className="section warm" id="faq">
        <div className="container">
          {section("COMMON QUESTIONS", "Answers before your next step.")}
          <FaqTabs
            entries={
              faqCopy
                ? {
                    seekers: faqCopy.jobseekers.map((x) => [
                      x.question,
                      x.answer,
                    ]),
                    employers: faqCopy.employers.map((x) => [
                      x.question,
                      x.answer,
                    ]),
                  }
                : undefined
            }
          />
        </div>
      </section>
      <section className="section final-cta">
        <div className="container">
          <span className="eyebrow">TAKE THE NEXT STEP</span>
          <h2>Your next opportunity starts here.</h2>
          <p>
            Whether you&apos;re searching for your next role or looking for the
            right people, AVSAR helps you take the next step.
          </p>
          <div className="final-choices">
            <div>
              <span>FOR JOBSEEKERS</span>
              <Link href="/opportunities">Explore Opportunities ↗</Link>
            </div>
            <div>
              <span>FOR EMPLOYERS</span>
              <Link href="/register">Start Hiring ↗</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
