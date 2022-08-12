import type { VueOidcSettings } from "vue3-oidc";
import { createOidc } from "vue3-oidc";
import router from "./router";

const oidcSettings: VueOidcSettings = {
  authority: "http://localhost:4000",
  scope: "openid",
  client_id: "your client id",
  client_secret: "your client secret",
  redirect_uri: origin + "/oidc-callback",
  post_logout_redirect_uri: origin + "/signout",
  response_type: "code",
  loadUserInfo: true,
  onSigninRedirectCallback(user) {
    router.push("/home");
  },
};

export function oidc() {
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
