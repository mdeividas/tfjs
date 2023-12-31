import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  resolve: {
    alias: [
      {
        find: "app",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
  plugins: [react()],
});
