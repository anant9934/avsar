import type { Metadata } from "next";
import Link from "next/link";
import { getPublicPlans } from "@/lib/plans";
import { EventPing } from "@/components/EventPing";
import { FaqTabs } from "@/components/PublicTabs";
import { publishedContent } from "@/lib/site-content";
export const metadata: Metadata = {
  title: "Employer Pricing | AVSAR",
  description:
    "Compare AVSAR's proposed employer plans and understand free jobseeker access.",
};
export default async function Pricing() {
  const [copy, plans] = await Promise.all([
    publishedContent("pricing_copy"),
    getPublicPlans(),
  ]);
  return (
    <>
      <EventPing kind="pricing_viewed" />
      <div className="route-head">
        <div className="container">
          <span className="eyebrow">TRANSPARENT EMPLOYER PRICING</span>
          <h1>Hiring plans that work for your team.</h1>
          <p>
            {copy?.intro ||
              "Review proposed capacity and choose the right conversation for your organization."}
          </p>
        </div>
      </div>
      <div className="container standalone-page">
        <p className="honest-note">
          Paid plans are indicative. No payment provider, checkout,
          subscriptions, taxes or billing terms are configured. Contact us
          before making purchasing decisions.
        </p>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <article className="pricing-card" key={plan.name}>
              <span className="eyebrow">{plan.status}</span>
              <h2>{plan.name}</h2>
              <div className="price">{plan.price}</div>
              <ul>
                <li>{plan.listings}</li>
                <li>{plan.seats}</li>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link className="button-dark" href={plan.href}>
                {plan.action} ↗
              </Link>
            </article>
          ))}
        </div>
        <section className="section">
          <div className="section-title">
            <div>
              <span className="eyebrow">COMPARE PLANS</span>
              <h2>What changes as you grow?</h2>
            </div>
          </div>
          <div className="comparison-wrap">
            <table className="comparison">
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  {plans.map((p) => (
                    <th scope="col" key={p.name}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Active postings</th>
                  {plans.map((p) => (
                    <td key={p.name}>{p.listings}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Recruiter seats</th>
                  {plans.map((p) => (
                    <td key={p.name}>{p.seats}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Applicant management</th>
                  <td>Basic</td>
                  <td>Expanded · planned</td>
                  <td>Advanced · planned</td>
                  <td>By agreement</td>
                </tr>
                <tr>
                  <th scope="row">Interviews and assessments</th>
                  <td>Not configured</td>
                  <td>Scheduling planned</td>
                  <td>Eligible integrations only</td>
                  <td>Approved integrations only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="section split-info">
          <div>
            <span className="eyebrow">FAIR ACCESS</span>
            <h2>Free for jobseekers.</h2>
            <p>
              Browsing, standard applications, saved jobs and application
              tracking do not require payment. Paid plans cannot purchase
              employer verification or candidate ranking.
            </p>
          </div>
          <div className="panel">
            <h3>Before a listing goes live</h3>
            <p>
              Every organization must submit evidence for Admin verification.
              Each listing version is reviewed separately. A paid plan does not
              override either process.
            </p>
          </div>
        </section>
        <section className="section">
          <span className="eyebrow">BILLING & REFUNDS</span>
          <h2>Commercial terms are pending.</h2>
          <p>
            Paid checkout is disabled. Monthly billing, taxes, cancellation and
            refund terms will be published only after a provider and approved
            policies are configured.
          </p>
          <div className="action-row">
            <Link
              className="button-dark"
              href="/contact-sales?interest=Enterprise"
            >
              Contact Sales ↗
            </Link>
            <Link className="text-link" href="/for-employers">
              Employer guide →
            </Link>
          </div>
        </section>
        <section className="section">
          <span className="eyebrow">PRICING QUESTIONS</span>
          <h2>Frequently asked questions.</h2>
          <FaqTabs />
        </section>
      </div>
    </>
  );
}
