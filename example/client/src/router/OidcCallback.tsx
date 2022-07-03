import { defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOidc } from "vue3-oidc";

export default defineComponent({
  setup() {
    const router = useRouter();
    onMounted(async () => {
      const { signInRedirectCallback } = useOidc();
      const callbackUri = await signInRedirectCallback();
      router.push(callbackUri.value);
    });
    return () => (
      <>
        <span>授权成功·····</span>
      </>
    );
  },
});
