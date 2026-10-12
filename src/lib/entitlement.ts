import { eq } from "drizzle-orm";
import { db } from "@/db";
import { identityLinks } from "@/db/schema";
import { Actor } from "./auth";
import { canActivateJobseeker } from "./workflows";
export async function entitlement(actor: Actor) {
  const links = await db()
    .select({
      provider: identityLinks.provider,
      status: identityLinks.status,
      verifiedAt: identityLinks.verifiedAt,
    })
    .from(identityLinks)
    .where(eq(identityLinks.userId, actor.id));
  const requireEcosystemLinks = process.env.AVSAR_REQUIRE_ECOSYSTEM_LINKS !== "false";
  return {
    active:
      actor.role === "jobseeker" &&
      (requireEcosystemLinks ? canActivateJobseeker(links) : true),
    links: links.map((l) => ({
      provider: l.provider,
      status: l.status,
      verifiedAt: l.verifiedAt,
    })),
  };
}
