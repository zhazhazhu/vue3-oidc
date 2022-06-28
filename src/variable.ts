import { User, UserManager, UserProfile } from "oidc-client-ts";
import { ref } from "vue";
import { OidcSettings } from "../types";

//oidc 身份配置
export const oidcSettings = ref<OidcSettings>();

//oidc 用户实例
export const userMgr = ref<UserManager>();

export const oidcUser = ref<User | null>();

export const oidcUserProfile = ref<UserProfile>();

//是否具有身份认证
export const hasAuthAccess = ref(false);

export const access_token = ref();
