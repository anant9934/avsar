import type { opportunities, organizations } from "@/db/schema";

export const demoMode =
  process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview";

type Opportunity = typeof opportunities.$inferSelect;
type Organization = typeof organizations.$inferSelect;

const ownerId = "00000000-0000-4000-8000-000000000001";
const organizationId = "00000000-0000-4000-8000-000000000002";
const createdAt = new Date("2026-01-01T00:00:00.000Z");

export const demoOrganization: Organization = {
  id: organizationId,
  ownerId,
  legalName: "AVSAR Demo Organization",
  displayName: "AVSAR Demo Organization",
  website: "https://example.com",
  workEmail: "demo@example.com",
  category: "Demo only",
  authority: "Fixture",
  status: "demo",
  reviewReason: null,
  reviewerId: null,
  reviewedAt: null,
  createdAt,
};

const samples = [
  {
    id: "00000000-0000-4000-8000-000000000101",
    title: "Demo: Software Engineering Intern",
    type: "Internship",
    mode: "Hybrid",
    location: "Bengaluru, India",
    compensation: "Example stipend: ₹25,000/month",
    description: "Sample internship used to demonstrate AVSAR search and detail pages. This is not an open position.",
    responsibilities: "Build a small feature, review code, and explain technical decisions in a team setting.",
    requirements: "Student or recent graduate familiar with JavaScript and web fundamentals.",
  },
  {
    id: "00000000-0000-4000-8000-000000000102",
    title: "Demo: Remote Product Designer",
    type: "Job",
    mode: "Remote",
    location: "Remote, India",
    compensation: "Example salary: ₹8–12 LPA",
    description: "Sample design role used to demonstrate AVSAR filters. This is not an open position.",
    responsibilities: "Create interface flows, test prototypes, and document design decisions.",
    requirements: "Portfolio showing user research and accessible interface design.",
  },
  {
    id: "00000000-0000-4000-8000-000000000103",
    title: "Demo: Applied AI Research Fellow",
    type: "Research",
    mode: "Onsite",
    location: "Pune, India",
    compensation: "Example fellowship grant",
    description: "Sample research fellowship used to demonstrate AVSAR categories. This is not an open position.",
    responsibilities: "Review literature, run reproducible experiments, and write a short research report.",
    requirements: "Experience with Python, statistics, and responsible AI evaluation.",
  },
];

export const demoOpportunities: Opportunity[] = samples.map((sample, index) => ({
  ...sample,
  orgId: organizationId,
  preferred: "",
  employmentType: null,
  duration: null,
  eligibility: "Illustrative example only. No applications are accepted.",
  deadline: null,
  applicationMethod: "none",
  applicationUrl: null,
  status: "demo",
  version: 1,
  approvedVersion: null,
  sourceUrl: null,
  sourceCheckedAt: null,
  publishedAt: new Date(createdAt.getTime() + index * 86400000),
  createdAt,
  updatedAt: createdAt,
}));

export function searchDemoOpportunities(params: URLSearchParams) {
  const page = Math.max(1, Math.min(10000, Number(params.get("page")) || 1));
  const query = params.get("q")?.trim().toLowerCase().slice(0, 100);
  const type = params.get("type");
  const mode = params.get("mode");
  const location = params.get("location")?.trim().toLowerCase().slice(0, 100);
  const filtered = demoOpportunities.filter((item) =>
    (!query || `${item.title} ${item.description} ${item.requirements} ${demoOrganization.displayName}`.toLowerCase().includes(query)) &&
    (!type || item.type === type) &&
    (!mode || item.mode === mode) &&
    (!location || item.location.toLowerCase().includes(location)) &&
    (params.get("sort") !== "closing" || item.deadline),
  );
  if (params.get("sort") !== "oldest") filtered.reverse();
  const size = 12;
  return {
    items: filtered.slice((page - 1) * size, page * size).map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      description: item.description,
      requirements: item.requirements,
      location: item.location,
      mode: item.mode,
      compensation: item.compensation,
      deadline: item.deadline,
      publishedAt: item.publishedAt,
      organization: demoOrganization.displayName,
      organizationId,
    })),
    total: filtered.length,
    page,
    pageSize: size,
  };
}

export function getDemoOpportunity(id: string) {
  const opportunity = demoOpportunities.find((item) => item.id === id);
  return opportunity ? { opportunity, organization: demoOrganization } : null;
}
