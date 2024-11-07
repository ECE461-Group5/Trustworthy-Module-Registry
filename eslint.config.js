export default [
  extends: ["eslint:recommended"],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
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
  ]
];
