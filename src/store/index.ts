import { MaybeNull } from "@/types";
import { OidcClientSettings, User, UserManager } from "oidc-client-ts";
import { computed, ComputedRef, reactive, UnwrapNestedRefs } from "vue";

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
  hasExpiresAt: ComputedRef<boolean>;
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
  hasExpiresAt: computed(
    () => Date.now() / 1000 > state.user?.expires_at! || false
  ),
});

const actions: OidcActions = {
  setUser(user: User) {
    state.user = user;
  },
  async removeUser() {
    state.user = null;
    await state.userManager?.removeUser();
  },
};

export function useOidcStore(): {
  state: ComputedRef<UnwrapNestedRefs<OidcState>>;
  actions: ComputedRef<OidcActions>;
} {
  return { state: computed(() => state), actions: computed(() => actions) };
}
