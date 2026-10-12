export type ListingStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "published"
  | "needs_changes"
  | "rejected"
  | "suspended"
  | "closed";
const transitions: Record<ListingStatus, ListingStatus[]> = {
  draft: ["submitted"],
  submitted: ["approved", "needs_changes", "rejected"],
  approved: ["published", "rejected"],
  published: ["suspended", "closed"],
  needs_changes: ["submitted"],
  rejected: [],
  suspended: ["approved"],
  closed: [],
};
export function canTransition(from: ListingStatus, to: ListingStatus) {
  return transitions[from]?.includes(to) ?? false;
}
export function isPublicListing(
  status: string,
  orgStatus: string,
  deadline: Date | null,
  approvedVersion: number | null,
  version: number,
) {
  return (
    status === "published" &&
    orgStatus === "approved" &&
    approvedVersion === version &&
    (!deadline || deadline.getTime() > Date.now())
  );
}
export function canActivateJobseeker(
  links: { provider: string; status: string }[],
) {
  return ["core", "collaborate"].every((provider) =>
    links.some((l) => l.provider === provider && l.status === "active"),
  );
}
export function starterQuota(active: number) {
  return active < 1;
}
