"use client";
import { useState } from "react";
import Link from "next/link";

export function JourneyTabs() {
  const [tab, setTab] = useState<"seekers" | "employers">("seekers");
  const seekers = [
    "Search public opportunities",
    "Review requirements and application details",
    "Connect verified Core and Collaborate accounts when linking opens",
    "Save or submit an application after linking",
    "Track updates recorded in AVSAR",
  ];
  const employers = [
    "Create a recruiter account",
    "Submit your organization for verification",
    "Draft and submit an opportunity",
    "Wait for Admin review and approval",
    "Manage applications in your workspace",
  ];
  return (
    <div className="tab-shell">
      <div className="tab-list" role="tablist" aria-label="How AVSAR works">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "seekers"}
          onClick={() => setTab("seekers")}
        >
          For Jobseekers
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "employers"}
          onClick={() => setTab("employers")}
        >
          For Recruiters
        </button>
      </div>
      <div role="tabpanel" className="journey-panel">
        <ol>
          {(tab === "seekers" ? seekers : employers).map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p>
          {tab === "employers"
            ? "An approved organization and reviewed listing are required before publication."
            : "Public browsing needs no account. Private jobseeker actions will require verified Core and Collaborate links; linking is not available yet."}
        </p>
        <Link
          className="button-dark"
          href={tab === "seekers" ? "/opportunities" : "/register"}
        >
          {tab === "seekers" ? "Start Exploring" : "Start Hiring"} ↗
        </Link>
      </div>
    </div>
  );
}

const faq = {
  seekers: [
    ["Is AVSAR free?", "Browsing and standard jobseeker actions are free."],
    [
      "Can I search without an account?",
      "Yes. Public listings are open to everyone.",
    ],
    [
      "Do I need an AI Tathastu account?",
      "You can browse without an account. Future private jobseeker actions require verified Core and Collaborate accounts.",
    ],
    [
      "Can I apply without verified skills?",
      "AVSAR does not require an external skill verification link. Check each publisher's eligibility requirements.",
    ],
    [
      "How do I save opportunities?",
      "Saving will open after verified Core and Collaborate linking is available.",
    ],
    [
      "How are listings reviewed?",
      "AVSAR reviews the organization and each listing version before publication. Review does not guarantee an employer's conduct.",
    ],
    [
      "How do I report a suspicious job?",
      "Open the listing and use its report form. No account is required.",
    ],
    [
      "Can I remove my CV?",
      "AVSAR does not currently provide a CV upload feature. Contact support about information in an application.",
    ],
  ],
  employers: [
    [
      "How do I register my organization?",
      "Create a recruiter account and submit your organization's legal name, official website, work email and your authority.",
    ],
    [
      "Why does AVSAR verify employers?",
      "An Admin checks organization evidence before listings may be published.",
    ],
    [
      "How much does job posting cost?",
      "The Starter registration is available. Paid prices are proposals; checkout is not active.",
    ],
    [
      "How many active listings can I post?",
      "Published plan limits are proposed and are not yet enforced by a billing catalog. Ask support for current availability.",
    ],
    [
      "Can I see all student profiles?",
      "No. Recruiters can access applications submitted to their own organization.",
    ],
    [
      "Can I schedule interviews?",
      "A dedicated scheduling integration is not yet configured.",
    ],
    [
      "Can I request assessments?",
      "ERIS assessment integration is not yet configured.",
    ],
    [
      "Can I cancel my subscription?",
      "Live paid subscriptions are not available, so there is nothing to cancel here.",
    ],
  ],
};
export function FaqTabs({
  entries,
}: {
  entries?: { seekers: string[][]; employers: string[][] };
}) {
  const [tab, setTab] = useState<keyof typeof faq>("seekers");
  return (
    <div className="tab-shell">
      <div
        className="tab-list"
        role="tablist"
        aria-label="Frequently asked questions"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "seekers"}
          onClick={() => setTab("seekers")}
        >
          Jobseekers
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "employers"}
          onClick={() => setTab("employers")}
        >
          Employers
        </button>
      </div>
      <div role="tabpanel" className="faq-list">
        {(entries?.[tab] || faq[tab]).map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export function PreviewTabs() {
  const [tab, setTab] = useState(0);
  const tabs = [
    "Find Opportunities",
    "Jobseeker Workspace",
    "Recruiter Workspace",
    "Admin Verification",
  ];
  const descriptions = [
    "Search approved listings with keyword, location, category and work-mode filters.",
    "Saving and application tracking are planned after verified linking.",
    "Submit your organization and listings, then manage applicants to your openings.",
    "Authorized Admins review organization evidence and each listing before publication.",
  ];
  const hrefs = [
    "/opportunities",
    "/login?next=%2Fme",
    "/login?next=%2Frecruiter",
    "/login?next=%2Fadmin",
  ];
  return (
    <div className="tab-shell">
      <div className="tab-list" role="tablist" aria-label="Platform preview">
        {tabs.map((name, i) => (
          <button
            type="button"
            role="tab"
            aria-selected={tab === i}
            onClick={() => setTab(i)}
            key={name}
          >
            {name}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="preview-panel">
        <span className="eyebrow">INTERFACE PREVIEW · ILLUSTRATIVE</span>
        <div className="preview-screen">
          <div className="preview-sidebar">
            AVSAR
            <br />
            <span>Discover</span>
            <span>Workspace</span>
            <span>Activity</span>
          </div>
          <div>
            <h3>{tabs[tab]}</h3>
            <p>{descriptions[tab]}</p>
            <div className="preview-row" />
            <div className="preview-row short" />
            <div className="preview-row" />
          </div>
        </div>
        <Link className="text-link" href={hrefs[tab]}>
          {tab === 0
            ? "Explore Jobs"
            : tab === 1
              ? "Open Dashboard"
              : tab === 2
                ? "Start Hiring"
                : "Admin Sign In"}{" "}
          ↗
        </Link>
      </div>
    </div>
  );
}
