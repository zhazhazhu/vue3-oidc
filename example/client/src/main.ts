import { createApp } from "vue";
import { setupOidc } from "../../../src";
import App from "./App.vue";
import router from "./router";
import { oidcSettings } from "./router/utils/oidc";

const app = createApp(App);

setupOidc(oidcSettings);

app.use(router);

app.mount("#app");
