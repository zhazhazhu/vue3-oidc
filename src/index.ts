import {
  SigninPopupArgs,
  SigninRedirectArgs,
  SignoutRedirectArgs,
  User,
  UserManager,
  UserProfile,
} from "oidc-client-ts";
import { Ref } from "vue";
import { Router } from "vue-router";
import { OidcSettings } from "../types";
import { mergeOidcSettings, removeOidcUser, setOidcUser } from "./baseHandlers";
import {
  oidcEffect,
  signIn,
  signInPopup,
  signInPopupCallback,
  signinRedirect,
  signInRedirectCallback,
  signOut,
  signOutRedirect,
} from "./oidc";
import { setupReflectStorage } from "./reflectStorage";
import {
  useAuthenticated,
  useIsCallback,
  useIsTokenExpiresAt,
  useOidcToken,
  useTokenExpiresAt,
  useUser,
  useUserInfo,
} from "./user";
import {
  hasAuthAccess,
  hasCallbackUri,
  isTokenExpiresAt,
  oidcMethodMap,
  oidcSettings,
  oidcToken,
  oidcUser,
  oidcUserProfile,
  OIDC_METHODS,
  OIDC_METHOD_KEYS,
  OIDC_SIGNIN_METHOD_KEYS,
  OIDC_SIGNOUT_METHOD_KEYS,
  tokenExpiresAt,
  userMgr,
} from "./variable";

export type OidcMethodKeys = `${OIDC_METHOD_KEYS}`;

export type OidcSigninMethodKeys = `${OIDC_SIGNIN_METHOD_KEYS}`;

export type OidcSignoutMethodKeys = `${OIDC_SIGNOUT_METHOD_KEYS}`;

export type OidcEffect = (
  router: Router,
  method?: OidcMethodKeys,
  args?: SigninRedirectArgs | SigninPopupArgs
) => void;

export type OidcMethodMap = Map<
  OidcMethodKeys,
  {
    uri: string;
    signin: (args: SigninRedirectArgs | SigninPopupArgs) => Promise<void>;
    signOut: (args: SigninRedirectArgs | SigninPopupArgs) => Promise<void>;
  }
>;

export interface UseOidcReturnType<T = UserProfile> {
  tokenExpiresAt: Ref<number>;
  isTokenExpiresAt: Ref<boolean>;
  oidcToken: Ref<string | null>;
  oidcUserProfile: Ref<T>;
  hasAuthAccess: Ref<boolean>;
  hasCallbackUri: Ref<boolean>;
  oidcUser: Ref<User | null | undefined>;
  userMgr: Ref<UserManager | undefined>;
  oidcEffect: OidcEffect;
  signinRedirect: (args?: SigninRedirectArgs) => Promise<void>;
  signInPopup: (args?: SigninPopupArgs) => Promise<void>;
  signInRedirectCallback: (url?: string) => Promise<Ref<string>>;
  signInPopupCallback: (url?: string) => Promise<Ref<string>>;
  signOut: (args?: SignoutRedirectArgs) => Promise<void>;
  removeOidcUser: () => Promise<void>;
  setOidcUser: (user: User) => void;
}

export function setupOidc(settings: OidcSettings) {
  oidcSettings.value = mergeOidcSettings(settings);

  userMgr.value = new UserManager(oidcSettings.value);

  for (const k in OIDC_METHODS) {
    const key = k as OidcMethodKeys;

    oidcMethodMap.value.set(key, {
      uri: oidcSettings.value[OIDC_METHODS[key].uriKey] || "",

      signin: (args: SigninRedirectArgs | SigninPopupArgs) =>
        signIn(OIDC_METHODS[key].signInKey, args),

      signOut: (args: SigninRedirectArgs | SigninPopupArgs) =>
        signOut(OIDC_METHODS[key].signOutKey, args),
    });
  }
  //安装反应式存储
  setupReflectStorage();
}

export function useOidc<T>(): UseOidcReturnType<T> {
  return {
    tokenExpiresAt,
    isTokenExpiresAt,
    oidcUserProfile,
    oidcToken,
    hasAuthAccess,
    hasCallbackUri,
    oidcUser,
    userMgr,
    oidcEffect,
    signinRedirect,
    signInPopup,
    signInRedirectCallback,
    signInPopupCallback,
    signOut: signOutRedirect,
    removeOidcUser,
    setOidcUser,
  };
}

export {
  useTokenExpiresAt,
  useIsTokenExpiresAt,
  useUserInfo,
  useOidcToken,
  useAuthenticated,
  useIsCallback,
  useUser,
};
