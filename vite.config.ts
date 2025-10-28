import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    svgr(),
    preact({
      prerender: {
        enabled: true,
        renderTarget: "#app",
      },
    }),
  ],
});
