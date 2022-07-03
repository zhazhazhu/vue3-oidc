<h1>
Vue3-oidc
</h1>
<p>
Library of openid connect (oidc) and oauth2 integrated by oidc client, vue3 and Vue router
<p>

> Vitest requires Vue >=v3.2.37 and vue-router >=v4.0.16

```ts
//main.ts
//初始化oidc

import { setupOidc } from "vue3-oidc";

const oidcSettings = {
  authority: "",
  scope: "email profile roles openid",
  client_id: "",
  client_secret: "",
  redirect_uri: "",
  popup_redirect_uri: "",
  response_type: "code",
};

setupOidc(oidcSettings);
```

```ts
//router
import { createRouter, createWebHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "app",
    component: () => import("../App.vue"),
    redirect: "/publicRoute",
    children: [
      {
        path: "/oidc-callback",
        name: "oidcCallback",
        component: OidcCallback,
      },
      {
        path: "/oidc-popup-callback",
        name: "oidcPopupCallback",
        component: OidcPopupCallback,
      },
      {
        path: "/oidc-callback-error",
        name: "oidcCallbackError",
        component: OidcCallbackError,
      },
      {
        path: "/helloWord",
        name: "helloWord",
        component: HelloWord,
      },
      {
        path: "/publicRoute",
        name: "publicRoute",
        component: Public,
        meta: {
          isPublic: true, //公共路由
        },
      },
    ],
  },
];

const router = createRouter({
  routes: routes,
  history: createWebHistory(),
});

const { oidcEffect } = useOidc();

//创建路由中间件
//oidcEffect('redirect' || 'popup') 默认 redirect
router.beforeEach(oidcEffect());

export default router;
```
