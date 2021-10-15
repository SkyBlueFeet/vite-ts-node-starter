const webpack = require('webpack');
const { build } = require('vite');
const consola = require('consola');
const path = require('path');

require('dotenv').config();

require('dotenv').config({
  path: path.resolve('.env.' + process.env.NODE_ENV),
});

/**
 * @type import('consola').Consola
 */

const WebpackConfig = require('./webpack.config.js');

async function buildServerPack() {
  consola.info('start Server Pack Build', '...');
  return new Promise((resolve, reject) => {
    const compiler = webpack(WebpackConfig, (err, stats) => {
      if (err) return reject(err);
      process.stdout.write(
        stats.toString({
          colors: true,
          modules: false,
          children: true, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
          chunks: false,
          chunkModules: false,
        }) + '\n\n'
      );

      if (stats.hasErrors()) {
        return reject(new Error('Build failed with errors.'));
      }

      resolve(undefined);
    });
  });
}

buildServerPack()
  .then(() => {
    consola.success('Server Pack Build complete!');

    return build();
  })
  .then((rout) => {
    consola.success('Pack Success');
  })
  .catch((err) => {
    consola.error(err);
  });
