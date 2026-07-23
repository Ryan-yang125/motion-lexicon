import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("/node_modules/")) return undefined;
          if (id.includes("/node_modules/@radix-ui/")) return "editor-vendor";
          const corePackages = [
            "/node_modules/react/",
            "/node_modules/react-dom/",
            "/node_modules/scheduler/",
            "/node_modules/@tanstack/",
            "/node_modules/i18next/",
            "/node_modules/react-i18next/",
            "/node_modules/react-helmet-async/",
            "/node_modules/lucide-react/"
          ];
          return corePackages.some((packagePath) => id.includes(packagePath))
            ? "vendor"
            : undefined;
        }
      }
    }
  }
});
