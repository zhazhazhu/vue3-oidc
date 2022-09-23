import { SigninRedirectArgs, SignoutRedirectArgs } from "oidc-client-ts";
import { unref } from "vue";
import { useOidcStore } from "./store";
import { isPathOfCallback } from "./utils";

const { state, actions } = useOidcStore();

export function useAuth() {
  return {
    autoAuthenticate,
    signinRedirect,
    signoutRedirect,
  };
}

function signinRedirect(arg?: SigninRedirectArgs) {
  if (!unref(state).user) {
    unref(state).userManager?.signinRedirect(arg);
  }
}

function signoutRedirect(arg?: SignoutRedirectArgs) {
  unref(state).userManager?.signoutRedirect(arg);
}

/**
 * @fn autoAuthenticate - will try to authenticate the user silently
 */
async function autoAuthenticate(uri: string = "") {
  const user = (await unref(state).userManager?.getUser()) || unref(state).user;

  //if the user and pathCallback is not, then we can authenticate
  if (!user && !isPathOfCallback()) {
    state.value.redirect_uri = uri || location.pathname || "/";
    await unref(state).userManager?.removeUser();
    await unref(state).userManager?.signinRedirect();
    return;
  }
  //if the user is not and pathCallback is, then we can set the user
  if (!user && isPathOfCallback()) {
    const user = await unref(state).userManager?.signinRedirectCallback();
    if (unref(state).oidcSettings?.onSigninRedirectCallback) {
      unref(state).oidcSettings!.onSigninRedirectCallback!(user!);
    }
    unref(actions).setUser(user!);
    return;
  }
  //if the user and pathCallback of true, then we can set the user
  if (user && !isPathOfCallback()) {
    unref(actions).setUser(user);
    //if the user has expired, then we can remove the user
    if (unref(state).hasExpiresAt) {
      await signoutRedirect();
      return;
    }
    return;
  }
}
