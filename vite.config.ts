import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import TSConfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./client",
  plugins: [TSConfigPaths({ root: process.cwd() }), vue(), vueJsx()],
  server: {
    port: Number(process.env.CLIENT_PORT) || 8080,
  },
  resolve: {},
  build: {
    outDir: `${process.env.DEST}/${process.env.CLIENT_DEST}`,
  },
});
