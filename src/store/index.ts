import { MaybeNull } from "@/types";
import { OidcClientSettings, User, UserManager } from "oidc-client-ts";
import { computed, ComputedRef, reactive, UnwrapNestedRefs } from "vue";
import { useAuth } from "../useAuth";
import { inlineOidcEvents } from "./events";

export interface VueOidcSettings extends OidcClientSettings {
  /**
   *  redirect callback is login success after
   */
  onSigninRedirectCallback?: (user: User) => void;
}

export interface OidcState {
  oidcSettings: MaybeNull<VueOidcSettings>;
  userManager: MaybeNull<UserManager>;
  user: MaybeNull<User>;
  token: ComputedRef<string | null>;
}

export interface OidcActions {
  setUser(user: User): void;
  removeUser(): void;
}

const state: UnwrapNestedRefs<OidcState> = reactive<OidcState>({
  oidcSettings: null,
  userManager: null,
  user: null,
  token: computed(() => state.user?.access_token || null),
});

const actions: OidcActions = {
  setUser(user: User) {
    state.user = user;
  },
  removeUser() {
    state.userManager;
  },
};

export interface CreateOidcOptions {
  oidcSettings: VueOidcSettings;
  auth?: boolean;
}

export function createOidc(options: CreateOidcOptions) {
  const { oidcSettings, auth } = options;

  state.oidcSettings = oidcSettings;
  state.userManager = new UserManager(oidcSettings);
  //add event listeners to the oidc client
  Object.keys(inlineOidcEvents).forEach((key) => {
    state.userManager!.events[key](inlineOidcEvents[key]);
  });

  const { autoAuthenticate } = useAuth();

  if (auth && autoAuthenticate) autoAuthenticate();
}

export function useOidcStore(): {
  state: ComputedRef<UnwrapNestedRefs<OidcState>>;
  actions: ComputedRef<OidcActions>;
} {
  return { state: computed(() => state), actions: computed(() => actions) };
}
