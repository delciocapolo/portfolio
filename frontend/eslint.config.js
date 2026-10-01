//  @ts-check

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { tanstackConfig } from "@tanstack/eslint-config";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  ...tanstackConfig,
  {
    ignores: [
      "eslint.config.js",
      "prettier.config.js",
      "dist/",
      "node_modules/",
      "coverage/",
      "**/*.d.ts",
    ],
  },

  js.configs.recommended,
  prettierRecommended,

  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  {
    files: ["**/*.tsx"],
    extends: [tseslint.configs.recommended, tseslint.configs.strict],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "no-extra-semi": "off",
      "import/no-cycle": "off",
      "import/order": "off",
      "sort-imports": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/require-await": "off",
      "pnpm/json-enforce-catalog": "off",
    },
  },
];
