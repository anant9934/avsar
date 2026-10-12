import Link from "next/link";
export default function JobseekerSetup() {
  return (
    <div className="container workspace-page">
      <div className="workspace-head">
        <span className="eyebrow">JOBSEEKER ACCOUNT</span>
        <h1>Two verified links are required.</h1>
        <p>
          AVSAR jobseeker features require authenticated AI Tathastu Core and
          Collaborate accounts.
        </p>
      </div>
      <div className="workspace-grid">
        <section className="panel">
          <h2>1. AI Tathastu Core</h2>
          <p>
            Core must provide a signed identity proof with a stable subject
            identifier. Optional profile data needs separate consent.
          </p>
          <span className="pill">Connection unavailable</span>
        </section>
        <section className="panel">
          <h2>2. Collaborate by AI Tathastu</h2>
          <p>
            Collaborate must provide its own signed identity proof. Linking does
            not publish your professional profile.
          </p>
          <span className="pill">Connection unavailable</span>
        </section>
      </div>
      <div className="notice">
        Account linking is not active because verified provider contracts and
        credentials have not been supplied. Public opportunity browsing remains
        available. AVSAR will not simulate a link or accept an application
        without both proofs.
      </div>
      <p style={{ marginTop: 20 }}>
        <Link className="button-dark" href="/opportunities">
          Explore opportunities ↗
        </Link>
      </p>
    </div>
  );
}
