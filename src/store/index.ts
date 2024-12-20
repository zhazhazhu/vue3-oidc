import { MaybeNull } from "@/index";
import {
  User,
  UserManager,
  UserManagerSettings,
  UserProfile,
} from "oidc-client-ts";
import { ComputedRef, UnwrapNestedRefs, computed, reactive } from "vue";
import { CreateOidcOptions } from "..";

export interface VueOidcSettings extends UserManagerSettings {
  /**
   *  redirect callback is login success after
   */
  onSigninRedirectCallback?: (user: User) => void;
  /**
   * redirect callback is login before
   */
  onBeforeSigninRedirectCallback?: () => void;
}

export type UseUserProfile<T = UserProfile> = T;

export type OidcUser<T = UserProfile> = User & {
  profile: UseUserProfile<T>;
};

export interface OidcState<T = UserProfile> {
  settings: MaybeNull<CreateOidcOptions>;
  oidcSettings: MaybeNull<VueOidcSettings>;
  userManager: MaybeNull<UserManager>;
  refreshUserManager: MaybeNull<UserManager>;
  user: MaybeNull<OidcUser<T>>;
  token: ComputedRef<string | null>;
  hasExpiresAt: ComputedRef<boolean>;
  redirect_uri: string;
}

export interface OidcActions {
  setUser(user: User): void;
  removeUser(): void;
}

const state: UnwrapNestedRefs<OidcState> = reactive<OidcState>({
  settings: null,
  oidcSettings: null,
  userManager: null,
  refreshUserManager: null,
  user: null,
  token: computed(() => state.user?.access_token || null),
  hasExpiresAt: computed(
    () => Date.now() / 1000 > state.user?.expires_at! || false
  ),
  redirect_uri: "",
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
