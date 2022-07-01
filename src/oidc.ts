import {
  SigninPopupArgs,
  SigninRedirectArgs,
  SignoutPopupArgs,
  SignoutRedirectArgs,
} from "oidc-client-ts";
import { RouteLocationNormalized } from "vue-router";
import {
  cancelOidcLocalStorage,
  createSignInCallback,
  handleStartSignIn,
  removeOidcUser,
} from "./baseHandlers";
import {
  OidcMethodKeys,
  OidcSigninMethodKeys,
  OidcSignoutMethodKeys,
} from "./index";
import { userMgr } from "./variable";

export async function startOidc(
  route: RouteLocationNormalized,
  method: OidcMethodKeys = "redirect"
) {
  await handleStartSignIn(route, method);
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
  cancelOidcLocalStorage();
  await removeOidcUser();
  // await userMgr.value?.signoutPopup(args);
  await userMgr.value?.[method](args);
}

export async function signinRedirect(
  route: RouteLocationNormalized,
  method: OidcMethodKeys = "redirect",
  args?: SigninRedirectArgs
) {
  await handleStartSignIn(route, method, args);
}

export async function signInPopup(
  route: RouteLocationNormalized,
  method: OidcMethodKeys = "popup",
  args?: SigninPopupArgs
) {
  await handleStartSignIn(route, method, args);
}

export async function signOutRedirect(args?: SignoutRedirectArgs) {
  await signOut("signoutRedirect", args);
}

export async function signOutPopup(args?: SignoutPopupArgs) {
  await signOut("signoutPopup", args);
}
