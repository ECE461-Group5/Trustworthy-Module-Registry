import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    env: {
      "node": true,
      "es2021": true
    },
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    rules: {
      semi: "error",
      quotes: ["error", "single"],
    }
  }
];

