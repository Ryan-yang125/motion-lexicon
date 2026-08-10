import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("/node_modules/")) return undefined;
          if (id.includes("/node_modules/motion/") || id.includes("/node_modules/framer-motion/")) {
            return "motion-vendor";
          }
          const corePackages = [
            "/node_modules/react/",
            "/node_modules/react-dom/",
            "/node_modules/scheduler/",
            "/node_modules/@tanstack/",
            "/node_modules/i18next/",
            "/node_modules/react-i18next/",
            "/node_modules/react-helmet-async/"
          ];
          return corePackages.some((packagePath) => id.includes(packagePath))
            ? "vendor"
            : undefined;
        }
      }
    }
  }
});
