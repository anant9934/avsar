import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
export const metadata: Metadata = {
  title: "AVSAR — Every Opportunity. A Fair Chance.",
  description:
    "Explore verified opportunities with fair access and clear information.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="container nav">
            <Link className="brand" href="/">
              <span className="brand-mark">↗</span>
              <span>
                avsar<span className="accent">.</span>
                <small>BY AI TATHASTU</small>
              </span>
            </Link>
            <nav aria-label="Primary navigation">
              <Link href="/opportunities">Explore</Link>
              <Link href="/opportunities?type=Internship">Internships</Link>
              <Link href="/opportunities?type=Research">Research</Link>
              <Link href="/for-employers">For employers</Link>
              <Link href="/admin">Admin</Link>
            </nav>
            <Link className="nav-action" href="/login">
              Sign in ↗
            </Link>
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="container footer-inner">
            <div>
              <strong>avsar.</strong>
              <p>Every Opportunity. A Fair Chance.</p>
            </div>
            <div className="footer-links">
              <Link href="/how-it-works">How it works</Link>
              <Link href="/fair-access">Fair access</Link>
              <Link href="/trust-safety">Trust & safety</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/help">Help</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/legal">Legal</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
