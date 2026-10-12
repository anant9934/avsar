import { describe, it, expect } from "vitest";
import {
  canTransition,
  isPublicListing,
  canActivateJobseeker,
  starterQuota,
} from "../src/lib/workflows";
import {
  safeExternalUrl,
  opportunitySchema,
  registerSchema,
} from "../src/lib/validation";
import { hashPassword, verifyPassword, verifyTotp } from "../src/lib/auth";
describe("publishing gate", () => {
  it("requires review before publication and forbids self publication", () => {
    expect(canTransition("draft", "published")).toBe(false);
    expect(canTransition("draft", "submitted")).toBe(true);
    expect(canTransition("submitted", "approved")).toBe(true);
    expect(canTransition("approved", "published")).toBe(true);
    expect(canTransition("suspended", "published")).toBe(false);
  });
  it("requires approved organization and version and current deadline", () => {
    expect(isPublicListing("published", "approved", null, 2, 2)).toBe(true);
    expect(isPublicListing("published", "submitted", null, 2, 2)).toBe(false);
    expect(isPublicListing("published", "approved", null, 1, 2)).toBe(false);
    expect(isPublicListing("published", "approved", new Date(0), 2, 2)).toBe(
      false,
    );
  });
  it("enforces the free listing quota", () => {
    expect(starterQuota(0)).toBe(true);
    expect(starterQuota(1)).toBe(false);
  });
});
describe("jobseeker entitlement", () => {
  it("never activates for missing or revoked provider proofs", () => {
    expect(canActivateJobseeker([])).toBe(false);
    expect(canActivateJobseeker([{ provider: "core", status: "active" }])).toBe(
      false,
    );
    expect(
      canActivateJobseeker([
        { provider: "core", status: "active" },
        { provider: "collaborate", status: "revoked" },
      ]),
    ).toBe(false);
    expect(
      canActivateJobseeker([
        { provider: "core", status: "active" },
        { provider: "collaborate", status: "active" },
      ]),
    ).toBe(true);
  });
});
describe("boundary validation", () => {
  it("rejects local and non-HTTPS application targets", () => {
    for (const url of [
      "http://example.com",
      "https://localhost/apply",
      "https://127.0.0.1/apply",
      "https://169.254.169.254/",
      "javascript:alert(1)",
    ])
      expect(safeExternalUrl(url)).toBe(false);
    expect(safeExternalUrl("https://company.example/jobs/apply")).toBe(true);
  });
  it("does not accept a weak recruiter password", () => {
    expect(
      registerSchema.safeParse({ email: "a@example.org", password: "short" })
        .success,
    ).toBe(false);
  });
  it("requires exact posting content", () => {
    expect(opportunitySchema.safeParse({ title: "Role" }).success).toBe(false);
  });
  it("checks passwords using a salted scrypt hash", () => {
    const h = hashPassword("correct horse battery");
    expect(h).not.toContain("correct horse");
    expect(verifyPassword("correct horse battery", h)).toBe(true);
    expect(verifyPassword("wrong", h)).toBe(false);
  });
  it("checks an RFC 6238 six-digit TOTP example", () => {
    expect(
      verifyTotp("287082", "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ", 59000),
    ).toBe(true);
    expect(
      verifyTotp("287083", "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ", 59000),
    ).toBe(false);
  });
});
