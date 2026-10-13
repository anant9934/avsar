export const plans = [
  {
    name: "Starter",
    price: "Free",
    status: "Available account registration; limits are proposed",
    listings: "1 active opportunity",
    seats: "1 recruiter seat",
    features: ["Basic applicant management", "Standard Admin review"],
    action: "Start Free",
    href: "/register",
  },
  {
    name: "Growth",
    price: "₹1,499/month",
    status: "Proposed · checkout unavailable",
    listings: "Up to 5 active opportunities",
    seats: "2 recruiter seats",
    features: [
      "Expanded applicant management",
      "Interview scheduling when available",
    ],
    action: "Ask about Growth",
    href: "/contact-sales?interest=Growth",
  },
  {
    name: "Business",
    price: "₹4,999/month",
    status: "Proposed · checkout unavailable",
    listings: "Up to 20 active opportunities",
    seats: "5 recruiter seats",
    features: [
      "Advanced hiring workspace",
      "Enhanced reporting when available",
      "Eligible integrations when configured",
    ],
    action: "Ask about Business",
    href: "/contact-sales?interest=Business",
  },
  {
    name: "Enterprise",
    price: "Custom",
    status: "Contract discussion",
    listings: "Contract-based capacity",
    seats: "Team permissions by agreement",
    features: [
      "Institutional hiring",
      "Approved integrations",
      "Dedicated commercial arrangements",
    ],
    action: "Contact Sales",
    href: "/contact-sales?interest=Enterprise",
  },
] as const;

export const categories = [
  {
    name: "Full-time Jobs",
    type: "Job",
    description: "Explore professional roles and early-career openings.",
    icon: "↗",
  },
  {
    name: "Internships",
    type: "Internship",
    description: "Find practical experience and first industry steps.",
    icon: "✳",
  },
  {
    name: "Remote Opportunities",
    mode: "Remote",
    description: "Browse roles that allow remote work.",
    icon: "⌁",
  },
  {
    name: "Research Positions",
    type: "Research",
    description: "Discover research and academic projects.",
    icon: "◈",
  },
  {
    name: "Scholarships",
    type: "Scholarship",
    description: "Find published financial support opportunities.",
    icon: "✦",
  },
  {
    name: "Fellowships",
    type: "Fellowship",
    description: "Explore structured programs and fellowships.",
    icon: "◎",
  },
  {
    name: "Hackathons",
    type: "Hackathon",
    description: "Join innovation and building challenges.",
    icon: "◇",
  },
  {
    name: "Career Events",
    type: "Event",
    description: "Meet, learn and explore upcoming events.",
    icon: "▦",
  },
] as const;

export const categoryHref = (category: (typeof categories)[number]) =>
  `/opportunities?${"mode" in category ? `mode=${category.mode}` : `type=${category.type}`}`;

export const products = [
  {
    name: "AI Tathastu Core",
    category: "Understand and Grow",
    purpose: "Your personal growth and intelligence hub.",
    description:
      "Organize goals, skills, projects and career direction in a personalized workspace.",
    features: ["Person 360", "Goals", "Skills and evidence", "Career planning"],
    key: "CORE",
  },
  {
    name: "AI Tathastu Learn",
    category: "Understand and Grow",
    purpose: "Build the knowledge your goals require.",
    description:
      "Learning pathways and practical preparation for AI and related fields.",
    features: [
      "Learning paths",
      "AI/ML content",
      "Practical learning",
      "Progress",
    ],
    key: "LEARN",
  },
  {
    name: "EORA",
    category: "Understand and Grow",
    purpose: "Guidance across your journey.",
    description:
      "An ecosystem assistant concept for navigation and next-step guidance. Live AI assistance is not connected to AVSAR.",
    features: ["Navigation", "Guidance", "Preparation"],
    key: "EORA",
  },
  {
    name: "Collaborate",
    category: "Connect and Collaborate",
    purpose: "Build meaningful professional connections.",
    description:
      "Professional profiles, peers, mentors and project collaboration.",
    features: ["Profiles", "Networking", "Projects", "Messaging"],
    key: "COLLABORATE",
  },
  {
    name: "Connect / Meet",
    category: "Connect and Collaborate",
    purpose: "Meet, discuss and collaborate.",
    description:
      "Meeting and interview workflows envisioned for the ecosystem.",
    features: ["Meetings", "Interviews", "Screen sharing"],
    key: "CONNECT",
  },
  {
    name: "ERIS",
    category: "Demonstrate and Advance",
    purpose: "Demonstrate skills through structured assessments.",
    description:
      "Assessment and coding evaluation capabilities when configured.",
    features: ["Assessments", "Coding", "Evidence"],
    key: "ERIS",
  },
  {
    name: "AVSAR",
    category: "Demonstrate and Advance",
    purpose: "Find opportunities that move you forward.",
    description:
      "Search reviewed listings and use AVSAR recruitment workflows independently.",
    features: ["Opportunities", "Applications", "Hiring", "Verification"],
    key: "AVSAR",
  },
] as const;

export function productHref(key: string) {
  if (key === "AVSAR") return "/";
  const value = process.env[`NEXT_PUBLIC_${key}_OFFICIAL_URL`];
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
