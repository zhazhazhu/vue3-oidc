import { defineComponent } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const router = useRouter();
    setTimeout(() => {
      router.replace("/");
    }, 2000);
    return () => <h1>Error in authentication</h1>;
  },
});
