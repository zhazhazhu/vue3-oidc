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
import { createOidc, useOidcStore } from "vue3-oidc";
import { unref } from "vue";

const { state } = useOidcStore();

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
    location.href = unref(state).redirect_uri || "/";
  },
};

createOidc({
  oidcSettings: oidcSettings, //your oidc settings
  auth: true, //if auth is true,will auto authenticate
  events: {}, //your oidc customization callback events
});
```

### API

- useOidcStore

```ts
//type
import type { UserProfile } from "oidc-client-ts";
function useOidcStore<T>(): {
  state: ComputedRef<OidcState<T>>;
  actions: ComputedRef<OidcActions>;
};

interface OidcState<T = UserProfile> {
  oidcSettings: MaybeNull<VueOidcSettings>;
  userManager: MaybeNull<UserManager>;
  refreshUserManager: MaybeNull<UserManager>;
  user: MaybeNull<OidcUser<T>>;
  token: ComputedRef<string | null>;
  hasExpiresAt: ComputedRef<boolean>;
  redirect_uri: string;
}

interface OidcActions {
  setUser(user: User): void;
  removeUser(): void;
}

type OidcUser<T = UserProfile> = User & {
  profile: UseUserProfile<T>;
};

type UseUserProfile<T = UserProfile> = T;
```

- useAuth

```ts
//type
function useAuth(): {
  autoAuthenticate: typeof autoAuthenticate;
  signinRedirect: typeof signinRedirect;
  signoutRedirect: typeof signoutRedirect;
  refreshToken: typeof refreshToken;
};
//autoAuthenticate - will try to authenticate the user silently
function autoAuthenticate(): Promise<void>;
//signin callback
function signinRedirect(arg?: SigninRedirectArgs): void;
//signout callback
function signoutRedirect(arg?: SignoutRedirectArgs): void;
//refresh token
function refreshToken(
  arg?: SigninSilentArgs,
  success?: (user: User | null) => void | Promise<void>,
  fail?: (err: any) => void | Promise<void>
): void;
```
