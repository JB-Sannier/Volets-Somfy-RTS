import { defineConfig } from "vite";
import { server, envVariables } from "./vite.config.docker-values.ts";
import react from "@vitejs/plugin-react";
/** @type {import('vite').UserConfig} */

// https://vite.dev/config/
export default defineConfig({
  base: "/",

  plugins: [react()],
  build: {
    outDir: "build-docker",
    chunkSizeWarningLimit: 2000,
  },
  server,

  define: envVariables,
});
