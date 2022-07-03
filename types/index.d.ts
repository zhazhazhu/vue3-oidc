import type { UserManagerSettings } from "oidc-client-ts";

export interface OidcSettings extends UserManagerSettings {}

export type PartialOidcSettings = Partial<OidcSettings>;
