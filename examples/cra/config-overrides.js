/* config-overrides.js */
const { removeModuleScopePlugin, override, addWebpackAlias } = require("customize-cra");
const path = require('path');

module.exports = override(
  removeModuleScopePlugin(),
  addWebpackAlias({
    ["react-context-theming"]: path.resolve(__dirname, `../../lib/`)
  })
);