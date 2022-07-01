import {
  hasAuthAccess,
  hasCallbackUri,
  isTokenExpiresAt,
  oidcCallbackUri,
  oidcToken,
  oidcUser,
  oidcUserProfile,
  tokenExpiresAt,
  userMgr,
} from "./variable";

export const useOidcUser = async () => await userMgr.value?.getUser();

export const useUserInfo = () => oidcUserProfile;

export const useAuthenticated = () => hasAuthAccess;

export const useCallbackUri = () => oidcCallbackUri;

export const useTokenExpiresAt = () => tokenExpiresAt;

export const useIsTokenExpiresAt = () => isTokenExpiresAt;

export const useOidcToken = () => oidcToken;

export const useUser = () => oidcUser;

export const useIsCallback = () => hasCallbackUri;
