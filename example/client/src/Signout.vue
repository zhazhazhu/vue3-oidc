<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useAuth } from "vue3-oidc";
const router = useRouter();

/**
 * manually login will be redirected to the callback route
 * 手动登录会被重定向到回调路由
 */
const { signinRedirect } = useAuth();
</script>

<template>
  <div>
    <h1>暂未登录</h1>
    <button @click="router.push('/home')">Home</button>
    <button @click="signinRedirect!()">SignIn</button>
  </div>
</template>

<style lang="less" scoped></style>
