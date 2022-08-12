<h1>
Vue3-oidc
</h1>
<p>
Library of openid connect (oidc) and oauth2 integrated by oidc client, vue3
<p>

## 📦 Install

```bash
pnpm i vue3-oidc
```

## Running the Server Sample

```bash
$ cd example/server
$ npm install
$ npm run build
```

## Running the Client Sample

```bash
$ cd example/client
$ npm install
$ npm run dev
```

![vue3-oidc](https://cdn.jsdelivr.net/gh/zhazhazhu/image-hosting@master/root/image_ey5y0c_.jpeg)

## Getting Started

Configure the library by wrapping your application in `createOidc` and your initialization application when run createOidc:

```ts
//main.ts
import { createApp } from "vue";
import App from "./App.vue";
import "./oidc";
import router from "./router";

const app = createApp(App);

app.use(router);

app.mount("#app");
```

```ts
//oidc.ts
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
  events: {}, //your oidc customization callback events
});
```
