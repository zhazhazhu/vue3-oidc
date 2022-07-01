import { RouteLocationNormalized } from "vue-router";
import { isPublicRoute } from "./variable";

export const hasPublicRoute = (route: RouteLocationNormalized) => {
  isPublicRoute.value = route.meta?.isPublic ? true : false;
  return isPublicRoute.value;
};
