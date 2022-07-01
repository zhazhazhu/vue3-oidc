<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useOidc } from "../../../src/index";

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

const route = useRoute();
const handleSignin = async () => {
  await signInPopup(route);
};

const handleSignOut = async () => {
  await signOut({});
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
  <div>helloWord</div>
  <button @click="handleSignin">signin</button>
  <button @click="handleSignOut">signOut</button>
  <button @click="getUserInfo">userInfo</button>
</template>

<style lang="less" scoped></style>
