import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/home",
    name: "Home",
    component: () => import("./Home.vue"),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes: routes,
});
