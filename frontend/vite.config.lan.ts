import { defineConfig } from "vite";
import { server, envVariables } from "./vite.config.lan-values.ts";
import react from "@vitejs/plugin-react";
/** @type {import('vite').UserConfig} */

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build-lan",
    chunkSizeWarningLimit: 2000,
  },
  server,
  define: envVariables,
});
