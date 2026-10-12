import { z } from "zod";
export const registerSchema = z.object({
  email: z
    .email()
    .max(254)
    .transform((x) => x.toLowerCase()),
  password: z.string().min(12).max(128),
});
export const loginSchema = registerSchema.extend({
  otp: z.string().optional(),
});
export const organizationSchema = z.object({
  legalName: z.string().trim().min(2).max(200),
  displayName: z.string().trim().min(2).max(120),
  website: z.url().refine((x) => new URL(x).protocol === "https:"),
  workEmail: z.email().max(254),
  category: z.string().trim().min(2).max(80),
  authority: z.string().trim().min(10).max(1000),
});
export const opportunitySchema = z
  .object({
    title: z.string().trim().min(5).max(180),
    type: z.enum([
      "Job",
      "Internship",
      "Research",
      "Scholarship",
      "Fellowship",
      "Hackathon",
      "Event",
    ]),
    description: z.string().trim().min(40).max(10000),
    responsibilities: z.string().trim().min(10).max(10000),
    requirements: z.string().trim().min(10).max(10000),
    preferred: z.string().trim().max(5000).default(""),
    location: z.string().trim().min(2).max(150),
    mode: z.enum(["Remote", "Hybrid", "Onsite"]),
    employmentType: z.string().trim().max(80).optional(),
    compensation: z.string().trim().max(150).optional(),
    duration: z.string().trim().max(100).optional(),
    eligibility: z.string().trim().min(10).max(5000),
    deadline: z.iso.datetime({ offset: true }).optional(),
    applicationMethod: z.enum(["external", "internal"]),
    applicationUrl: z.url().optional(),
    sourceUrl: z.url().optional(),
  })
  .superRefine((x, ctx) => {
    if (
      x.applicationMethod === "external" &&
      (!x.applicationUrl || !safeExternalUrl(x.applicationUrl))
    )
      ctx.addIssue({
        code: "custom",
        path: ["applicationUrl"],
        message: "A safe HTTPS application URL is required",
      });
    if (x.sourceUrl && !safeExternalUrl(x.sourceUrl))
      ctx.addIssue({
        code: "custom",
        path: ["sourceUrl"],
        message: "Source URL must be a public HTTPS address",
      });
  });
export function safeExternalUrl(raw: string) {
  try {
    const u = new URL(raw);
    const h = u.hostname.toLowerCase();
    return (
      u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      h.includes(".") &&
      !h.endsWith(".local") &&
      !/^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|0\.)/.test(
        h,
      )
    );
  } catch {
    return false;
  }
}
export const reportSchema = z.object({
  opportunityId: z.uuid().optional(),
  category: z.enum([
    "suspicious_fee",
    "impersonation",
    "harassment",
    "misleading",
    "accessibility",
    "other",
  ]),
  details: z.string().trim().min(10).max(2000),
});
export const decisionSchema = z.object({
  decision: z.enum([
    "approve",
    "reject",
    "needs_changes",
    "publish",
    "suspend",
  ]),
  reason: z.string().trim().min(10).max(2000),
});
