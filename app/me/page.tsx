import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { applications, opportunities, saved } from "@/db/schema";
import { currentUser } from "@/lib/auth";
import { entitlement } from "@/lib/entitlement";
export const dynamic = "force-dynamic";
export default async function MyWorkspace() {
  let actor: Awaited<ReturnType<typeof currentUser>> = null;
  try {
    actor = await currentUser();
  } catch {}
  if (!actor)
    return (
      <div className="container workspace-page">
        <div className="workspace-head">
          <span className="eyebrow">JOBSEEKER WORKSPACE</span>
          <h1>Keep your next steps together.</h1>
          <p>
            Public browsing is open. Saving and applying through AVSAR will
            require verified AI Tathastu Core and Collaborate accounts when
            provider linking becomes available.
          </p>
        </div>
        <div className="action-row">
          <Link className="button-dark" href="/login">
            Sign In ↗
          </Link>
          <Link className="text-link" href="/opportunities">
            Browse opportunities →
          </Link>
        </div>
      </div>
    );
  if (actor.role !== "jobseeker")
    return (
      <div className="container workspace-page">
        <h1>Jobseeker workspace</h1>
        <p>This workspace is for jobseeker accounts.</p>
        <Link
          className="text-link"
          href={actor.role === "recruiter" ? "/recruiter" : "/admin"}
        >
          Open your workspace ↗
        </Link>
      </div>
    );
  let access: Awaited<ReturnType<typeof entitlement>>;
  try {
    access = await entitlement(actor);
  } catch {
    return (
      <div className="container workspace-page">
        <h1>Workspace unavailable</h1>
        <p>Identity status could not be checked. Please try again later.</p>
      </div>
    );
  }
  if (!access.active)
    return (
      <div className="container workspace-page">
        <span className="eyebrow">JOBSEEKER ACCESS PENDING</span>
        <h1>Account linking is not available yet.</h1>
        <p>
          Saving and applying through AVSAR requires server-verified links to
          both AI Tathastu Core and Collaborate. Your public browsing access
          remains open. No profile is shared automatically.
        </p>
        <Link className="button-dark" href="/opportunities">
          Browse opportunities ↗
        </Link>
      </div>
    );
  let savedItems: { id: string; title: string }[] = [];
  let appItems: { id: string; title: string; status: string }[] = [];
  let available = true;
  try {
    const [s, a] = await Promise.all([
      db()
        .select({ id: opportunities.id, title: opportunities.title })
        .from(saved)
        .innerJoin(opportunities, eq(saved.opportunityId, opportunities.id))
        .where(eq(saved.userId, actor.id))
        .orderBy(desc(saved.createdAt))
        .limit(20),
      db()
        .select({
          id: opportunities.id,
          title: opportunities.title,
          status: applications.status,
        })
        .from(applications)
        .innerJoin(
          opportunities,
          eq(applications.opportunityId, opportunities.id),
        )
        .where(eq(applications.userId, actor.id))
        .orderBy(desc(applications.createdAt))
        .limit(20),
    ]);
    savedItems = s;
    appItems = a;
  } catch {
    available = false;
  }
  return (
    <div className="container workspace-page">
      <div className="workspace-head">
        <span className="eyebrow">YOUR AVSAR WORKSPACE</span>
        <h1>Welcome back.</h1>
        <p>
          Save openings and follow the applications you actually submitted
          through AVSAR.
        </p>
      </div>
      {!available ? (
        <div className="empty">Workspace data is temporarily unavailable.</div>
      ) : (
        <div className="workspace-grid">
          <section className="panel">
            <h2>Saved Opportunities</h2>
            {savedItems.length ? (
              savedItems.map((x) => (
                <p key={x.id}>
                  <Link className="text-link" href={`/opportunities/${x.id}`}>
                    {x.title} ↗
                  </Link>
                </p>
              ))
            ) : (
              <p>No saved opportunities yet.</p>
            )}
            <Link className="button-dark" href="/opportunities">
              Browse opportunities ↗
            </Link>
          </section>
          <section className="panel">
            <h2>Applications</h2>
            {appItems.length ? (
              appItems.map((x) => (
                <p key={x.id}>
                  <Link className="text-link" href={`/opportunities/${x.id}`}>
                    {x.title}
                  </Link>{" "}
                  · {x.status}
                </p>
              ))
            ) : (
              <p>No AVSAR applications yet.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
