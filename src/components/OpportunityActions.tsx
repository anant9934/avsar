"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export function OpportunityActions({
  id,
  internal,
  enabled,
}: {
  id: string;
  internal: boolean;
  enabled: boolean;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [showForm, setShowForm] = useState(false);
  if (!enabled)
    return (
      <p className="empty">
        AVSAR save and apply actions are unavailable until verified Core and
        Collaborate account linking is connected. You can still browse public
        listings.
      </p>
    );
  async function save() {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch(`/api/v1/me/saved/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push(
          `/login?next=${encodeURIComponent(window.location.pathname)}`,
        );
        return;
      }
      if (!res.ok) throw new Error(data.error);
      setMessage("Saved to your AVSAR workspace.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }
  async function apply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const f = new FormData(e.currentTarget);
    try {
      const draftRes = await fetch("/api/v1/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: id,
          idempotencyKey: crypto.randomUUID(),
          candidateStatement: f.get("candidateStatement"),
          consentConfirmed: true,
        }),
      });
      const draft = await draftRes.json();
      if (draftRes.status === 401) {
        router.push(
          `/login?next=${encodeURIComponent(window.location.pathname)}`,
        );
        return;
      }
      if (!draftRes.ok) throw new Error(draft.error);
      const submitRes = await fetch(
        `/api/v1/applications/${draft.draftId}/submit`,
        { method: "POST" },
      );
      const result = await submitRes.json();
      if (!submitRes.ok) throw new Error(result.error);
      setMessage(`Application submitted. Receipt: ${result.receipt}`);
      setShowForm(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="opportunity-actions">
      <button type="button" disabled={busy} onClick={save}>
        Save Opportunity ♡
      </button>
      {internal && (
        <>
          <button
            type="button"
            disabled={busy}
            onClick={() => setShowForm(!showForm)}
          >
            Apply with AVSAR ↗
          </button>
          {showForm && (
            <form onSubmit={apply}>
              <label>
                Why are you a good fit?
                <textarea
                  name="candidateStatement"
                  minLength={20}
                  maxLength={5000}
                  required
                  rows={5}
                />
              </label>
              <p>
                Your email and statement will be shared with this listing&apos;s
                organization when you submit.
              </p>
              <label className="checkbox-line">
                <input type="checkbox" required />I consent to this application
                being shared with the publisher.
              </label>
              <button disabled={busy}>Submit Application</button>
            </form>
          )}
        </>
      )}
      <p role="status">{message}</p>
      <p>
        <Link href="/me">Open your workspace →</Link>
      </p>
    </div>
  );
}
