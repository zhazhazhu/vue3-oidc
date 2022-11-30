import { WebStorageStateStore } from "oidc-client-ts";
import { unref } from "vue";
import type { VueOidcSettings } from "vue3-oidc";
import { createOidc, useOidcStore } from "vue3-oidc";

const { state } = useOidcStore();

const oidcSettings: VueOidcSettings = {
  authority: "http://localhost:4000",
  scope: "openid",
  client_id: "your client id",
  client_secret: "your client secret",
  redirect_uri: origin + "/oidc-callback",
  post_logout_redirect_uri: origin + "/signout",
  response_type: "code",
  loadUserInfo: true,
  userStore: new WebStorageStateStore({
    prefix: "vue3-oidc",
    store: window.localStorage,
  }),
  onSigninRedirectCallback(user) {
    location.href = unref(state).redirect_uri || "/home";
  },
};

function runAuth() {
  createOidc({
    oidcSettings: oidcSettings, //your oidc settings
    auth: false, //if auth is true,will auto authenticate
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
