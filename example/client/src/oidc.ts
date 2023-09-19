import { WebStorageStateStore } from "oidc-client-ts";
import { unref } from "vue";
import type { VueOidcSettings } from "vue3-oidc";
import { createOidc, useOidcStore } from "vue3-oidc";

const { state } = useOidcStore();

const oidcSettings: VueOidcSettings = {
  authority: "https://dev.iduo.cc:4500",
  scope: "email profile roles openid iduo.api offline_access",
  client_id: "INTERNAL00000000CODE",
  client_secret: "INTERNAL-b5d5-7eba-1d182998574a",
  redirect_uri: origin + "/oidc-callback",
  post_logout_redirect_uri: origin + "/signout",
  response_type: "code",
  loadUserInfo: true,
  userStore: new WebStorageStateStore({
    prefix: "vue3-oidc",
    store: window.sessionStorage,
  }),
  automaticSilentRenew: true,
  monitorSession: true,
  silent_redirect_uri: location.origin + "/silent-renew.html",
  onSigninRedirectCallback(user) {
    location.href = unref(state).redirect_uri || "/home";
  },
};

function runAuth() {
  createOidc({
    oidcSettings: oidcSettings, //your oidc settings
    auth: false, //if auth is true,will auto authenticate
    refreshToken: {
      enable: true,
      time: 10 * 1000,
    },
    //your oidc events
    events: {
      addUserLoaded: (user) => {
        console.log(user);
      },
      addUserSignedOut: () => {},
    },
  });
}

runAuth();
