export const oidcSettings = {
  authority: "http://localhost:4500/oidc",
  scope: "email profile roles openid iduo.api",
  client_id: "INTERNAL00000000CODE",
  client_secret: "INTERNAL-b5d5-7eba-1d182998574a",
  redirect_uri: origin + "/oidc-callback",
  popup_redirect_uri: origin + "/oidc-popup-callback",
  response_type: "code",
  loadUserInfo: true,
};
