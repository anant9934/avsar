export type Provider =
  | "core"
  | "collaborate"
  | "eris"
  | "connect"
  | "ai_learning"
  | "eora"
  | "payments";
export type IntegrationResult<T> =
  | { ok: true; value: T; source: Provider; verifiedAt: string }
  | {
      ok: false;
      reason:
        | "not_configured"
        | "provider_unavailable"
        | "invalid_proof"
        | "consent_required";
      retryable: boolean;
    };
export type IdentityProof = {
  issuer: string;
  subject: string;
  audience: string;
  expiresAt: string;
  verifiedAt: string;
  authorizedAt: string;
  accountStatus: "active" | "suspended";
};
export type AssessmentEvent = {
  eventId: string;
  assessmentId: string;
  applicationId: string;
  state: "invited" | "completed" | "cancelled";
  occurredAt: string;
};
export type InterviewEvent = {
  eventId: string;
  meetingId: string;
  applicationId: string;
  state: "invited" | "accepted" | "cancelled" | "completed";
  occurredAt: string;
};
export interface IdentityProviderAdapter {
  provider: "core" | "collaborate";
  verifyCallback(
    code: string,
    state: string,
    nonce: string,
  ): Promise<IntegrationResult<IdentityProof>>;
  revoke(subject: string): Promise<IntegrationResult<{ revoked: boolean }>>;
}
export interface AssessmentAdapter {
  request(
    applicationId: string,
    assessmentRef: string,
  ): Promise<IntegrationResult<{ requestId: string }>>;
  verifyEvent(
    payload: unknown,
    signature: string,
  ): Promise<IntegrationResult<AssessmentEvent>>;
}
export interface InterviewAdapter {
  createInvitation(
    applicationId: string,
    slots: string[],
  ): Promise<IntegrationResult<{ invitationId: string }>>;
  verifyEvent(
    payload: unknown,
    signature: string,
  ): Promise<IntegrationResult<InterviewEvent>>;
}
export interface LearningAdapter {
  getResources(
    skillIds: string[],
  ): Promise<IntegrationResult<{ id: string; title: string; url: string }[]>>;
}
export interface GuidanceAdapter {
  explain(text: string): Promise<IntegrationResult<{ explanation: string }>>;
}
export function unavailable<T>(): IntegrationResult<T> {
  return { ok: false, reason: "not_configured", retryable: false };
}
