/**
 *  @fn isPathOfCallback
 *  @brief Checks if the path is a callback path
 */
// export function isPathOfCallback(
//   location: Location = window.location
// ): boolean {
//   // response_mode: query
//   let searchParams = new URLSearchParams(location.search);
//   if (
//     (searchParams.get("code") || searchParams.get("error")) &&
//     searchParams.get("state")
//   ) {
//     return true;
//   }

//   // response_mode: fragment
//   searchParams = new URLSearchParams(location.hash.replace("#", "?"));
//   if (
//     (searchParams.get("code") || searchParams.get("error")) &&
//     searchParams.get("state")
//   ) {
//     return true;
//   }

//   return false;
// }

export function isPathOfCallback(
  location: Location = window.location
): boolean {
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
}

export type Awaitable<T> = Promise<T> | T;
