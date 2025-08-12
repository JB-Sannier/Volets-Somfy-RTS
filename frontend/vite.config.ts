import { defineConfig } from "vite";
import { server } from "./vite.config.local.ts";
import react from "@vitejs/plugin-react";
/** @type {import('vite').UserConfig} */

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
  },
  server,
});
