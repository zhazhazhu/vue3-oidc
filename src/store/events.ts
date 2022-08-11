import { User } from "oidc-client-ts";

export const inlineOidcEvents = {
  addUserLoaded,
};

function addUserLoaded(user: User) {
  console.log(user);
}
