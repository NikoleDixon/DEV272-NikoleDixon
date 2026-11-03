// eslint.config.js: ESLint settings (ESLint 9 "flat config").
// `pnpm lint` (expo lint) checks the code in src/ and reports problems.
// `pnpm lint:fix` fixes what it can across the project, mostly formatting.
// The config is a list read top to bottom; later entries override earlier ones.
// Docs: https://docs.expo.dev/guides/using-eslint/
const { defineConfig, globalIgnores } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  // Generated output: never lint it.
  globalIgnores(["dist/*", "coverage/*", ".expo/*"]),

  // Expo's recommended rules for React, React Native, TypeScript, and hooks.
  expoConfig,

  // Runs Prettier inside ESLint (formatting problems show up as
  // prettier/prettier errors) and turns off ESLint rules that would fight
  // with Prettier. Keep it after expoConfig.
  eslintPluginPrettierRecommended,

  // Course rules, for TypeScript files only. Without the `files` line,
  // `pnpm lint:fix` crashes on .js files such as this one.
  // Each rule is "off", "warn" (reported, does not fail), or "error" (fails).
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-console": "warn", // a leftover console.log
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" }, // unused function args named _like_this are OK
      ],
      "react-hooks/exhaustive-deps": "error", // a missing effect dependency is a bug
    },
  },
]);
