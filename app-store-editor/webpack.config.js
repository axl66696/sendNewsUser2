const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'app-store-editor',

  exposes: {
    './Component': './app-store-editor/src/app/app.component.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: false, requiredVersion: 'auto' }),
  },

});
