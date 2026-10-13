import type { Metadata } from "next";
import Link from "next/link";
import { publishedContent } from "@/lib/site-content";
export const metadata: Metadata = {
  title: "Career Resources | AVSAR",
  description:
    "Practical guidance for CVs, internships, eligibility, interviews, research and suspicious listings.",
};
const guides = [
  [
    "Build an effective CV",
    "Start with a concise summary tailored to the role. Describe projects with your actual contribution, tools used and outcome. Use clear dates and a readable format. Never claim a skill you cannot discuss.",
  ],
  [
    "Prepare for an internship",
    "Read the duties, location, dates, stipend and application method. Select two examples of relevant coursework or projects, and explain what you learned from each.",
  ],
  [
    "Understand job eligibility",
    "Separate required qualifications from preferred ones. Check deadlines and location rules. When a requirement is unclear, contact the publisher before sharing sensitive information.",
  ],
  [
    "Prepare for interviews",
    "Practice a short account of a project: the problem, your decisions, tradeoffs, result and what you would change. Prepare questions about the team and role.",
  ],
  [
    "Recognize suspicious postings",
    "Treat advance fees, pressure to move to personal messaging, unverifiable domains and early demands for identity documents as warning signs. Use AVSAR's listing report form when concerned.",
  ],
  [
    "Apply for research opportunities",
    "Read the research question and expected methods. Explain your relevant coursework, technical work and why the specific project fits your interests. Cite work you actually completed.",
  ],
];
export default async function Resources() {
  const content = await publishedContent("resources");
  const articles = content?.articles.map((a) => [a.title, a.body]) || guides;
  return (
    <>
      <div className="route-head">
        <div className="container">
          <span className="eyebrow">RESOURCE CENTER</span>
          <h1>Useful advice for your next step.</h1>
          <p>
            Practical starting points for exploring, applying and staying safe.
          </p>
        </div>
      </div>
      <div className="container standalone-page resource-grid">
        {articles.map(([title, copy]) => (
          <article className="resource-card" key={title}>
            <span className="eyebrow">CAREER GUIDE</span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
        <p>
          <Link className="text-link" href="/opportunities">
            Explore current opportunities ↗
          </Link>
        </p>
      </div>
    </>
  );
}
