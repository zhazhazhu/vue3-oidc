import {
  SigninPopupArgs,
  SigninRedirectArgs,
  SignoutPopupArgs,
  SignoutRedirectArgs,
} from "oidc-client-ts";
import { Router } from "vue-router";
import {
  cancelOidcLocalStorage,
  createSignInCallback,
  removeOidcUser,
  setOidcUser,
  startSignInEffect,
} from "./baseHandlers";
import {
  OidcMethodKeys,
  OidcSigninMethodKeys,
  OidcSignoutMethodKeys,
} from "./index";
import { hasAuthParams } from "./route";
import { hasAuthAccess, oidcToken, userMgr } from "./variable";

export function oidcEffect(
  router: Router,
  method: OidcMethodKeys = "redirect",
  args?: SigninRedirectArgs | SigninPopupArgs
) {
  router.beforeEach(async (to, form, next) => {
    const isNext = await startSignInEffect(method, { to, form, next }, args);

    if (isNext) next();
  });
}

export async function signInRedirectCallback(url?: string) {
  return createSignInCallback("signinRedirectCallback", url);
}

export async function signInPopupCallback(url?: string) {
  return createSignInCallback("signinPopupCallback", url);
}

export async function signIn(
  method: OidcSigninMethodKeys,
  args?: SigninRedirectArgs | SigninPopupArgs
) {
  if (oidcToken.value) {
    const user = await userMgr.value?.getUser();
    setOidcUser(user!);
    hasAuthAccess.value = true;
  }
  if (!hasAuthAccess.value && !hasAuthParams()) {
    await userMgr.value?.[method](args);
    return false;
  }
  if (!hasAuthAccess.value && hasAuthParams()) {
    const user = await userMgr.value?.signinCallback();
    setOidcUser(user!);
    hasAuthAccess.value = true;
    return true;
  }
}

export async function signOut(
  method: OidcSignoutMethodKeys,
  args?: SignoutRedirectArgs | SignoutPopupArgs
) {
  cancelOidcLocalStorage();
  await removeOidcUser();
  await userMgr.value?.[method](args);
}

export async function signinRedirect(cb?: Function, args?: SigninRedirectArgs) {
  const pass = await signIn("signinRedirect", args);

  if (pass) {
    cb?.();
  }
}

export async function signInPopup(cb?: Function, args?: SigninPopupArgs) {
  const pass = await signIn("signinPopup", args);

  if (pass) {
    cb?.();
  }
}

export async function signOutRedirect(args?: SignoutRedirectArgs) {
  await signOut("signoutRedirect", args);
}

export async function signOutPopup(args?: SignoutPopupArgs) {
  await signOut("signoutPopup", args);
}
