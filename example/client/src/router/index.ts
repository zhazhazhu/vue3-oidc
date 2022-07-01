import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useOidc } from "../../../../src/index";
import HelloWord from "../HelloWord.vue";
import Public from "../Public.vue";
import OidcCallback from "./OidcCallback";
import OidcCallbackError from "./OidcCallbackError";
import OidcPopupCallback from "./OidcPopupCallback";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "app",
    component: () => import("../App.vue"),
    redirect: "/publicRoute",
    children: [
      {
        path: "/oidc-callback", // Needs to match redirectUri in you oidcSettings
        name: "oidcCallback",
        component: OidcCallback,
      },
      {
        path: "/oidc-popup-callback", // Needs to match popupRedirectUri in you oidcSettings
        name: "oidcPopupCallback",
        component: OidcPopupCallback,
      },
      {
        path: "/oidc-callback-error", // Needs to match redirect_uri in you oidcSettings
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
          isPublic: true,
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

router.beforeEach(oidcEffect());

export default router;
