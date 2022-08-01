import { SigninPopupArgs, SigninRedirectArgs, User } from "oidc-client-ts";
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { OidcSettings, PartialOidcSettings } from "../types/index";
import { OidcMethodKeys } from "./index";
import { hasPublicRoute } from "./route";
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

interface StartSignInEffectRoute {
  to: RouteLocationNormalized;
  form: RouteLocationNormalized;
  next: NavigationGuardNext;
}

export async function startSignInEffect(
  method: OidcMethodKeys = "redirect",
  route: StartSignInEffectRoute,
  args?: SigninRedirectArgs | SigninPopupArgs
) {
  const { to, form, next } = route;

  const isPublicRoute = hasPublicRoute(to);

  const user = await useOidcUser();

  const path = to.path;

  const fullRoute = to.fullPath;

  const activeOidc = oidcMethodMap.value.get(method);

  //储存回调地址
  if (origin + path !== activeOidc?.uri) {
    oidcCallbackUri.value = fullRoute;
  }

  //用戶沒登陸並且不在公開路由中
  if (!user && !isPublicRoute)
    if (origin + path !== activeOidc?.uri) {
      //判断当前路由是否是回调地址//不在则重新向到登录页
      hasCallbackUri.value = false;

      await activeOidc?.signin(args || {});

      hasAuthAccess.value = true;
    } else {
      hasCallbackUri.value = true;
    }
  if (user) {
    setOidcUser(user);

    //判断过期时间是否到了
    await handleTokenExpiresAt();

    hasAuthAccess.value = true;
  }

  if (hasCallbackUri.value || hasAuthAccess.value || isPublicRoute) return true;
  else return false;
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

export function setOidcUser(user: User | null) {
  oidcUser.value = user;
  oidcUserProfile.value = user?.profile;
  oidcToken.value = user?.access_token || null;
  tokenExpiresAt.value = oidcUser.value?.expires_at || Date.now() + 1000;
}

export async function handleTokenExpiresAt() {
  const now = Date.now() / 1000;

  isTokenExpiresAt.value = false;

  if (tokenExpiresAt.value <= now) {
    isTokenExpiresAt.value = true;
    cancelOidcLocalStorage();
    await removeOidcUser();
  }
}
