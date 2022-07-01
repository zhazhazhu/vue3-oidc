import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useOidc } from "../../../../src/index";
import OidcCallback from "./OidcCallback";
import OidcCallbackError from "./OidcCallbackError";
import OidcPopupCallback from "./OidcPopupCallback";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "app",
    component: () => import("../App.vue"),
    redirect: "/helloWord",
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
        meta: {
          hidden: true,
          isPublic: true,
        },
      },
      {
        path: "/helloWord",
        name: "helloWord",
        component: () => import("../HelloWord.vue"),
      },
    ],
  },
];

const router = createRouter({
  routes: routes,
  history: createWebHistory(),
});

const { startOidc, hasAuthAccess, hasCallbackUri } = useOidc();

router.beforeEach(async (to, form, next) => {
  await startOidc(to, "popup");
  //如果isAccess or isCallback 则 next
  if (hasAuthAccess.value || hasCallbackUri.value) next();
  else next("/");
});

export default router;
