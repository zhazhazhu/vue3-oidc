import { createApp } from "vue";
import App from "./App.vue";
import { oidc } from "./oidc";
import router from "./router";

const app = createApp(App);

app.use(router);

oidc();

app.mount("#app");
