import { defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOidc } from "vue3-oidc";

export default defineComponent({
  setup() {
    const router = useRouter();
    const { signInPopupCallback } = useOidc();
    onMounted(async () => {
      const callbackUri = await signInPopupCallback();
      router.push(callbackUri.value);
    });
    return () => <span>授权成功·····</span>;
  },
});
