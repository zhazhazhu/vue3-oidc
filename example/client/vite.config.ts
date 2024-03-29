import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        "silent-renew": resolve(__dirname, "silent-renew.html"),
      },
    },
  },
});
