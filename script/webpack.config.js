const NodeExternals = require('webpack-node-externals');
const WebpackClean = require('webpack-clean');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');

const CesiumPath = path.resolve(process.cwd(), 'server/cesium');

module.exports = {
  entry: './server/index.ts',
  mode: 'production',
  target: 'node16.10',
  devtool: 'inline-source-map',
  externalsPresets: { node: true },
  externals: [NodeExternals({}), /^(cesium)$/i],
  resolve: {
    extensions: ['.js', '.ts', 'mjs', '.json', '.wasm', '.cjs'],
    plugins: [new TsconfigPathsPlugin()],
  },
  output: {
    filename: process.env.ENTRY_FILE_NAME,
    path: path.resolve(process.env.DEST, 'server'),
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
        exclude: [/node_modules/, CesiumPath],
        options: {
          loader: 'js', // Remove this if you're not using JSX
          target: 'es2015', // Syntax to compile to (see options below for possible values)
        },
      },
      {
        test: /\.ts$/,
        loader: 'esbuild-loader',
        exclude: [/node_modules/, CesiumPath],
        options: {
          loader: 'ts', // Or 'ts' if you don't need tsx
          target: 'es2015',
          tsconfigRaw: require('../tsconfig.server.json'),
        },
      },
    ],
  },
  plugins: [new WebpackClean()],
};
