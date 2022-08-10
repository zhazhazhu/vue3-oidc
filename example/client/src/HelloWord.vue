<script lang="ts" setup>
import { unref } from "vue";
import { useRouter } from "vue-router";
import { useAuth, useOidcStore } from "vue3-oidc";

const { state } = useOidcStore();
const router = useRouter();

const { signinRedirect } = useAuth();

const handleSignIn = async () => {
  await signinRedirect();
};

const handleSignOut = () => {
  unref(state).userManager?.signoutRedirect();
};

const getUser = async () => {};

const routerPush = () => {
  router.push("/");
};
</script>

<template>
  <div>
    <div>Hello Vue3-Oidc</div>
    <router-link to="/publicRoute">Go Public Route</router-link>
  </div>
  <div>
    <button @click="handleSignIn">signIn</button>
    <button @click="handleSignOut">signOut</button>
    <button @click="getUser">getUser</button>
    <button @click="routerPush">router</button>
  </div>
</template>

<style lang="less" scoped></style>
