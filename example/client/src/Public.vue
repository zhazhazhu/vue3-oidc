<script lang="ts" setup>
import { useOidc } from "../../../src/index";

const { signinRedirect, signInPopup, signOut } = useOidc();

const handleSignIn = async () => {
  await signInPopup();
};
const handleSignOut = async () => {
  await signOut();
};
</script>

<template>
  <div>
    <div>Public Route</div>
    <router-link to="/helloWord">Go HelloWord Route</router-link>
  </div>
  <div>
    <button @click="handleSignIn">signIn</button>
    <button @click="handleSignOut">signOut</button>
  </div>
</template>

<style lang="less" scoped></style>
