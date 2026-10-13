import { describe, expect, it } from "vitest";
import {
  demoOpportunities,
  getDemoOpportunity,
  searchDemoOpportunities,
} from "../src/lib/demo-opportunities";

describe("preview opportunities", () => {
  it("marks every example as unapproved and without an application destination", () => {
    expect(demoOpportunities.length).toBeGreaterThan(0);
    for (const item of demoOpportunities) {
      expect(item.title).toMatch(/^Demo:/);
      expect(item.status).toBe("demo");
      expect(item.approvedVersion).toBeNull();
      expect(item.applicationUrl).toBeNull();
      expect(getDemoOpportunity(item.id)?.opportunity.id).toBe(item.id);
    }
  });

  it("filters examples and does not return unknown records", () => {
    const result = searchDemoOpportunities(
      new URLSearchParams({ type: "Internship", q: "engineering" }),
    );
    expect(result.total).toBe(1);
    expect(result.items[0].type).toBe("Internship");
    expect(getDemoOpportunity("00000000-0000-4000-8000-000000000999")).toBeNull();
  });
});
