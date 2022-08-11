import type { VueOidcSettings } from "vue3-oidc";
import { createOidc } from "vue3-oidc";

const oidcSettings: VueOidcSettings = {
  authority: "http://localhost:4000",
  scope: "openid",
  client_id: "your client id",
  client_secret: "your client secret",
  redirect_uri: origin + "/oidc-callback",
  response_type: "code",
  loadUserInfo: true,
  onSigninRedirectCallback(user) {
    console.log(user);
    location.href = "/";
  },
};

createOidc({
  oidcSettings: oidcSettings, //your oidc settings
  auth: false, //if auth is true,will auto authenticate
});
