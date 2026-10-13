"use client";
import Link from "next/link";
import { EventPing } from "@/components/EventPing";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Register() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(f)),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/recruiter");
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-wrap">
      <EventPing kind="registration_initiated" />
      <EventPing kind="employer_registration_initiated" />
      <form className="form-card" onSubmit={submit}>
        <span className="eyebrow">FOR EMPLOYERS</span>
        <h1>Create a recruiter account.</h1>
        <p>
          Recruiter registration opens a private workspace. Your organization
          and each listing require review before publication.
        </p>
        <p>
          Jobseeker registration will open after verified AI Tathastu Core and
          Collaborate account linking is available. Public opportunities remain
          open to everyone.
        </p>
        <label>
          Work email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Password <small>(at least 12 characters)</small>
          <input
            name="password"
            type="password"
            minLength={12}
            autoComplete="new-password"
            required
          />
        </label>
        <button disabled={busy}>
          {busy ? "Creating…" : "Create account ↗"}
        </button>
        <p role="alert">{message}</p>
        <p>
          Already registered? <Link href="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
