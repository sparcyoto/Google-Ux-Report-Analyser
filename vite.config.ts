import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Skip type checking during build
  build: {
    // Disable type checking during build
    typescript: {
      ignoreBuildErrors: true,
    },
  },
});
