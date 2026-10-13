import type { IdentityProviderAdapter } from "@/modules/integrations/contracts";

export type RequiredProvider = "core" | "collaborate";

// Register adapters only after the corresponding provider contract and
// credentials have been tested. An absent adapter must never imply a link.
const adapters: Partial<Record<RequiredProvider, IdentityProviderAdapter>> = {};

export function identityProvider(provider: RequiredProvider) {
  return adapters[provider];
}

export function federationReady() {
  return Boolean(
    adapters.core &&
    adapters.collaborate &&
    process.env.CORE_OIDC_ISSUER &&
    process.env.CORE_OIDC_AUDIENCE &&
    process.env.COLLABORATE_OIDC_ISSUER &&
    process.env.COLLABORATE_OIDC_AUDIENCE,
  );
}
