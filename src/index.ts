import { UserManager, UserManagerEvents } from "oidc-client-ts";
import { unref } from "vue";
import { useOidcStore } from "./store";
import { inlineOidcEvents } from "./store/events";
import { VueOidcSettings } from "./store/index";
import { useAuth } from "./useAuth";

const { state } = useOidcStore();

export type VueOidcEvents = {
  [P in keyof UserManagerEvents]?: Parameters<UserManagerEvents[P]>[0];
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
}

export function createOidc(options: CreateOidcOptions) {
  const { oidcSettings, auth } = options;
  const events = { ...options.events, ...inlineOidcEvents };

  unref(state).oidcSettings = oidcSettings;
  unref(state).userManager = new UserManager(oidcSettings);
  //add event listeners to the oidc client
  Object.keys(events).forEach((key) => {
    unref(state).userManager!.events[key](events[key]);
  });

  const { autoAuthenticate } = useAuth();

  if (auth && autoAuthenticate) autoAuthenticate();
}

export * from "./store";
export * from "./types";
export * from "./useAuth";
