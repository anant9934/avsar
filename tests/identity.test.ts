import { afterEach, describe, expect, it } from "vitest";
import {
  validateIdentityProof,
  InvalidIdentityProof,
} from "../src/modules/identity/linking";
import { federationReady } from "../src/modules/identity/providers";

const previous = {
  issuer: process.env.CORE_OIDC_ISSUER,
  audience: process.env.CORE_OIDC_AUDIENCE,
};
afterEach(() => {
  if (previous.issuer === undefined) delete process.env.CORE_OIDC_ISSUER;
  else process.env.CORE_OIDC_ISSUER = previous.issuer;
  if (previous.audience === undefined) delete process.env.CORE_OIDC_AUDIENCE;
  else process.env.CORE_OIDC_AUDIENCE = previous.audience;
});

describe("provider identity boundary", () => {
  const now = new Date("2026-10-13T12:00:00Z");
  const proof = {
    issuer: "https://core.example.test",
    subject: "pairwise-subject-123",
    audience: "avsar-client",
    verifiedAt: "2026-10-13T11:59:30Z",
    authorizedAt: "2026-10-13T11:59:00Z",
    expiresAt: "2026-10-13T12:10:00Z",
    accountStatus: "active" as const,
  };
  it("rejects proofs without a configured server-side provider contract", () => {
    delete process.env.CORE_OIDC_ISSUER;
    delete process.env.CORE_OIDC_AUDIENCE;
    expect(() => validateIdentityProof("core", proof, now)).toThrow(
      InvalidIdentityProof,
    );
    expect(federationReady()).toBe(false);
  });
  it("requires exact issuer, audience, active status, and fresh proof", () => {
    process.env.CORE_OIDC_ISSUER = proof.issuer;
    process.env.CORE_OIDC_AUDIENCE = proof.audience;
    expect(validateIdentityProof("core", proof, now).subject).toBe(
      proof.subject,
    );
    for (const invalid of [
      { issuer: "https://impostor.test" },
      { audience: "other-client" },
      { accountStatus: "suspended" as const },
      { expiresAt: "2026-10-13T11:00:00Z" },
      { verifiedAt: "2026-10-13T11:30:00Z" },
      { subject: "" },
    ])
      expect(() =>
        validateIdentityProof("core", { ...proof, ...invalid }, now),
      ).toThrow(InvalidIdentityProof);
  });
});
