import { hasAuthAccess, userMgr } from "./variable";

export const useOidcUser = async () => await userMgr.value?.getUser();

export const useUserInfo = async () => {};

export const useAuthenticated = () => hasAuthAccess;
