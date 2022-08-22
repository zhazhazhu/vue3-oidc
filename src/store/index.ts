import { MaybeNull } from "@/types";
import {
  User,
  UserManager,
  UserManagerSettings,
  UserProfile,
} from "oidc-client-ts";
import { computed, ComputedRef, reactive, UnwrapNestedRefs } from "vue";

export interface VueOidcSettings extends UserManagerSettings {
  /**
   *  redirect callback is login success after
   */
  onSigninRedirectCallback?: (user: User) => void;
}

export type UseUserProfile<T = UserProfile> = T;

export type OidcUser<T = UserProfile> = User & {
  profile: UseUserProfile<T>;
};

export interface OidcState<T = UserProfile> {
  oidcSettings: MaybeNull<VueOidcSettings>;
  userManager: MaybeNull<UserManager>;
  user: MaybeNull<OidcUser<T>>;
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
    state.userManager?.storeUser(user);
  },
  async removeUser() {
    state.user = null;
    await state.userManager?.removeUser();
  },
};

export function useOidcStore<T = UserProfile>(): {
  state: ComputedRef<UnwrapNestedRefs<OidcState<T>>>;
  actions: ComputedRef<OidcActions>;
} {
  return {
    state: computed(() => state as UnwrapNestedRefs<OidcState<T>>),
    actions: computed(() => actions),
  };
}
