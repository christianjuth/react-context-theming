const path = require('path');

const root = path.resolve(__dirname, '..');

const myNodeModules = {
  'react-context-theming': path.resolve(__dirname + '/../src')
};

module.exports = {
  /**
   * Add "global" dependencies for our RN project here so that our local components can resolve their
   * dependencies correctly
   */
  resolver: {
    extraNodeModules: new Proxy(myNodeModules, {
      get: (target, name) =>
        name in target ? target[name] : path.join(process.cwd(), `node_modules/${name}`),
    }),
  },

  projectRoot: __dirname,

  // // We need to watch the root of the monorepo
  // // This lets Metro find the monorepo packages automatically using haste
  // // This also lets us import modules from monorepo root
  watchFolders: [
    path.resolve(root, 'src'),
    path.resolve(root, 'node_modules')
  ],

  transformer: {
    getTransformOptions: () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};