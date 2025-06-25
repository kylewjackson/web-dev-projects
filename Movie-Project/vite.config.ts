import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
	base: '/movie/',
  plugins: [react(), svgr()],
  css: {
    preprocessorOptions: {
      // for .sass and .scss files alike:
      sass: {
        quietDeps: true,
        silenceDeprecations: [
          "import",
          "global-builtin",
          "color-functions",
          "slash-div",
        ],
      },
      scss: {
        quietDeps: true,
        silenceDeprecations: [
          "import",
          "global-builtin",
          "color-functions",
          "slash-div",
        ],
      },
    },
  },
});
