import { defineConfig } from "vite";
import { server, envVariables } from "./vite.config.wan-values.ts";
import react from "@vitejs/plugin-react";
/** @type {import('vite').UserConfig} */

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build-wan",
    chunkSizeWarningLimit: 2000,
  },
  server,
  define: envVariables,
});
