import { ref, watchEffect } from "vue";
import { createLocalStorage } from "./baseHandlers";
import { oidcCallbackUri, oidcToken, oidcUser, VARIABLE } from "./variable";

const isEffect = ref(true);

export function setupReflectStorage() {
  if (!isEffect.value) return;
  isEffect.value = false;

  //储存本地callback
  watchEffect(() => {
    if (!oidcCallbackUri.value) return;
    createLocalStorage(
      VARIABLE.OIDC_CALLBACK_URI,
      JSON.stringify(oidcCallbackUri.value)
    );
  });

  //储存本地User
  watchEffect(() => {
    if (!oidcUser.value) return;
    console.log("oidcUser", oidcUser.value);
    createLocalStorage(
      VARIABLE.OIDC_CLIENT_USER,
      JSON.stringify(oidcUser.value)
    );
  });

  watchEffect(() => {
    if (!oidcToken.value) return;
    createLocalStorage(
      VARIABLE.OIDC_ACCESS_TOKEN,
      JSON.stringify(oidcToken.value)
    );
  });
}
