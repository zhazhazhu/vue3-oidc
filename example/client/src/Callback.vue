<script lang="ts" setup>
import { computed, onMounted, unref } from "vue";
import { useRouter } from "vue-router";
import { useOidcStore } from "vue3-oidc";

const { state, actions } = useOidcStore();

const userManager = computed(() => state.value.userManager);

const router = useRouter();

/**
 * manually handle login and will save user to state
 * 手动处理登录并将用户保存到state
 */
onMounted(async () => {
  let user = (await unref(state).userManager?.getUser()) || unref(state).user;
  if (!user) {
    user = (await userManager.value?.signinRedirectCallback()) || null;
  }
  actions.value.setUser(user!);
  router.push("/home");
});
</script>

<template>
  <div>
    <h1>OIDC-CALLBACK</h1>
  </div>
</template>

<style lang="less" scoped></style>
