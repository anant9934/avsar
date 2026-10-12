"use client";
import { useState } from "react";
export function PublicHelpForm() {
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
          category: form.get("category"),
          details: form.get("details"),
        }),
      });
      const data = await res.json();
      setMessage(
        res.ok
          ? `Request recorded. Reference: ${data.receipt}`
          : data.error || "Request failed",
      );
    } catch {
      setMessage("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="small-form" onSubmit={submit}>
      <label>
        Request type
        <select name="category">
          <option value="accessibility">Accessibility assistance</option>
          <option value="other">General concern</option>
        </select>
      </label>
      <label>
        Details
        <textarea name="details" minLength={10} maxLength={2000} required />
      </label>
      <button disabled={busy}>{busy ? "Sending…" : "Send request"}</button>
      <p role="status">{message}</p>
    </form>
  );
}
