<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useAuth, useOidcStore } from "vue3-oidc";

const { signinRedirect, signoutRedirect, autoAuthenticate } = useAuth();

const { state } = useOidcStore();

const user = computed(() => state.value.user?.profile);

const signin = () => {
  signinRedirect();
  //The following operations are completed in the callback route
};

const signout = () => {
  signoutRedirect();
};

/**
 * you can also use autoAuthenticate() to automatically authenticate the user,
 * or call open auth of createOidc options
 */
onMounted(() => {
  autoAuthenticate();
});
</script>

<template>
  <div class="app">
    <!-- user avatar -->
    <div class="avatar">
      <template v-if="state.user">
        <img :src="(state.user.profile.avatar as string)" alt="avatar" />
      </template>
      <template v-else>
        <div>暂未登录</div>
      </template>
    </div>

    <h1>Hello Oidc</h1>

    <div>
      <button @click="signin">Signin</button>
      <button @click="signout">Signout</button>
    </div>

    <div class="divider"></div>

    <div class="user">
      <div><span>token:</span>{{ state?.token }}</div>
      <div><span>token_type:</span>{{ state?.user?.token_type }}</div>
      <div>
        <span> profile: </span>
        <div v-for="(item, key) in state.user?.profile">
          <span>{{ key }}:</span>{{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#app {
  width: 100%;
  height: 100%;
}
.app {
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}
img {
  width: 100%;
  height: 100%;
  border-radius: 100%;
}
.app .avatar {
  width: 100px;
  height: 100px;
  border-radius: 100%;
  background-color: #f7aedc;
  text-align: center;
  line-height: 100px;
  color: #474747;
}
button {
  width: 100px;
  height: 40px;
  margin: 5px;
}
.divider {
  width: 100%;
  height: 2px;
  background-color: #ebebeb;
  margin: 40px 0;
}
.user {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.user >>> div {
  margin: 8px;
  color: #636363;
}
.user >>> span {
  color: #18964e;
  margin: 0 8px;
}
</style>
