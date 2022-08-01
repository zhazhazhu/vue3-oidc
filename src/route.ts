import { RouteLocationNormalized } from "vue-router";
import { isPublicRoute } from "./variable";

export const hasPublicRoute = (route: RouteLocationNormalized) => {
  isPublicRoute.value = route.meta?.isPublic ? true : false;
  return isPublicRoute.value;
};

/**
 * @public
 */
export const hasAuthParams = (location = window.location): boolean => {
  // response_mode: query
  let searchParams = new URLSearchParams(location.search);
  if (
    (searchParams.get("code") || searchParams.get("error")) &&
    searchParams.get("state")
  ) {
    return true;
  }

  // response_mode: fragment
  searchParams = new URLSearchParams(location.hash.replace("#", "?"));
  if (
    (searchParams.get("code") || searchParams.get("error")) &&
    searchParams.get("state")
  ) {
    return true;
  }

  return false;
};
