"use client";
import { useEffect, useState } from "react";
type RecordInfo = {
  key: string;
  latestVersion: number;
  publishedVersion: number | null;
};
type Version = {
  key: string;
  version: number;
  state: string;
  body: unknown;
  createdAt: string;
};
const templates: Record<string, unknown> = {
  hero: {
    eyebrow: "YOUR NEXT OPPORTUNITY STARTS HERE",
    title: "Every Opportunity. A Fair Chance.",
    subtitle: "Find the right opportunity. Take the next step.",
    description:
      "Discover jobs, internships, research openings, scholarships and more.",
  },
  announcement: { text: "An AVSAR announcement", href: "/help" },
  categories: {
    descriptions: { "Full-time Jobs": "Explore professional roles." },
  },
  ecosystem: {
    descriptions: { CORE: "Explore personal growth tools when available." },
  },
  resources: {
    articles: [
      {
        title: "Prepare for an interview",
        body: "Review the role, select examples of your work, and explain the decisions you made and what you learned.",
      },
    ],
  },
  faq: {
    jobseekers: [
      {
        question: "Can I browse freely?",
        answer: "Yes, public listings are open to everyone.",
      },
    ],
    employers: [
      {
        question: "When can I publish?",
        answer: "After organization verification and listing approval.",
      },
    ],
  },
  pricing_copy: { intro: "Review proposed plans for your hiring team." },
  featured: { listingIds: [] },
  partner_logos: { partners: [] },
  footer_links: { links: [] },
};
export function ContentEditor() {
  const [keys, setKeys] = useState<string[]>([]);
  const [records, setRecords] = useState<RecordInfo[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [key, setKey] = useState("hero");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    fetch("/api/v1/admin/content")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setKeys(data.keys);
        setRecords(data.records);
        setVersions(data.versions);
        setBody(
          JSON.stringify(
            data.versions.find((v: Version) => v.key === "hero")?.body ||
              templates.hero,
            null,
            2,
          ),
        );
      })
      .catch(() => {});
  }, []);
  async function reload() {
    const res = await fetch("/api/v1/admin/content");
    if (!res.ok) return;
    const data = await res.json();
    setRecords(data.records);
    setVersions(data.versions);
    setBody(
      JSON.stringify(
        data.versions.find((v: Version) => v.key === key)?.body ||
          templates[key] ||
          {},
        null,
        2,
      ),
    );
  }
  function selectKey(next: string) {
    setKey(next);
    setBody(
      JSON.stringify(
        versions.find((v) => v.key === next)?.body || templates[next] || {},
        null,
        2,
      ),
    );
  }
  const record = records.find((r) => r.key === key);
  const history = versions.filter((v) => v.key === key);
  async function act(action: "save" | "publish" | "restore", version?: number) {
    setBusy(true);
    setMessage("");
    try {
      const payload =
        action === "save"
          ? { action, body: JSON.parse(body) }
          : { action, version };
      const res = await fetch(`/api/v1/admin/content/${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(
        action === "publish"
          ? `Version ${data.version} is now published.`
          : `Version ${data.version} saved as a draft. Publish it to make it public.`,
      );
      await reload();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Content update failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="panel content-editor">
      <h2>Public content editor</h2>
      <p>
        Plain text and safe links only. Save a draft, preview it below, then
        publish a version. Pricing amounts, verification policy and ecosystem
        URLs are controlled separately.
      </p>
      <label>
        Section
        <select value={key} onChange={(e) => selectKey(e.target.value)}>
          {keys.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <p>
        Published: {record?.publishedVersion || "none"} · Latest:{" "}
        {record?.latestVersion || 0}
      </p>
      <label>
        JSON content
        <textarea
          rows={13}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          spellCheck={false}
        />
      </label>
      <div className="action-row">
        <button disabled={busy} onClick={() => act("save")}>
          Save draft
        </button>
        {record?.latestVersion ? (
          <button
            disabled={busy}
            onClick={() => act("publish", record.latestVersion)}
          >
            Publish latest
          </button>
        ) : null}
      </div>
      <p role="status">{message}</p>
      <details>
        <summary>Preview current draft</summary>
        <pre>{body}</pre>
      </details>
      <h3>Version history</h3>
      {history.map((v) => (
        <div className="review-item" key={v.version}>
          <span>
            Version {v.version} ·{" "}
            {record?.publishedVersion === v.version ? "published" : v.state} ·{" "}
            {new Date(v.createdAt).toLocaleString()}
          </span>
          <div className="action-row">
            <button disabled={busy} onClick={() => act("publish", v.version)}>
              Publish
            </button>
            <button disabled={busy} onClick={() => act("restore", v.version)}>
              Restore as draft
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}
