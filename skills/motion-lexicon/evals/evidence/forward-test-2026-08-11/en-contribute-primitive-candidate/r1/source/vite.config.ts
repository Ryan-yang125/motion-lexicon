import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: [
        "index.html",
        "candidates/status-becomes-action/portable/index.html",
      ],
    },
  },
});
