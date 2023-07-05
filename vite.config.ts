import { Rollup, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ["**/*.env"],
  plugins: [react({
    include: "**/*/tsx"
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['recast-detour']
  },
  build: {
    rollupOptions: {
      external: ['recast-detour'],
      output: {
        format: 'umd',
        globals: {
          'recast-detour': 'Recast',
        },
      },
    },
  }
});
