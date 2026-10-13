import type { Metadata } from "next";
import Link from "next/link";
import { products, productHref } from "@/lib/public-content";
import { publishedContent } from "@/lib/site-content";
import "./globals.css";
export const metadata: Metadata = {
  title: "AVSAR — Every Opportunity. A Fair Chance.",
  description:
    "Search reviewed jobs, internships, research and other opportunities on AVSAR by AI Tathastu.",
};
const footerGroups = [
  {
    title: "Explore",
    links: [
      ["Jobs", "/opportunities?type=Job"],
      ["Internships", "/opportunities?type=Internship"],
      ["Research", "/opportunities?type=Research"],
      ["Scholarships", "/opportunities?type=Scholarship"],
      ["Fellowships", "/opportunities?type=Fellowship"],
      ["Events", "/opportunities?type=Event"],
    ],
  },
  {
    title: "For Jobseekers",
    links: [
      ["Dashboard", "/me"],
      ["Saved Jobs", "/me"],
      ["Applications", "/me"],
      ["Professional Profile · planned", ""],
      ["Opportunity Support", "/help"],
    ],
  },
  {
    title: "For Employers",
    links: [
      ["Post Opportunity", "/register"],
      ["Employer Dashboard", "/recruiter"],
      ["Pricing", "/pricing"],
      ["Verification", "/for-employers"],
      ["Recruiting Help", "/help"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/how-it-works"],
      ["How It Works", "/how-it-works"],
      ["Trust & Safety", "/trust-safety"],
      ["Fair Access", "/fair-access"],
      ["Contact", "/help"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Terms", "/legal"],
      ["Privacy", "/privacy"],
      ["Accessibility", "/help"],
      ["Cookie Preferences", "/privacy"],
      ["Report Abuse", "/help"],
    ],
  },
];
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const extra = await publishedContent("footer_links");
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <header className="topbar">
          <div className="container nav">
            <Link className="brand" href="/">
              <span className="brand-mark">↗</span>
              <span>
                AVSAR<small>BY AI TATHASTU</small>
              </span>
            </Link>
            <nav className="desktop-nav" aria-label="Primary navigation">
              <Link href="/opportunities?type=Job">Find Jobs</Link>
              <Link href="/opportunities?type=Internship">Internships</Link>
              <details className="nav-menu">
                <summary>Explore</summary>
                <div>
                  {[
                    ["Jobs", "Job"],
                    ["Internships", "Internship"],
                    ["Research", "Research"],
                    ["Scholarships", "Scholarship"],
                    ["Fellowships", "Fellowship"],
                    ["Hackathons", "Hackathon"],
                    ["Events", "Event"],
                  ].map(([label, type]) => (
                    <Link href={`/opportunities?type=${type}`} key={type}>
                      {label}
                    </Link>
                  ))}
                </div>
              </details>
              <Link href="/for-employers">For Employers</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/ecosystem">Ecosystem</Link>
            </nav>
            <div className="nav-actions">
              <Link href="/login">Sign In</Link>
              <Link className="nav-action" href="/opportunities">
                Find Opportunities
              </Link>
              <Link className="nav-post" href="/register">
                Post a Job ↗
              </Link>
            </div>
            <details className="mobile-nav">
              <summary aria-label="Open navigation">Menu ☰</summary>
              <nav aria-label="Mobile navigation">
                <Link href="/opportunities">Find Opportunities</Link>
                <Link href="/opportunities?type=Internship">Internships</Link>
                <Link href="/for-employers">For Employers</Link>
                <Link href="/pricing">Pricing</Link>
                <Link href="/ecosystem">Ecosystem</Link>
                <Link href="/login">Sign In</Link>
                <Link href="/register">Post a Job</Link>
              </nav>
            </details>
          </div>
        </header>
        <div className="prelaunch-banner" role="status">
          AVSAR is a prelaunch prototype. Public browsing is open; verified
          Core and Collaborate linking and internal applications are unavailable.
        </div>
        <main id="main-content">{children}</main>
        <footer className="footer">
          <div className="container">
            <div className="footer-top">
              <div>
                <Link className="footer-brand" href="/">
                  AVSAR <small>by AI Tathastu</small>
                </Link>
                <p>Every Opportunity. A Fair Chance.</p>
              </div>
              <p>
                Explore reviewed opportunities. Hire through a clear,
                accountable process.
              </p>
            </div>
            <div className="footer-grid">
              {footerGroups.slice(0, 3).map((group) => (
                <div key={group.title}>
                  <h2>{group.title}</h2>
                  {group.links.map(([label, href]) =>
                    href ? (
                      <Link href={href} key={label}>
                        {label}
                      </Link>
                    ) : (
                      <span className="footer-disabled" key={label}>
                        {label}
                      </span>
                    ),
                  )}
                </div>
              ))}
              <div>
                <h2>AI Tathastu Ecosystem</h2>
                {products
                  .filter((x) => x.key !== "AVSAR")
                  .map((product) =>
                    productHref(product.key) ? (
                      <a
                        href={productHref(product.key)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={product.key}
                      >
                        {product.name} ↗
                      </a>
                    ) : (
                      <span className="footer-disabled" key={product.key}>
                        {product.name} · unavailable
                      </span>
                    ),
                  )}
                <Link href="/ecosystem">View directory</Link>
              </div>
              {footerGroups.slice(3).map((group) => (
                <div key={group.title}>
                  <h2>{group.title}</h2>
                  {group.links.map(([label, href]) => (
                    <Link href={href} key={label}>
                      {label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            {extra?.links.length ? (
              <div className="footer-extra">
                {extra.links.map((item) => (
                  <Link href={item.href} key={item.href + item.label}>
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
            <div className="footer-bottom">
              <span>© {new Date().getFullYear()} AVSAR by AI Tathastu</span>
              <span>
                Public browsing is independent. Core and Collaborate identity
                links are required for private jobseeker access.
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
