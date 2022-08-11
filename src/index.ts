import { UserManager } from "oidc-client-ts";
import { unref } from "vue";
import { useOidcStore } from "./store";
import { inlineOidcEvents } from "./store/events";
import { VueOidcSettings } from "./store/index";
import { useAuth } from "./useAuth";

const { state } = useOidcStore();

export interface CreateOidcOptions {
  oidcSettings: VueOidcSettings;
  /**
   * whether open autoAuthenticate
   */
  auth?: boolean;
}

export function createOidc(options: CreateOidcOptions) {
  const { oidcSettings, auth } = options;

  unref(state).oidcSettings = oidcSettings;
  unref(state).userManager = new UserManager(oidcSettings);
  //add event listeners to the oidc client
  Object.keys(inlineOidcEvents).forEach((key) => {
    unref(state).userManager!.events[key](inlineOidcEvents[key]);
  });

  const { autoAuthenticate } = useAuth();

  if (auth && autoAuthenticate) autoAuthenticate();
}

export * from "./store";
export * from "./types";
export * from "./useAuth";
