import type { Metadata } from "next";
import { SalesForm } from "@/components/SalesForm";
export const metadata: Metadata = {
  title: "Contact Sales | AVSAR",
  description:
    "Ask AVSAR about proposed employer plans and institutional hiring.",
};
export default async function ContactSales({
  searchParams,
}: {
  searchParams: Promise<{ interest?: string }>;
}) {
  const { interest } = await searchParams;
  const chosen =
    interest === "Growth" ||
    interest === "Business" ||
    interest === "Enterprise"
      ? interest
      : "Enterprise";
  return (
    <>
      <div className="route-head">
        <div className="container">
          <span className="eyebrow">EMPLOYER ENQUIRIES</span>
          <h1>Tell us about your hiring needs.</h1>
          <p>
            Submit an enquiry for proposed plans or institutional hiring. We
            will show a reference if the request is stored.
          </p>
        </div>
      </div>
      <div className="container standalone-page">
        <SalesForm defaultInterest={chosen} />
      </div>
    </>
  );
}
