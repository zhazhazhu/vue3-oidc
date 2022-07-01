<script lang="ts" setup>
import { useOidc } from "../../../src/index";

const { signOut } = useOidc();
const handleSignOut = async () => {
  await signOut();
};
</script>

<template>
  <div>Public Route</div>
  <button @click="handleSignOut">signOut</button>
</template>

<style lang="less" scoped></style>
