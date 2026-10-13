"use client";
import { useEffect, useState } from "react";
import { plans } from "@/lib/public-content";
type Row = {
  name: string;
  priceLabel: string;
  listingLimit: number | null;
  seatLimit: number | null;
  features: string[];
};
const defaults: Row[] = plans.map((p, i) => ({
  name: p.name,
  priceLabel: p.price,
  listingLimit: [1, 5, 20, null][i],
  seatLimit: [1, 2, 5, null][i],
  features: [...p.features],
}));
export function PlanEditor() {
  const [rows, setRows] = useState<Row[]>([]);
  const [name, setName] = useState("Starter");
  const [form, setForm] = useState<Row>(defaults[0]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    fetch("/api/v1/admin/plans")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setRows(data.items);
          setForm(
            data.items.find((x: Row) => x.name === "Starter") || defaults[0],
          );
        }
      })
      .catch(() => {});
  }, []);
  function select(next: string) {
    setName(next);
    setForm(
      rows.find((x) => x.name === next) ||
        defaults.find((x) => x.name === next)!,
    );
  }
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/v1/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRows((old) => [...old.filter((x) => x.name !== form.name), form]);
      setMessage(
        "Plan proposal approved and saved. Paid checkout remains disabled.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to save plan",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="panel plan-editor">
      <h2>Employer plan catalog</h2>
      <p>
        Super Admin may approve proposed prices and limits. Paid checkout
        remains disabled. Starter must stay free.
      </p>
      <form onSubmit={save}>
        <label>
          Plan
          <select value={name} onChange={(e) => select(e.target.value)}>
            {defaults.map((p) => (
              <option key={p.name}>{p.name}</option>
            ))}
          </select>
        </label>
        <label>
          Display price
          <input
            value={form.priceLabel}
            onChange={(e) => setForm({ ...form, priceLabel: e.target.value })}
            required
            maxLength={60}
            disabled={name === "Starter"}
          />
        </label>
        <label>
          Active listing limit <small>(blank for contract)</small>
          <input
            type="number"
            min={1}
            max={10000}
            value={form.listingLimit ?? ""}
            disabled={name === "Starter"}
            onChange={(e) =>
              setForm({
                ...form,
                listingLimit: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </label>
        <label>
          Recruiter seats <small>(blank for contract)</small>
          <input
            type="number"
            min={1}
            max={1000}
            value={form.seatLimit ?? ""}
            disabled={name === "Starter"}
            onChange={(e) =>
              setForm({
                ...form,
                seatLimit: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </label>
        <label>
          Features <small>(one per line)</small>
          <textarea
            rows={6}
            value={form.features.join("\n")}
            onChange={(e) =>
              setForm({
                ...form,
                features: e.target.value
                  .split("\n")
                  .map((x) => x.trim())
                  .filter(Boolean),
              })
            }
          />
        </label>
        <button disabled={busy}>Approve proposal</button>
      </form>
      <p role="status">{message}</p>
    </section>
  );
}
