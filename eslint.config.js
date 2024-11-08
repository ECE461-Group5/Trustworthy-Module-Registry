import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import ts from "typescript-eslint";

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    ignores: ["dist/"]
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: "latest", 
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        sourceType: "module"
      }
    },
    rules: {
      semi: "error",
      quotes: ["error", "double"],
      "@typescript-eslint/no-explicit-any": "off",
      "no-array-constructor": "off",
      "@typescript-eslint/no-array-constructor": "error"
      "dot-notation": "off",
      "@typescript-eslint/dot-notation": "error"
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

