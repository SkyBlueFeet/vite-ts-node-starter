/**
 * @description 在根目录启动本文件
 * @author skyblueFeet
 */

const webpack = require('webpack');

/**
 * @type import('consola').Consola
 */
const consola = require('consola');

process.env.NODE_ENV = 'production';

const WebpackConfig = require('./webpack.config.js');


exports.buildServerByWebpack = async function buildServerPack() {
    consola.info('start Server Pack Build', '...');
    return new Promise((resolve, reject) => {
        webpack(WebpackConfig, (err, stats) => {
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
