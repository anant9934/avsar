import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHelpForm } from "@/components/PublicHelpForm";
const pages: Record<
  string,
  { eyebrow: string; title: string; lead: string; sections: [string, string][] }
> = {
  "how-it-works": {
    eyebrow: "THE AVSAR JOURNEY",
    title: "Discover, understand, apply.",
    lead: "Public discovery is free. Account linking begins only when a student chooses a private jobseeker action.",
    sections: [
      [
        "Discover",
        "Search approved live listings and read transparent requirements without signing in.",
      ],
      [
        "Connect",
        "Jobseeker accounts require separate, verified Core and Collaborate identities. Optional profile sharing is your choice.",
      ],
      [
        "Apply",
        "Internal applications will show the exact employer-visible information before submission. External links open the original destination; opening is not an application receipt.",
      ],
    ],
  },
  "fair-access": {
    eyebrow: "FAIR ACCESS",
    title: "Opportunity should be open to more people.",
    lead: "AVSAR is designed to explain requirements, distinguish unknown information from ineligibility, and keep essential candidate access free.",
    sections: [
      [
        "Open browsing",
        "Anyone can explore public opportunities, including people who have not created an account.",
      ],
      [
        "No paid candidate ranking",
        "Employer plans do not purchase candidate preference or a verification badge.",
      ],
      [
        "Human decisions",
        "Hiring outcomes and consequential moderation require accountable human review.",
      ],
    ],
  },
  "trust-safety": {
    eyebrow: "TRUST & SAFETY",
    title: "Know who is posting.",
    lead: "Organization checks and listing reviews are separate. Reports from visitors enter a review queue.",
    sections: [
      [
        "Approval",
        "Recruiters cannot publish a listing by themselves. Authorized staff review organizations and listing versions.",
      ],
      [
        "Report concerns",
        "Use the report form on a listing for suspicious fees, impersonation, harassment or misleading claims.",
      ],
      [
        "Scope",
        "A reviewed listing is not a guarantee of employer conduct or a promise of a role. Check the original destination before sharing information.",
      ],
    ],
  },
  "for-employers": {
    eyebrow: "FOR EMPLOYERS",
    title: "Recruit with clarity.",
    lead: "Create an AVSAR recruiter account, submit organization information, and publish only after independent review.",
    sections: [
      [
        "Organization review",
        "Supply legal and display names, official domain, work email and evidence of recruiter authority.",
      ],
      [
        "Listing review",
        "Draft opportunities are private. Submit them for moderation; approval and publication are separate decisions.",
      ],
      [
        "Applicant access",
        "Only authorized members of the owning organization may see submissions to their listings.",
      ],
    ],
  },
  pricing: {
    eyebrow: "EMPLOYER PLANS",
    title: "Capacity funded by employers.",
    lead: "These are proposed plans. Paid checkout and subscriptions are not active, and no charge can be made here.",
    sections: [
      [
        "Starter — free",
        "Proposed limit: one active listing and one recruiter seat.",
      ],
      [
        "Growth — proposed ₹1,499/month",
        "Proposed limit: five active listings and two recruiter seats.",
      ],
      [
        "Business — proposed ₹4,999/month",
        "Proposed limit: twenty active listings and five recruiter seats.",
      ],
      ["Enterprise", "Custom terms require an approved contract."],
    ],
  },
  help: {
    eyebrow: "HELP & ACCESSIBILITY",
    title: "Tell us what you need.",
    lead: "Anonymous visitors can report suspicious activity or request accessibility assistance. Submission requires the reporting service to be configured.",
    sections: [
      [
        "Account linking",
        "Core and Collaborate connections are not available until both providers supply secure federation contracts.",
      ],
      [
        "Recruiter review",
        "Organization decisions require human review and evidence; account creation alone cannot publish.",
      ],
    ],
  },
  privacy: {
    eyebrow: "PRIVACY",
    title: "Private by default.",
    lead: "This prelaunch implementation stores AVSAR owned records separately from Core and Collaborate. A final legal privacy notice and retention schedule are required before production launch.",
    sections: [
      [
        "Profile sharing",
        "Required identity proof is separate from optional profile import and public visibility.",
      ],
      [
        "Applications",
        "An internal application snapshot is shared only with the posting organization after explicit submission.",
      ],
      [
        "Requests",
        "Formal access, deletion and correction procedures are pending approved policy and operational setup.",
      ],
    ],
  },
  legal: {
    eyebrow: "LEGAL",
    title: "Prelaunch legal information.",
    lead: "AVSAR is not open for live candidate account creation or payments. Approved terms, recruitment policies and jurisdictional review are required before launch.",
    sections: [
      [
        "Public listings",
        "Read source and eligibility information carefully. External application destinations are operated by their publishers.",
      ],
      [
        "Employer submissions",
        "Submitted organization and listing information is reviewed before publication.",
      ],
    ],
  },
};
export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}
export default async function Info({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();
  return (
    <>
      <div className="route-head">
        <div className="container">
          <span className="eyebrow">{page.eyebrow}</span>
          <h1>{page.title}</h1>
          <p>{page.lead}</p>
        </div>
      </div>
      <div className="container info-layout">
        <div className="info-cards">
          {page.sections.map(([title, copy]) => (
            <section className="panel" key={title}>
              <h2>{title}</h2>
              <p>{copy}</p>
            </section>
          ))}
        </div>
        <aside className="panel">
          <h2>Next steps</h2>
          <p>
            Explore genuine approved listings, or open the employer workspace.
          </p>
          <Link className="button-dark" href="/opportunities">
            Explore opportunities ↗
          </Link>
          <p>
            <Link className="text-link" href="/recruiter">
              Employer workspace →
            </Link>
          </p>
          {slug === "help" && <PublicHelpForm />}
        </aside>
      </div>
    </>
  );
}
