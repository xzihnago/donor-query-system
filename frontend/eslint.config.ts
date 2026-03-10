import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import eslint from "@eslint/js";
import vueeslint from "eslint-plugin-vue";
import prettier from "eslint-config-prettier";

export default defineConfigWithVueTs(
  eslint.configs.recommended,
  vueeslint.configs["flat/recommended"],
  vueTsConfigs.strictTypeChecked,
  vueTsConfigs.stylisticTypeChecked,
  prettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
