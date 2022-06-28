import { User, UserManager } from "oidc-client-ts";
import { Ref } from "vue";
import { OidcSettings } from "../types";
import { startOidc } from "./oidc";
import { useAuthenticated } from "./user";
import { access_token, oidcSettings, oidcUser, userMgr } from "./variable";

//使用useOidc
// const { start, isAccess, user } = useOidc();
// await start();

export interface UseOidcReturnType {
  start: () => void;
  isAccess: Ref<boolean>;
  oidcUser: Ref<User | null | undefined>;
  access_token: Ref<string>;
}

export function setupOidc(settings: OidcSettings) {
  oidcSettings.value = settings;
  userMgr.value = new UserManager(settings);
}

export function useOidc(): UseOidcReturnType {
  //是否认证成功
  const isAccess = useAuthenticated();

  //开始身份认证
  async function start() {
    await startOidc();
  }

  return {
    start,
    isAccess,
    oidcUser,
    access_token,
  };
}
