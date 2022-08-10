<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useAuth } from "vue3-oidc";

const router = useRouter();

const { signinRedirect } = useAuth();

const handleSignIn = async () => {
  await signinRedirect();
};

const routerPush = () => {
  router.push("/helloWord");
};
</script>

<template>
  <button @click="handleSignIn">signIn</button>
  <button @click="routerPush">router</button>
  <router-view />
</template>

<style lang="less" scoped></style>
