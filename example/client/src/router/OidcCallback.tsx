import { defineComponent, watchEffect } from "vue";

export default defineComponent({
  setup() {
    // const route = useRoute();
    watchEffect(async () => {
      // const user1 = await state.userManager?.signinRedirectCallback();
      // const user = await state.userManager?.getUser();
      // router.push("/helloWord");
    });
    return () => (
      <>
        <span>授权成功·····</span>
      </>
    );
  },
});
