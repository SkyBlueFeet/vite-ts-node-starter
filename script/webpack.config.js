const NodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');
const env = require('./env');
const { EnvironmentPlugin } = require('webpack');

module.exports = {
  entry: {
    main: './server/index.ts',
  },
  mode: 'production',
  target: 'node16.10',
  devtool: 'source-map',
  externalsPresets: { node: true },
  externals: [NodeExternals({})],
  resolve: {
    extensions: ['.js', '.ts', 'mjs', '.json', '.wasm', '.cjs'],
    plugins: [new TsconfigPathsPlugin()],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(process.env.DEST, process.env.SERVER_DEST),
  },
  node: {
    __filename: false,
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|cjs|mjs)$/,
        loader: 'esbuild-loader',
        exclude: [/node_modules/],
        options: {
          loader: 'js', // Remove this if you're not using JSX
          target: 'es2015', // Syntax to compile to (see options below for possible values)
          tsconfigRaw: require('../tsconfig.server.json'),
        },
      },
      {
        test: /\.ts$/,
        loader: 'esbuild-loader',
        exclude: [/node_modules/],
        options: {
          loader: 'ts', // Or 'ts' if you don't need tsx
          target: 'es2015',
          tsconfigRaw: require('../tsconfig.server.json'),
        },
      },
    ],
  },
  plugins: [new EnvironmentPlugin(Object.keys(env))],
};
