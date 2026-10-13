import type { Metadata } from "next";
import Link from "next/link";
import { products, productHref } from "@/lib/public-content";
import { publishedContent } from "@/lib/site-content";
export const metadata: Metadata = {
  title: "AI Tathastu Ecosystem | AVSAR",
  description:
    "Explore AI Tathastu products and see which AVSAR connections are currently available.",
};
export default async function Ecosystem() {
  const content = await publishedContent("ecosystem");
  return (
    <>
      <div className="route-head">
        <div className="container">
          <span className="eyebrow">AI TATHASTU ECOSYSTEM</span>
          <h1>One vision. More ways to grow.</h1>
          <p>
            AVSAR public browsing works independently. Private jobseeker actions
            require Core and Collaborate identity links, which are not connected yet.
          </p>
        </div>
      </div>
      <div className="container standalone-page">
        {[
          "Understand and Grow",
          "Connect and Collaborate",
          "Demonstrate and Advance",
        ].map((category) => (
          <section className="section" key={category}>
            <div className="section-title">
              <div>
                <span className="eyebrow">PRODUCT DIRECTORY</span>
                <h2>{category}</h2>
              </div>
            </div>
            <div className="ecosystem-grid">
              {products
                .filter((x) => x.category === category)
                .map((x) => (
                  <article className="ecosystem-card" key={x.key}>
                    <h3>{x.name}</h3>
                    <strong>{x.purpose}</strong>
                    <p>{content?.descriptions[x.key] || x.description}</p>
                    <div className="chip-row">
                      {x.features.map((f) => (
                        <span key={f}>{f}</span>
                      ))}
                    </div>
                    <span className="status-label">
                      {x.key === "AVSAR"
                        ? "AVSAR prelaunch"
                        : productHref(x.key)
                          ? "Official URL configured · no AVSAR integration"
                          : "Official URL not configured"}
                    </span>
                    {productHref(x.key) ? (
                      <a
                        className="text-link"
                        href={productHref(x.key)!}
                        target={x.key === "AVSAR" ? undefined : "_blank"}
                        rel={
                          x.key === "AVSAR" ? undefined : "noopener noreferrer"
                        }
                      >
                        Explore Product ↗
                      </a>
                    ) : (
                      <span className="muted-action">
                        Explore link unavailable
                      </span>
                    )}
                  </article>
                ))}
            </div>
          </section>
        ))}
        <p>
          <Link className="button-dark" href="/opportunities">
            Explore AVSAR opportunities ↗
          </Link>
        </p>
      </div>
    </>
  );
}
