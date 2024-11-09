// eslint.config.js

import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import ts from "typescript-eslint";

export default [
  js.configs.recommended,
//  ...ts.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  {
    ignores: [
      "dist/", 
      "eslint.config.js", 
      "tests/metrics/", 
      "tests/evaluators/", 
      "vitest.config.ts",
      "src/models/",
      "src/utils",
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
//        allowAutomaticSingleRunInference: true,
      }
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
          "default": "generic" 
        }
      ],
      "@typescript-eslint/explicit-function-return-type": "error"
    }
  }
];

