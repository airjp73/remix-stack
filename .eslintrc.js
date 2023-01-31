/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "@remix-run/eslint-config/jest-testing-library",
    "prettier",
    "plugin:i18next/recommended",
  ],
  env: {
    "cypress/globals": true,
  },
  plugins: ["cypress", "i18next"],
  // We're using vitest which has a very similar API to jest
  // (so the linting plugins work nicely), but we have to
  // set the jest version explicitly.
  settings: {
    jest: {
      version: 28,
    },
  },
  rules: {
    // userEvent events are all async now
    "testing-library/no-await-sync-events": "off",
    "@typescript-eslint/consistent-type-imports": "off",
    "jsx-a11y/anchor-has-content": [
      "error",
      { components: ["ButtonLink", "Link"] },
    ],
  },
};
