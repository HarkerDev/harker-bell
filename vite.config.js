import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    hmr: {
      host: "3000-b5428153-4c77-4278-af0e-30bfd8a1997c.ws-us03.gitpod.io", // when using Gitpod
      port: 443,
    }
  },
});
