import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import {VitePWA} from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Harker Bell Schedule",
        short_name: "Harker Bell",
        display: "standalone",
      },
      workbox: {
        
      },
    }),
  ],
});
