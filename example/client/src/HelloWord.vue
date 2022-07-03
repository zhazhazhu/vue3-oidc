<script lang="ts" setup>
import { useOidc } from "vue3-oidc";

const {
  signinRedirect,
  signInPopup,
  signOut,
  oidcUser,
  oidcUserProfile,
  oidcToken,
  tokenExpiresAt,
  isTokenExpiresAt,
} = useOidc();

const handleSignin = async () => {
  await signinRedirect();
};

const handleSignOut = async () => {
  await signOut();
};

const getUserInfo = () => {
  console.log(
    oidcUser.value,
    oidcUserProfile.value,
    oidcToken.value,
    tokenExpiresAt.value,
    isTokenExpiresAt.value
  );
};
</script>

<template>
  <div>
    <div>Hello Vue3-Oidc</div>
    <router-link to="/publicRoute">Go Public Route</router-link>
  </div>
  <div>
    <button @click="handleSignin">signin</button>
    <button @click="handleSignOut">signOut</button>
    <button @click="getUserInfo">userInfo</button>
  </div>
</template>

<style lang="less" scoped></style>
