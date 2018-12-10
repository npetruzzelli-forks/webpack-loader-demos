const baseConfig = require("eslint-config-prettier-standard/lib/base");
const basePrettierConfig = baseConfig.rules["prettier/prettier"][1];

module.exports = {
  "root": true,
  "extends": [
    "react-app",
    "prettier-standard/lib/base",
    "prettier",
    "prettier/react",
    "prettier/standard"
  ],
  "rules": {
    "jsx-quotes": ["error", "prefer-double"],
    "prettier/prettier": [
      "error",
      Object.assign({}, basePrettierConfig, {
        printWidth: 80,
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        useTabs: false
      })
    ],
    "quotes": [
      "error",
      "single", // Must match the prettier rule.
      {
        "avoidEscape": true,
        "allowTemplateLiterals": false // Avoid unnecessary backticks
      }
    ]
  },
  "overrides": [
    {
      "files": ["src/**/*"],
      "env": {
        "browser": true
      },
      "globals": {
        "$": true, // Allows for jQuery.noConflict()
        "jQuery": false
      }
    }
  ]
}
