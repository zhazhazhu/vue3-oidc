import { createApp } from "vue";
import { setupOidc, useOidc } from "vue3-oidc";
import App from "./App.vue";
import router from "./router";
import { oidcSettings } from "./router/utils/oidc";

const { oidcEffect } = useOidc();

const app = createApp(App);

setupOidc(oidcSettings);

oidcEffect(router);

app.use(router);

app.mount("#app");
