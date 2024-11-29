// eslint.config.js

import js from "@eslint/js";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import tsParser from "@typescript-eslint/parser";
import ts from "typescript-eslint";

export default [
  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  {
    ignores: [
      "./src/dist/",
      "eslint.config.js",
      "vitest.config.ts",
      "./src/tests/metrics/",
      "./srctests/evaluators/",
      "./src/models/",
      "./src/utils",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@stylistic/ts": stylisticTs,
    },

    rules: {
      semi: "error",
      quotes: ["error", "double"],
      "@typescript-eslint/no-explicit-any": "off",
      "no-array-constructor": "off",
      "@typescript-eslint/no-array-constructor": "error",
      "dot-notation": "off",
      "@typescript-eslint/dot-notation": "error",
      "@typescript-eslint/array-type": [
        "error",
        {
          default: "generic",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-unused-vars": ["warn", { caughtErrors: "none" }],
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",

      // Stylistic Rules
      "@stylistic/ts/space-before-function-paren": ["error", "always"],
      "@stylistic/ts/block-spacing": ["error", "always"],
      "@stylistic/ts/brace-style": ["error", "stroustrup"],
      "@stylistic/ts/comma-dangle": ["error", "always-multiline"],
      "@stylistic/ts/comma-spacing": ["error", { before: false, after: true }],
      "@stylistic/ts/function-call-spacing": ["error", "never"],
      "@stylistic/ts/key-spacing": [
        "error",
        { beforeColon: false, afterColon: true, mode: "strict" },
      ],
      "@stylistic/ts/keyword-spacing": ["error", { before: true, after: true }],
      "@stylistic/ts/member-delimiter-style": [
        "error",
        { multiline: { delimiter: "semi", requireLast: true } },
      ],
      "@stylistic/ts/no-extra-parens": ["error", "all"],
      "@stylistic/ts/no-extra-semi": "error",
      "@stylistic/ts/object-curly-spacing": ["error", "always"],
      "@stylistic/ts/quote-props": ["error", "consistent"],
      "@stylistic/ts/quotes": ["error", "double"],
      "@stylistic/ts/space-before-blocks": "error",
      "@stylistic/ts/space-infix-ops": "error",
    },
  },
];
