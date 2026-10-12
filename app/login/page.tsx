"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Login() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(f)),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(data.role === "recruiter" ? "/recruiter" : "/admin");
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-wrap">
      <form className="form-card" onSubmit={submit}>
        <span className="eyebrow">SECURE WORKSPACE</span>
        <h1>Welcome back.</h1>
        <p>Sign in to your recruiter or provisioned administrator account.</p>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        <label>
          Administrator code <small>(admins only)</small>
          <input
            name="otp"
            inputMode="numeric"
            pattern="[0-9]{6}"
            autoComplete="one-time-code"
          />
        </label>
        <button disabled={busy}>{busy ? "Signing in…" : "Sign in ↗"}</button>
        <p role="alert">{message}</p>
        <p>
          Hiring for the first time?{" "}
          <Link href="/register">Create recruiter account</Link>
        </p>
      </form>
    </div>
  );
}
