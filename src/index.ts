import { UserManager, UserManagerEvents } from "oidc-client-ts";
import { unref } from "vue";
import { useOidcStore } from "./store";
import { inlineOidcEvents } from "./store/events";
import { VueOidcSettings } from "./store/index";
import { oidcRedirectUriKey, useAuth } from "./useAuth";

const { state, actions } = useOidcStore();

export type VueOidcEvents = {
  [P in keyof UserManagerEvents]?: Parameters<UserManagerEvents[P]>[0];
};

export type MaybeNull<T> = T | null;

export interface RefreshTokenConfig {
  enable?: boolean;
  time?: number;
  settings?: VueOidcSettings | null;
}

const inlineCreateOidcOptions: Partial<CreateOidcOptions> = {
  refreshToken: {
    enable: false,
    time: 3000 * 10,
    settings: null,
  },
};

export interface CreateOidcOptions {
  oidcSettings: VueOidcSettings;
  /**
   * whether open autoAuthenticate
   */
  auth?: boolean;
  /**
   * oidc events
   */
  events?: VueOidcEvents;
  /**
   * refresh token
   */
  refreshToken?: RefreshTokenConfig;
  /**
   * key of oidc redirect callback
   */
  redirectUriKey?: string;
}

export async function createOidc(options: CreateOidcOptions) {
  const _options = { ...inlineCreateOidcOptions, ...options };
  const { oidcSettings, auth, refreshToken } = _options;
  const events = { ...inlineOidcEvents, ...options.events };
  oidcRedirectUriKey.value = options.redirectUriKey || oidcRedirectUriKey.value;

  unref(state).redirect_uri =
    (await unref(state).settings?.oidcSettings.userStore?.get(
      oidcRedirectUriKey.value
    )) || "";
  unref(state).settings = _options;
  unref(state).oidcSettings = oidcSettings;
  unref(state).userManager = new UserManager(oidcSettings);
  unref(state).refreshUserManager = refreshToken?.settings
    ? new UserManager(refreshToken.settings)
    : null;
  //add event listeners to the oidc client
  Object.keys(events).forEach((key) => {
    unref(state).userManager!.events[key](events[key]);
  });

  unref(state)
    .userManager!.getUser()
    .then((user) => {
      actions.value.setUser(user!);
    });

  const { autoAuthenticate } = useAuth();

  if (auth && autoAuthenticate) await autoAuthenticate();
}

export * from "oidc-client-ts";
export * from "./store";
export * from "./useAuth";
