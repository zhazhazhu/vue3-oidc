import type { UserManagerSettings } from "oidc-client-ts";
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { OidcMethodKeys } from "../src/index";

export interface OidcSettings extends UserManagerSettings {}

export type PartialOidcSettings = Partial<OidcSettings>;

export type OidcEffect = (
  method: OidcMethodKeys = "redirect",
  args?: SigninRedirectArgs | SigninPopupArgs
) => (
  to: RouteLocationNormalized,
  form: RouteLocationNormalized,
  next: NavigationGuardNext
) => Promise<void>;
