"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ContentEditor } from "@/components/ContentEditor";
import { PlanEditor } from "@/components/PlanEditor";
type Org = {
  id: string;
  legalName: string;
  displayName: string;
  website: string;
  workEmail: string;
  category: string;
  authority: string;
  status: string;
};
type Opp = {
  item: {
    id: string;
    title: string;
    description: string;
    requirements: string;
    status: string;
    applicationUrl: string | null;
  };
  organization: string;
  orgStatus: string;
};
type Report = {
  id: string;
  category: string;
  details: string;
  opportunityId: string | null;
};
type SalesInquiry = {
  id: string;
  contactName: string;
  workEmail: string;
  organization: string;
  hiringVolume: string;
  interest: string;
  message: string;
  status: string;
};
const staffRoles = ["super_admin", "verification_officer", "listing_moderator"];
export default function Admin() {
  const [actor, setActor] = useState<{ role: string } | null | undefined>();
  const [queue, setQueue] = useState<{
    organizations: Org[];
    opportunities: Opp[];
    approved: Opp[];
    published: Opp[];
    reports: Report[];
  } | null>(null);
  const [message, setMessage] = useState("");
  const [sales, setSales] = useState<SalesInquiry[]>([]);
  const [analytics, setAnalytics] = useState<{
    events: { kind: string; total: number }[];
    operational: {
      publishedListings: number;
      approvedOrganizations: number;
      submittedApplications: number;
    };
  } | null>(null);
  const [busy, setBusy] = useState(false);
  async function load() {
    try {
      const sessionRes = await fetch("/api/v1/auth/session");
      if (!sessionRes.ok) throw new Error("Session service unavailable");
      const session = await sessionRes.json();
      setActor(session.actor);
      if (!session.actor || !staffRoles.includes(session.actor.role)) return;
      const res = await fetch("/api/v1/admin/review-queue");
      if (!res.ok) throw new Error("Review queue unavailable");
      setQueue(await res.json());
      if (session.actor.role === "super_admin") {
        const salesRes = await fetch("/api/v1/admin/sales-inquiries");
        if (salesRes.ok) setSales((await salesRes.json()).items);
      }
      const metricsRes = await fetch("/api/v1/admin/analytics");
      if (metricsRes.ok) setAnalytics(await metricsRes.json());
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unavailable");
    }
  }
  useEffect(() => {
    // load awaits the session request before it updates component state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);
  async function decide(path: string, decision: string) {
    const reason = window.prompt(
      `Reason for ${decision} (at least 10 characters):`,
    );
    if (!reason) return;
    if (reason.trim().length < 10) {
      setMessage("A reason of at least 10 characters is required.");
      return;
    }
    let verification = {};
    if (path.includes("/organizations/") && decision === "approved") {
      const evidenceReference = window.prompt(
        "Reference to the private verification record:",
      );
      if (!evidenceReference) return;
      const workEmailChecked = window.confirm(
        "Have you independently verified the work email?",
      );
      const domainChecked = window.confirm(
        "Have you independently verified the official domain?",
      );
      const authorityChecked = window.confirm(
        "Have you independently verified recruiter authority?",
      );
      verification = {
        evidenceReference,
        workEmailChecked,
        domainChecked,
        authorityChecked,
      };
    }
    setBusy(true);
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, reason, ...verification }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("Decision saved and audited.");
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Decision failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="container workspace-page">
      <div className="workspace-head">
        <span className="eyebrow">AVSAR CONTROL CENTER</span>
        <h1>Review what reaches the marketplace.</h1>
        <p>
          Organization approval and listing publication are separate, audited
          decisions.
        </p>
      </div>
      {actor === undefined ? (
        <div className="empty">Loading review queue…</div>
      ) : !actor || !staffRoles.includes(actor.role) ? (
        <div className="empty">
          <h2>Authorized staff only</h2>
          <Link href="/login">Sign in ↗</Link>
        </div>
      ) : (
        <div className="admin-columns">
          <section className="panel">
            <h2>
              Organizations awaiting verification{" "}
              <span>{queue?.organizations.length || 0}</span>
            </h2>
            {queue?.organizations.length ? (
              queue.organizations.map((o) => (
                <div className="review-item" key={o.id}>
                  <h3>{o.displayName}</h3>
                  <p>
                    Legal name: {o.legalName}
                    <br />
                    Work email: {o.workEmail}
                    <br />
                    Category: {o.category}
                  </p>
                  <p>
                    <a
                      href={o.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Official website ↗
                    </a>
                  </p>
                  <p>Claimed authority: {o.authority}</p>
                  <div className="action-row">
                    <button
                      disabled={busy}
                      onClick={() =>
                        decide(
                          `/api/v1/admin/organizations/${o.id}/decision`,
                          "approved",
                        )
                      }
                    >
                      Approve
                    </button>
                    <button
                      disabled={busy}
                      onClick={() =>
                        decide(
                          `/api/v1/admin/organizations/${o.id}/decision`,
                          "more_information_required",
                        )
                      }
                    >
                      Request details
                    </button>
                    <button
                      disabled={busy}
                      onClick={() =>
                        decide(
                          `/api/v1/admin/organizations/${o.id}/decision`,
                          "rejected",
                        )
                      }
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No organization requests.</p>
            )}
          </section>
          <section className="panel">
            <h2>
              Listings awaiting review{" "}
              <span>{queue?.opportunities.length || 0}</span>
            </h2>
            {queue?.opportunities.length ? (
              queue.opportunities.map(
                ({ item: x, organization, orgStatus }) => (
                  <div className="review-item" key={x.id}>
                    <h3>{x.title}</h3>
                    <p>
                      {organization} · Organization {orgStatus}
                    </p>
                    <p>{x.description}</p>
                    <p>
                      <strong>Requirements:</strong> {x.requirements}
                    </p>
                    {x.applicationUrl && (
                      <a
                        href={x.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Review application destination ↗
                      </a>
                    )}
                    <div className="action-row">
                      <button
                        disabled={busy}
                        onClick={() =>
                          decide(
                            `/api/v1/admin/opportunities/${x.id}/decision`,
                            "approve",
                          )
                        }
                      >
                        Approve version
                      </button>
                      <button
                        disabled={busy}
                        onClick={() =>
                          decide(
                            `/api/v1/admin/opportunities/${x.id}/decision`,
                            "needs_changes",
                          )
                        }
                      >
                        Request changes
                      </button>
                      <button
                        disabled={busy}
                        onClick={() =>
                          decide(
                            `/api/v1/admin/opportunities/${x.id}/decision`,
                            "reject",
                          )
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ),
              )
            ) : (
              <p>No listing submissions.</p>
            )}
            <h2>
              Approved, ready to publish{" "}
              <span>{queue?.approved.length || 0}</span>
            </h2>
            {queue?.approved.length ? (
              queue.approved.map(({ item: x, organization }) => (
                <div className="review-item" key={x.id}>
                  <h3>{x.title}</h3>
                  <p>{organization}</p>
                  <button
                    disabled={busy}
                    onClick={() =>
                      decide(
                        `/api/v1/admin/opportunities/${x.id}/decision`,
                        "publish",
                      )
                    }
                  >
                    Publish listing
                  </button>
                </div>
              ))
            ) : (
              <p>No approved listings.</p>
            )}
            <h2>
              Currently published <span>{queue?.published.length || 0}</span>
            </h2>
            {queue?.published.length ? (
              queue.published.map(({ item: x, organization }) => (
                <div className="review-item" key={x.id}>
                  <h3>{x.title}</h3>
                  <p>{organization}</p>
                  <button
                    disabled={busy}
                    onClick={() =>
                      decide(
                        `/api/v1/admin/opportunities/${x.id}/decision`,
                        "suspend",
                      )
                    }
                  >
                    Suspend listing
                  </button>
                </div>
              ))
            ) : (
              <p>No published listings.</p>
            )}
          </section>
          <section className="panel">
            <h2>
              Open reports <span>{queue?.reports.length || 0}</span>
            </h2>
            {queue?.reports.length ? (
              queue.reports.map((r) => (
                <div className="review-item" key={r.id}>
                  <strong>{r.category.replaceAll("_", " ")}</strong>
                  <p>{r.details}</p>
                  <small>Reference: {r.id}</small>
                </div>
              ))
            ) : (
              <p>No open reports.</p>
            )}
          </section>
          <section className="panel">
            <h2>Operational analytics</h2>
            {analytics ? (
              <>
                <p>
                  Published listings: {analytics.operational.publishedListings}{" "}
                  · Approved organizations:{" "}
                  {analytics.operational.approvedOrganizations} · Submitted
                  AVSAR applications:{" "}
                  {analytics.operational.submittedApplications}
                </p>
                <h3>Events · last 30 days</h3>
                {analytics.events.map((event) => (
                  <p key={event.kind}>
                    {event.kind.replaceAll("_", " ")}: {event.total}
                  </p>
                ))}
              </>
            ) : (
              <p>Analytics unavailable.</p>
            )}
          </section>
          {actor.role === "super_admin" && (
            <>
              <ContentEditor />
              <PlanEditor />
            </>
          )}
          {actor.role === "super_admin" && (
            <section className="panel">
              <h2>
                Sales enquiries <span>{sales.length}</span>
              </h2>
              {sales.length ? (
                sales.map((lead) => (
                  <div className="review-item" key={lead.id}>
                    <h3>{lead.organization}</h3>
                    <p>
                      {lead.contactName} · {lead.workEmail}
                    </p>
                    <p>
                      {lead.interest} · {lead.hiringVolume} hires ·{" "}
                      {lead.status}
                    </p>
                    <p>{lead.message}</p>
                    <small>Reference: {lead.id}</small>
                  </div>
                ))
              ) : (
                <p>No sales enquiries.</p>
              )}
            </section>
          )}
        </div>
      )}
      <p role="status" className="status-message">
        {message}
      </p>
    </div>
  );
}
