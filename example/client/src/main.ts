import { createApp } from "vue";
import { createOidc } from "vue3-oidc";
import App from "./App.vue";
import router from "./router";
import { oidcSettings } from "./router/utils/oidc";

const app = createApp(App);

app.use(router);

createOidc({
  oidcSettings: {
    ...oidcSettings,
    onSigninRedirectCallback: (user) => {
      console.log(user);
      router.push("/");
    },
  },
  auth: true,
});

app.mount("#app");
