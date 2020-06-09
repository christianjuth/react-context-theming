const path = require("path");

module.exports = {
  webpack: function(config, { dev }) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-context-theming": path.resolve(__dirname, '../../lib/'),
      "react": path.resolve(__dirname, '../../node_modules/react')
    };
    return config;
  }
};