import { SigninPopupArgs, SigninRedirectArgs, User } from "oidc-client-ts";
import { RouteLocationNormalized } from "vue-router";
import { OidcSettings, PartialOidcSettings } from "../types/index";
import { OidcMethodKeys } from "./index";
import { useCallbackUri, useOidcUser } from "./user";
import {
  hasAuthAccess,
  hasCallbackUri,
  isTokenExpiresAt,
  oidcCallbackUri,
  oidcMethodMap,
  oidcToken,
  oidcUser,
  oidcUserProfile,
  tokenExpiresAt,
  userMgr,
  VARIABLE,
} from "./variable";

type SignInCallbackMethods = "signinRedirectCallback" | "signinPopupCallback";

export async function createSignInCallback(
  methods: SignInCallbackMethods,
  url?: string
) {
  const user = await useOidcUser();

  oidcUser.value = user;

  if (!oidcUser.value) {
    const user = await userMgr.value?.[methods](url);
    if (user) {
      //认证成功
      setOidcUser(user);
      //判断过期时间是否到了
      handleTokenExpiresAt();
    }
  }
  return useCallbackUri();
}

export async function handleStartSignIn(
  route: RouteLocationNormalized,
  method: OidcMethodKeys = "redirect",
  args?: SigninRedirectArgs | SigninPopupArgs
) {
  const user = await useOidcUser();

  const path = route.path;

  const fullRoute = route.fullPath;

  const activeOidc = oidcMethodMap.value.get(method);

  //储存回调地址
  if (origin + path !== activeOidc?.uri) {
    oidcCallbackUri.value = fullRoute;
  }

  if (!user)
    if (origin + path !== activeOidc?.uri) {
      //判断当前路由是否是回调地址//不在则重新向到登录页
      await activeOidc?.signin(args || {});
      hasCallbackUri.value = false;
    } else {
      hasCallbackUri.value = true;
    }
  if (user) {
    hasAuthAccess.value = true;

    setOidcUser(user);

    //判断过期时间是否到了
    handleTokenExpiresAt();
  }
}

const inlineOidcSettings: PartialOidcSettings = {
  loadUserInfo: true, //加载用户信息
};

export function mergeOidcSettings(settings: OidcSettings) {
  return Object.assign(inlineOidcSettings, settings);
}

export function createLocalStorage(key: string, data: string) {
  window.localStorage.setItem(key, data);
}

export function cancelLocalStorage(key: string) {
  window.localStorage.removeItem(key);
}

export function cancelOidcLocalStorage() {
  cancelLocalStorage(VARIABLE.OIDC_CALLBACK_URI);
  cancelLocalStorage(VARIABLE.OIDC_CLIENT_USER);
  cancelLocalStorage(VARIABLE.OIDC_ACCESS_TOKEN);
}

export async function removeOidcUser() {
  await userMgr.value?.removeUser();
  await userMgr.value?.revokeTokens(["access_token", "refresh_token"]);
  userMgr.value?.clearStaleState();
  oidcUser.value = null;
  oidcToken.value = null;
}

export function setOidcUser(user: User) {
  oidcUser.value = user;
  oidcUserProfile.value = user?.profile;
  oidcToken.value = user?.access_token;
  tokenExpiresAt.value = oidcUser.value?.expires_at || Date.now() + 1000;
}

export function handleTokenExpiresAt() {
  const now = Date.now() / 1000;

  isTokenExpiresAt.value = false;

  if (tokenExpiresAt.value <= now) {
    isTokenExpiresAt.value = true;
    cancelOidcLocalStorage();
    removeOidcUser();
  }
}
