import { User, UserManager, UserProfile } from "oidc-client-ts";
import { ref } from "vue";
import { OidcSettings } from "../types";
import { OidcMethodMap } from "./index";

export enum OIDC_METHOD_KEYS {
  REDIRECT = "redirect",
  POPUP = "popup",
}

export enum OIDC_SIGNIN_METHOD_KEYS {
  SIGNIN_REDIRECT = "signinRedirect",
  SIGNIN_POPUP = "signinPopup",
}

export enum OIDC_SIGNOUT_METHOD_KEYS {
  SIGNOUT_REDIRECT = "signoutRedirect",
  SIGNOUT_POPUP = "signoutPopup",
}

export enum VARIABLE {
  OIDC_CLIENT_USER = "OIDC_CLIENT_USER",
  OIDC_CALLBACK_URI = "OIDC_CALLBACK_URI",
  OIDC_ACCESS_TOKEN = "OIDC_ACCESS_TOKEN",
}

export const OIDC_METHODS: {
  [key in `${OIDC_METHOD_KEYS}`]: {
    signInKey: `${OIDC_SIGNIN_METHOD_KEYS}`;
    signOutKey: `${OIDC_SIGNOUT_METHOD_KEYS}`;
    uriKey: "redirect_uri" | "popup_redirect_uri";
  };
} = {
  [OIDC_METHOD_KEYS.REDIRECT]: {
    signInKey: "signinRedirect",
    signOutKey: "signoutRedirect",
    uriKey: "redirect_uri",
  },
  [OIDC_METHOD_KEYS.POPUP]: {
    signInKey: "signinPopup",
    signOutKey: "signoutPopup",
    uriKey: "popup_redirect_uri",
  },
};

//oidc 身份配置
export const oidcSettings = ref<OidcSettings>();

//oidc 用户实例
export const userMgr = ref<UserManager>();

export const oidcUser = ref<User | null>();

export const oidcUserProfile = ref<UserProfile>();

//是否具有身份认证
export const hasAuthAccess = ref(false);

export const access_token = ref();

//是否在回调地址中
export const hasCallbackUri = ref(false);

//回调地址
export const oidcCallbackUri = ref("/");

export const tokenExpiresAt = ref(0);

export const isTokenExpiresAt = ref(false);

export const oidcMethodMap = ref<OidcMethodMap>(new Map());

export const oidcToken = ref<string | null>(null);
