import { db } from "@/db";
import { employerPlans } from "@/db/schema";
import { plans } from "@/lib/public-content";
export type PublicPlan = {
  name: string;
  price: string;
  status: string;
  listings: string;
  seats: string;
  features: string[];
  action: string;
  href: string;
};
export async function getPublicPlans(): Promise<PublicPlan[]> {
  try {
    const rows = await db().select().from(employerPlans);
    return plans.map((fallback) => {
      const approved = rows.find((row) => row.name === fallback.name);
      if (
        !approved ||
        !Array.isArray(approved.features) ||
        !approved.features.every((x) => typeof x === "string")
      )
        return { ...fallback, features: [...fallback.features] };
      return {
        ...fallback,
        price: approved.priceLabel,
        status:
          fallback.name === "Starter"
            ? "Free account registration · one active listing"
            : "Admin-approved proposal · checkout unavailable",
        listings:
          approved.listingLimit === null
            ? "Contract-based capacity"
            : `Up to ${approved.listingLimit} active ${approved.listingLimit === 1 ? "opportunity" : "opportunities"}`,
        seats:
          approved.seatLimit === null
            ? "Team seats by agreement"
            : `${approved.seatLimit} recruiter ${approved.seatLimit === 1 ? "seat" : "seats"}`,
        features: approved.features,
      };
    });
  } catch {
    return plans.map((x) => ({ ...x, features: [...x.features] }));
  }
}
