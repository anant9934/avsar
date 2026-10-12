"use client";
import { useState } from "react";
export function ReportForm({ opportunityId }: { opportunityId: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/v1/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId,
          category: form.get("category"),
          details: form.get("details"),
        }),
      });
      const data = await res.json();
      setMessage(
        res.ok
          ? `Report received. Reference: ${data.receipt}`
          : data.error || "Report failed",
      );
    } catch {
      setMessage("Network error. Please retry.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="small-form">
      <label>
        Concern
        <select name="category">
          <option value="suspicious_fee">Recruitment fee</option>
          <option value="impersonation">Impersonation</option>
          <option value="harassment">Harassment</option>
          <option value="misleading">Misleading information</option>
          <option value="accessibility">Accessibility</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label>
        Details
        <textarea name="details" minLength={10} maxLength={2000} required />
      </label>
      <button disabled={busy}>{busy ? "Sending…" : "Submit report"}</button>
      <p role="status">{message}</p>
    </form>
  );
}
