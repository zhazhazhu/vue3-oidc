import {
  SigninPopupArgs,
  SigninRedirectArgs,
  SignoutPopupArgs,
  SignoutRedirectArgs,
} from "oidc-client-ts";
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import {
  cancelOidcLocalStorage,
  createSignInCallback,
  removeOidcUser,
  startSignInEffect,
} from "./baseHandlers";
import {
  OidcMethodKeys,
  OidcSigninMethodKeys,
  OidcSignoutMethodKeys,
} from "./index";
import { userMgr } from "./variable";

export function oidcEffect(
  method: OidcMethodKeys = "redirect",
  args?: SigninRedirectArgs | SigninPopupArgs
) {
  return async (
    to: RouteLocationNormalized,
    form: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const isNext = await startSignInEffect(method, { to, form, next }, args);

    if (isNext) next();
  };
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
  await userMgr.value?.[method](args);
}

export async function signOut(
  method: OidcSignoutMethodKeys,
  args?: SignoutRedirectArgs | SignoutPopupArgs
) {
  debugger;
  cancelOidcLocalStorage();
  await removeOidcUser();
  await userMgr.value?.[method](args);
}

export async function signinRedirect(args?: SigninRedirectArgs) {
  await signIn("signinRedirect", args);
}

export async function signInPopup(args?: SigninPopupArgs) {
  await signIn("signinPopup", args);
}

export async function signOutRedirect(args?: SignoutRedirectArgs) {
  await signOut("signoutRedirect", args);
}

export async function signOutPopup(args?: SignoutPopupArgs) {
  await signOut("signoutPopup", args);
}
