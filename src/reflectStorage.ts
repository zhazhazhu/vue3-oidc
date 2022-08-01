import { ref, watchEffect } from "vue";
import { createLocalStorage, getLocalStorage } from "./baseHandlers";
import { oidcCallbackUri, oidcToken, oidcUser, VARIABLE } from "./variable";

const isEffect = ref(true);

export function setupReflectStorage() {
  if (!isEffect.value) return;
  isEffect.value = false;

  //储存本地callback
  watchEffect(() => {
    if (!oidcCallbackUri.value) return;
    createLocalStorage(VARIABLE.OIDC_CALLBACK_URI, oidcCallbackUri.value);
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
    createLocalStorage(VARIABLE.OIDC_ACCESS_TOKEN, oidcToken.value);
  });
}

export function setupLocationState() {
  oidcCallbackUri.value = getLocalStorage(VARIABLE.OIDC_CALLBACK_URI) || "/";

  oidcUser.value = getLocalStorage(VARIABLE.OIDC_CLIENT_USER)
    ? JSON.parse(getLocalStorage(VARIABLE.OIDC_CLIENT_USER) || "")
    : null;

  oidcToken.value = getLocalStorage(VARIABLE.OIDC_ACCESS_TOKEN);
}
