import { UserManager, UserManagerEvents } from "oidc-client-ts";
import { unref } from "vue";
import { useOidcStore } from "./store";
import { inlineOidcEvents } from "./store/events";
import { VueOidcSettings } from "./store/index";
import { RefreshTokenConfig } from "./types";
import { useAuth } from "./useAuth";

const { state, actions } = useOidcStore();

export type VueOidcEvents = {
  [P in keyof UserManagerEvents]?: Parameters<UserManagerEvents[P]>[0];
};

const inlineCreateOidcOptions: Partial<CreateOidcOptions> = {
  refreshToken: {
    enable: false,
    time: 3000 * 10,
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
}

export function createOidc(options: CreateOidcOptions) {
  const _options = { ...inlineCreateOidcOptions, ...options };
  const { oidcSettings, auth } = _options;
  const events = { ...inlineOidcEvents, ...options.events };

  unref(state).settings = _options;
  unref(state).oidcSettings = oidcSettings;
  unref(state).userManager = new UserManager(oidcSettings);
  unref(state).refreshUserManager = new UserManager({
    ...oidcSettings,
    revokeTokenTypes: ["refresh_token"],
    automaticSilentRenew: false,
  });
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

  if (auth && autoAuthenticate) autoAuthenticate();
}

export * from "./store";
export * from "./types";
export * from "./useAuth";
