"use client";
import { useState } from "react";
import Link from "next/link";

export type FeaturedItem = {
  id: string;
  title: string;
  organization: string;
  location: string;
  mode: string;
  type: string;
  requirements: string;
  compensation: string | null;
  deadline: string | null;
};
const tabs = [
  "Latest Jobs",
  "Internships",
  "Remote",
  "Research",
  "Closing Soon",
] as const;
export function FeaturedTabs({
  groups,
  available,
}: {
  groups: Record<string, FeaturedItem[]>;
  available: boolean;
}) {
  const [tab, setTab] = useState<string>(tabs[0]);
  const items = groups[tab] || [];
  return (
    <div className="tab-shell">
      <div
        className="tab-list"
        role="tablist"
        aria-label="Featured opportunities"
      >
        {tabs.map((name) => (
          <button
            type="button"
            role="tab"
            aria-selected={tab === name}
            onClick={() => setTab(name)}
            key={name}
          >
            {name}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {items.length ? (
          <div className="cards featured-cards">
            {items.slice(0, 3).map((x) => (
              <Link
                className="listing-card"
                href={`/opportunities/${x.id}`}
                key={x.id}
              >
                <span className="pill">
                  {x.type} · {x.mode}
                </span>
                <h3>{x.title}</h3>
                <p>{x.organization}</p>
                <p className="featured-requirements">
                  {x.requirements.slice(0, 120)}
                  {x.requirements.length > 120 ? "…" : ""}
                </p>
                <div className="card-meta">
                  {x.location} · {x.compensation || "Pay not specified"}
                </div>
                {x.deadline && (
                  <div className="card-meta">
                    Closes {new Date(x.deadline).toLocaleDateString("en-IN")}
                  </div>
                )}
                <span className="card-link">View Details ↗</span>
                <span className="review-note">
                  Organization approved · Listing reviewed
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty">
            <h3>
              {available
                ? "No approved listings in this category yet"
                : "Listings are temporarily unavailable"}
            </h3>
            <p>
              {available
                ? "Explore another category or check back when verified organizations publish."
                : "Please try again once the marketplace service is restored."}
            </p>
            <Link className="text-link" href="/opportunities">
              Browse categories ↗
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
