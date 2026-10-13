import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { identityLinks } from "@/db/schema";
import type { Actor } from "@/lib/auth";
import type { IdentityProof } from "@/modules/integrations/contracts";
import { identityProvider, type RequiredProvider } from "./providers";

export class IdentityLinkConflict extends Error {}
export class InvalidIdentityProof extends Error {}

function expectedIdentity(provider: RequiredProvider) {
  return provider === "core"
    ? {
        issuer: process.env.CORE_OIDC_ISSUER,
        audience: process.env.CORE_OIDC_AUDIENCE,
      }
    : {
        issuer: process.env.COLLABORATE_OIDC_ISSUER,
        audience: process.env.COLLABORATE_OIDC_AUDIENCE,
      };
}

/** Accept only proof returned by a trusted server-side provider adapter. */
export function validateIdentityProof(
  provider: RequiredProvider,
  proof: IdentityProof,
  now = new Date(),
) {
  const expected = expectedIdentity(provider);
  const verifiedAt = new Date(proof.verifiedAt);
  const authorizedAt = new Date(proof.authorizedAt);
  const expiresAt = new Date(proof.expiresAt);
  if (
    !expected.issuer ||
    !expected.audience ||
    proof.issuer !== expected.issuer ||
    proof.audience !== expected.audience ||
    !proof.subject ||
    proof.subject.length > 255 ||
    proof.accountStatus !== "active" ||
    !Number.isFinite(verifiedAt.getTime()) ||
    !Number.isFinite(authorizedAt.getTime()) ||
    !Number.isFinite(expiresAt.getTime()) ||
    verifiedAt.getTime() > now.getTime() + 60_000 ||
    verifiedAt.getTime() < now.getTime() - 5 * 60_000 ||
    authorizedAt.getTime() > verifiedAt.getTime() ||
    expiresAt.getTime() <= now.getTime()
  )
    throw new InvalidIdentityProof(
      "Provider identity proof is invalid or expired",
    );
  return {
    issuer: proof.issuer,
    subject: proof.subject,
    verifiedAt,
    authorizedAt,
  };
}

/** Never call this with browser claims; the adapter must verify the provider response first. */
async function recordVerifiedLink(
  actor: Actor,
  provider: RequiredProvider,
  proof: IdentityProof,
) {
  if (actor.role !== "jobseeker" || actor.status !== "active")
    throw new IdentityLinkConflict(
      "This account cannot link a jobseeker identity",
    );
  const accepted = validateIdentityProof(provider, proof);
  return db().transaction(async (tx) => {
    const [inserted] = await tx
      .insert(identityLinks)
      .values({ userId: actor.id, provider, ...accepted, status: "active" })
      .onConflictDoNothing()
      .returning({ id: identityLinks.id });
    if (inserted) return inserted.id;

    const [existing] = await tx
      .select({
        id: identityLinks.id,
        issuer: identityLinks.issuer,
        subject: identityLinks.subject,
      })
      .from(identityLinks)
      .where(
        and(
          eq(identityLinks.userId, actor.id),
          eq(identityLinks.provider, provider),
        ),
      )
      .limit(1);
    if (
      !existing ||
      existing.issuer !== accepted.issuer ||
      existing.subject !== accepted.subject
    )
      throw new IdentityLinkConflict(
        "Provider account is already linked or this account has a different link",
      );

    await tx
      .update(identityLinks)
      .set({
        status: "active",
        verifiedAt: accepted.verifiedAt,
        authorizedAt: accepted.authorizedAt,
      })
      .where(eq(identityLinks.id, existing.id));
    return existing.id;
  });
}

/** Browser input is limited to a short-lived authorization code/state/nonce. */
export async function completeProviderLink(
  actor: Actor,
  provider: RequiredProvider,
  code: string,
  state: string,
  nonce: string,
) {
  const adapter = identityProvider(provider);
  if (!adapter)
    throw new InvalidIdentityProof("Provider linking is unavailable");
  const result = await adapter.verifyCallback(code, state, nonce);
  if (!result.ok || result.source !== provider)
    throw new InvalidIdentityProof("Provider verification failed");
  return recordVerifiedLink(actor, provider, result.value);
}
