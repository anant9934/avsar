"use client";
import { useState } from "react";
import Link from "next/link";
export function SalesForm({
  defaultInterest,
}: {
  defaultInterest: "Growth" | "Business" | "Enterprise";
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/v1/sales-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, consent: data.consent === "on" }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Unable to save enquiry");
      setReceipt(result.receipt);
      form.reset();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to save enquiry",
      );
    } finally {
      setBusy(false);
    }
  }
  if (receipt)
    return (
      <div className="panel sales-form">
        <h2>Enquiry saved</h2>
        <p>
          Your reference is <strong>{receipt}</strong>. Keep it for follow-up.
          No notification or purchase has been made.
        </p>
        <Link className="text-link" href="/pricing">
          Back to pricing ↗
        </Link>
      </div>
    );
  return (
    <form className="form-card sales-form" onSubmit={submit}>
      <h2>Contact Sales</h2>
      <div className="form-row">
        <label>
          Contact name
          <input name="contactName" required minLength={2} maxLength={120} />
        </label>
        <label>
          Work email
          <input name="workEmail" type="email" required maxLength={254} />
        </label>
      </div>
      <div className="form-row">
        <label>
          Organization
          <input name="organization" required minLength={2} maxLength={180} />
        </label>
        <label>
          Organization website
          <input name="website" type="url" placeholder="https://example.org" />
        </label>
      </div>
      <div className="form-row">
        <label>
          Expected hiring volume
          <select name="hiringVolume" required defaultValue="">
            <option value="" disabled>
              Select a range
            </option>
            <option value="1-5">1–5</option>
            <option value="6-20">6–20</option>
            <option value="21-100">21–100</option>
            <option value="100+">100+</option>
          </select>
        </label>
        <label>
          Interested in
          <select name="interest" defaultValue={defaultInterest}>
            <option>Growth</option>
            <option>Business</option>
            <option>Enterprise</option>
            <option>Other</option>
          </select>
        </label>
      </div>
      <label>
        What would you like to discuss?
        <textarea
          name="message"
          required
          minLength={20}
          maxLength={4000}
          rows={5}
        />
      </label>
      <label className="sr-only" aria-hidden="true">
        Leave this empty
        <input name="websiteTrap" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="checkbox-line">
        <input type="checkbox" name="consent" required />I agree that AVSAR may
        store this enquiry and contact me about it. See the{" "}
        <Link href="/privacy">privacy information</Link>.
      </label>
      <button disabled={busy} type="submit">
        {busy ? "Submitting…" : "Send Enquiry ↗"}
      </button>
      <p role="alert">{message}</p>
    </form>
  );
}
