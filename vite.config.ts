import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import TSConfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./client",
  plugins: [TSConfigPaths({ root: process.cwd() }), vue(), vueJsx()],
  server: {
    port: Number(process.env.CLIENT_PORT) || 8080,
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.SERVER_PORT}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {},
  build: {
    outDir: path.resolve(process.env.DEST, process.env.CLIENT_DEST),
  },
});
