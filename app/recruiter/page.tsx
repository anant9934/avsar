"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
type Org = {
  id: string;
  displayName: string;
  status: string;
  reviewReason: string | null;
};
type Item = {
  opportunity: { id: string; title: string; status: string; type: string };
  organization: Org;
};
type ApplicationItem = {
  application: {
    id: string;
    status: string;
    snapshot: { candidateStatement?: string; candidateEmail?: string };
  };
  opportunityTitle: string;
};
export default function Recruiter() {
  const [actor, setActor] = useState<
    { role: string; email: string } | null | undefined
  >();
  const [org, setOrg] = useState<Org | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [applicants, setApplicants] = useState<ApplicationItem[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function load() {
    try {
      const sessionRes = await fetch("/api/v1/auth/session");
      if (!sessionRes.ok) throw new Error("Session service unavailable");
      const session = await sessionRes.json();
      setActor(session.actor);
      if (session.actor?.role !== "recruiter") return;
      const [o, j, a] = await Promise.all([
        fetch("/api/v1/organizations"),
        fetch("/api/v1/employer/opportunities"),
        fetch("/api/v1/employer/applications"),
      ]);
      if (!o.ok || !j.ok || !a.ok) throw new Error("Workspace could not load");
      setOrg((await o.json()).items[0] || null);
      setItems((await j.json()).items);
      setApplicants((await a.json()).items);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Workspace unavailable");
    }
  }
  useEffect(() => {
    // load awaits the session request before it updates component state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);
  async function post(path: string, body?: unknown) {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body || {}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMessage("Saved to AVSAR.");
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }
  async function updateStatus(id: string, status: string) {
    const reason = window.prompt(
      "Reason for this candidate status update (at least 5 characters):",
    );
    if (!reason) return;
    await post(`/api/v1/employer/applications/${id}/status`, {
      status,
      reason,
    });
  }
  function submitOrg(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    post(
      "/api/v1/organizations",
      Object.fromEntries(new FormData(e.currentTarget)),
    );
  }
  function submitListing(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget));
    const data = {
      ...raw,
      applicationMethod: "external",
      deadline: raw.deadline
        ? new Date(String(raw.deadline)).toISOString()
        : undefined,
    };
    post("/api/v1/employer/opportunities", data);
  }
  return (
    <div className="container workspace-page">
      <div className="workspace-head">
        <span className="eyebrow">EMPLOYER WORKSPACE</span>
        <h1>Recruit with clarity.</h1>
        <p>
          Submit your organization for verification, then draft listings for
          administrator review.
        </p>
      </div>
      {actor === undefined ? (
        <div className="empty">Loading workspace…</div>
      ) : actor?.role !== "recruiter" ? (
        <div className="empty">
          <h2>Recruiter sign in required</h2>
          <Link href="/login">Sign in ↗</Link>
        </div>
      ) : (
        <div className="workspace-grid">
          <div>
            <section className="panel">
              <h2>Organization</h2>
              {org ? (
                <>
                  <p>
                    <strong>{org.displayName}</strong>
                  </p>
                  <p>
                    Status:{" "}
                    <span className="pill">
                      {org.status.replaceAll("_", " ")}
                    </span>
                  </p>
                  {org.reviewReason && <p>Review note: {org.reviewReason}</p>}
                </>
              ) : (
                <form className="stacked-form" onSubmit={submitOrg}>
                  <p>
                    Your authority and work email will be reviewed. Registration
                    does not verify your organization.
                  </p>
                  <label>
                    Legal name
                    <input name="legalName" required minLength={2} />
                  </label>
                  <label>
                    Display name
                    <input name="displayName" required minLength={2} />
                  </label>
                  <label>
                    Official HTTPS website
                    <input
                      name="website"
                      type="url"
                      required
                      placeholder="https://example.org"
                    />
                  </label>
                  <label>
                    Work email
                    <input name="workEmail" type="email" required />
                  </label>
                  <label>
                    Organization category
                    <input
                      name="category"
                      required
                      placeholder="Company, lab, institution…"
                    />
                  </label>
                  <label>
                    Your recruiting authority
                    <textarea name="authority" required minLength={10} />
                  </label>
                  <button disabled={busy}>
                    Submit organization for review
                  </button>
                </form>
              )}
            </section>
            <section className="panel">
              <h2>My listings</h2>
              {items.length ? (
                items.map(({ opportunity: x }) => (
                  <div className="list-item" key={x.id}>
                    <div>
                      <strong>{x.title}</strong>
                      <p>
                        {x.type} · {x.status.replaceAll("_", " ")}
                      </p>
                    </div>
                    {["draft", "needs_changes"].includes(x.status) && (
                      <button
                        disabled={busy}
                        onClick={() =>
                          post(`/api/v1/employer/opportunities/${x.id}/submit`)
                        }
                      >
                        Submit for review
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p>No listings yet.</p>
              )}
            </section>
            <section className="panel">
              <h2>Applicants</h2>
              {applicants.length ? (
                applicants.map(({ application: a, opportunityTitle }) => (
                  <div className="review-item" key={a.id}>
                    <h3>{opportunityTitle}</h3>
                    <p>Status: {a.status.replaceAll("_", " ")}</p>
                    <p>
                      Candidate email:{" "}
                      {a.snapshot?.candidateEmail || "Not supplied"}
                    </p>
                    <p>
                      Candidate submitted statement:{" "}
                      {a.snapshot?.candidateStatement ||
                        "No statement available"}
                    </p>
                    <div className="action-row">
                      {(
                        [
                          "received",
                          "under_review",
                          "offered",
                          "not_selected",
                        ] as const
                      ).map((status) => (
                        <button
                          key={status}
                          disabled={busy || a.status === status}
                          onClick={() => updateStatus(a.id, status)}
                        >
                          {status.replaceAll("_", " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>No submitted applications.</p>
              )}
            </section>
          </div>
          <div>
            <section className="panel">
              <h2>Create a listing draft</h2>
              {org?.status === "approved" ? (
                <form className="stacked-form" onSubmit={submitListing}>
                  <label>
                    Title
                    <input name="title" minLength={5} required />
                  </label>
                  <div className="form-row">
                    <label>
                      Type
                      <select name="type">
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
                      <select name="mode">
                        {["Remote", "Hybrid", "Onsite"].map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label>
                    Location
                    <input name="location" required />
                  </label>
                  <label>
                    Description
                    <textarea name="description" minLength={40} required />
                  </label>
                  <label>
                    Responsibilities
                    <textarea name="responsibilities" minLength={10} required />
                  </label>
                  <label>
                    Required qualifications
                    <textarea name="requirements" minLength={10} required />
                  </label>
                  <label>
                    Preferred qualifications
                    <textarea name="preferred" />
                  </label>
                  <label>
                    Eligibility
                    <textarea name="eligibility" minLength={10} required />
                  </label>
                  <label>
                    Compensation <small>(optional)</small>
                    <input name="compensation" />
                  </label>
                  <label>
                    Duration <small>(optional)</small>
                    <input name="duration" />
                  </label>
                  <label>
                    Deadline <small>(optional)</small>
                    <input name="deadline" type="datetime-local" />
                  </label>
                  <label>
                    Application HTTPS URL
                    <input
                      name="applicationUrl"
                      type="url"
                      required
                      placeholder="https://your-organization.org/apply"
                    />
                  </label>
                  <label>
                    Original source URL <small>(optional)</small>
                    <input name="sourceUrl" type="url" />
                  </label>
                  <button disabled={busy}>Save draft</button>
                </form>
              ) : (
                <div className="notice">
                  Listing drafts become available after an administrator
                  approves the organization.
                </div>
              )}
            </section>
          </div>
        </div>
      )}
      <p role="status" className="status-message">
        {message}
      </p>
    </div>
  );
}
