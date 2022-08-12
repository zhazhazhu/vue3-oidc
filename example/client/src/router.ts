import {
  createRouter,
  createWebHistory,
  RouterView,
  type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: RouterView,
    redirect: "/home",
  },
  /**
   * @route home into all pages,will be automatically authenticated,Please see the component
   * home下的所有子路由将会自动验证授权，具体请查看Home组件
   */
  {
    path: "/home",
    name: "Home",
    component: () => import("./Home.vue"),
  },
  {
    path: "/signout",
    name: "Signout",
    component: () => import("./Signout.vue"),
  },
  {
    path: "/oidc-callback",
    component: () => import("./Callback.vue"),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes: routes,
});
