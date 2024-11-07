import js from "@eslint/js";
import ts from "typescript-eslint";

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    env: {
      "node": true,
      "es2021": true
    },
    rules: {
      semi: "error",
      quotes: ["error", "single"],
    }
  }
];

