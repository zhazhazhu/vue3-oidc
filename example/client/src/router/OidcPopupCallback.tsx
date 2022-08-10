import { defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter();
    onMounted(async () => {});
    return () => <span>授权成功·····</span>;
  },
});
