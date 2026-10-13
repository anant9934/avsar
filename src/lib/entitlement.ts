import { eq } from "drizzle-orm";
import { db } from "@/db";
import { identityLinks } from "@/db/schema";
import { Actor } from "./auth";
import { canActivateJobseeker } from "./workflows";
import { federationReady } from "@/modules/identity/providers";
export async function entitlement(actor: Actor) {
  const links = await db()
    .select({
      provider: identityLinks.provider,
      issuer: identityLinks.issuer,
      subject: identityLinks.subject,
      status: identityLinks.status,
      verifiedAt: identityLinks.verifiedAt,
      authorizedAt: identityLinks.authorizedAt,
    })
    .from(identityLinks)
    .where(eq(identityLinks.userId, actor.id));
  return {
    active:
      actor.role === "jobseeker" &&
      federationReady() &&
      canActivateJobseeker(
        links.map((link) => ({
          provider: link.provider,
          status:
            link.authorizedAt &&
            link.subject &&
            link.issuer ===
              (link.provider === "core"
                ? process.env.CORE_OIDC_ISSUER
                : link.provider === "collaborate"
                  ? process.env.COLLABORATE_OIDC_ISSUER
                  : undefined)
              ? link.status
              : "pending",
        })),
      ),
    links: links.map((l) => ({
      provider: l.provider,
      status: l.status,
      verifiedAt: l.verifiedAt,
    })),
  };
}
