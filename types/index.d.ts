import type { UserManagerSettings } from "oidc-client-ts";
import { RouteLocationNormalized } from "vue-router";
import { OidcMethodKeys } from "../src/index";

export interface OidcSettings extends UserManagerSettings {}

export type PartialOidcSettings = Partial<OidcSettings>;

export type OidcStart = (
  route: RouteLocationNormalized,
  method: OidcMethodKeys
) => Promise<void>;
