import {
  SigninRedirectArgs,
  SigninSilentArgs,
  SignoutRedirectArgs,
  User,
} from "oidc-client-ts";
import { ref, unref } from "vue";
import { useOidcStore } from "./store";
import { isPathOfCallback } from "./utils";

const { state, actions } = useOidcStore();

export const oidcRedirectUriKey = ref("OIDC_REDIRECT_URI");

export function useAuth() {
  return {
    autoAuthenticate,
    signinRedirect,
    signoutRedirect,
    refreshToken,
    setRedirectUri,
  };
}

async function signinRedirect(arg?: SigninRedirectArgs) {
  state.value.oidcSettings?.onBeforeSigninRedirectCallback &&
    (await state.value.oidcSettings?.onBeforeSigninRedirectCallback());
  if (!unref(state).user) {
    unref(state).userManager?.signinRedirect(arg);
  }
}

async function signoutRedirect(arg?: SignoutRedirectArgs) {
  await unref(state).userManager?.signoutRedirect(arg);
}

/**
 * @fn autoAuthenticate - will try to authenticate the user silently
 */
async function autoAuthenticate(uri: string = "") {
  let timer: NodeJS.Timer | null = null;
  const user = (await unref(state).userManager?.getUser()) || unref(state).user;

  //if the user and pathCallback is not, then we can authenticate
  if (!user && !isPathOfCallback()) {
    await unref(state).userManager?.settings.userStore?.set(
      oidcRedirectUriKey.value,
      uri || location.pathname + location.search || "/"
    );
    state.value.oidcSettings?.onBeforeSigninRedirectCallback &&
      (await state.value.oidcSettings?.onBeforeSigninRedirectCallback());
    await unref(state).userManager?.removeUser();
    await unref(state).userManager?.signinRedirect();
    return;
  }
  //if the user is not and pathCallback is, then we can set the user
  if (!user && isPathOfCallback()) {
    const user = await unref(state).userManager?.signinRedirectCallback();
    unref(state).oidcSettings?.onSigninRedirectCallback &&
      (await unref(state).oidcSettings?.onSigninRedirectCallback?.(user!));
    unref(actions).setUser(user!);
    return;
  }
  //if the user and pathCallback of true, then we can set the user
  if (user && !isPathOfCallback()) {
    if (timer) clearInterval(timer);

    unref(actions).setUser(user);

    useRefreshToken();
    //if the user has expired, then we can remove the user
    if (unref(state).hasExpiresAt) {
      await signoutRedirect();
      return;
    }
    return;
  }
  //if the user is and pathCallback is then we can recur set the user and run function name is onSigninRedirectCallback
  if (user && isPathOfCallback()) {
    timer = setInterval(async () => {
      unref(state).oidcSettings?.onSigninRedirectCallback &&
        (await unref(state).oidcSettings?.onSigninRedirectCallback?.(user));
      unref(actions).setUser(user);
    }, 3000);
    return;
  }
}

export function useRefreshToken() {
  const _config = state.value.settings?.refreshToken;
  if (_config?.enable) {
    setInterval(async () => {
      refreshToken();
    }, _config.time);
  }
}

function refreshToken(
  args?: SigninSilentArgs | undefined,
  fn1?: (user: User | null) => void | Promise<void>,
  fn2?: (error: any) => void | Promise<void>
) {
  const mgr = state.value.refreshUserManager;
  mgr
    ?.signinSilent(args)
    .then((res) => {
      res && unref(actions).setUser(res);
      fn1 && fn1(res);
    })
    .catch((err) => {
      fn2 && fn2(err);
    });
}

async function setRedirectUri(uri: string) {
  await unref(state).userManager?.settings.userStore?.set(
    oidcRedirectUriKey.value,
    uri
  );
}
