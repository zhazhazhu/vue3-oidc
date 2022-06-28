import { useOidcUser } from "./user";
import { access_token, hasAuthAccess, oidcUser } from "./variable";

export async function startOidc() {
  const user = await useOidcUser();

  oidcUser.value = user;

  access_token.value = user?.access_token;

  //认证成功
  hasAuthAccess.value = true;
}
