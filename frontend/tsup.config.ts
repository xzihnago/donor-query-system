import { defineConfig } from "tsup";

export default defineConfig({
  format: "esm",
  entry: ["src/index.ts"],
  outDir: "../public/scripts",
  clean: true,
  minify: true,
  treeshake: true,
});
