/**
 * @description 在根目录启动本文件
 * @author skyblueFeet
 */

const webpack = require('webpack');
const { build: buildVite } = require('vite');
const { writeFile, stat, mkdir } = require('fs/promises');
const fs = require('fs');

/**
 * @type import('consola').Consola
 */
const consola = require('consola');
const path = require('path');

process.env.NODE_ENV = 'production';

require('./env');

const { existsSync } = require('fs');

const dest = path.resolve(process.env.DEST);

const WebpackConfig = require('./webpack.config.js');

const package = require('../package.json');

const pm2ConfigData = {
  name: package.name,
  script: 'main.js',
};
const pm2ConfigName = './app.config.json';

async function buildServerPack() {
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

async function copyProject() {
  //  删除构建文件夹
  if (existsSync(dest)) {
    const fileStat = await stat(dest);

    if (fileStat.isDirectory()) {
      require('rimraf').sync(dest);
    }
  }

  // 创建构建文件夹
  await mkdir(dest);

  const package = require('../package.json');

  // 构建版本不适用开发依赖
  package.devDependencies = undefined;

  package.scripts = {
    start: 'pm2 start' + ` ${pm2ConfigName}`,
    stop: 'pm2 stop' + ` ${pm2ConfigName}`,
    restart: 'pm2 restart' + ` ${pm2ConfigName}`,
    uninstall: 'pm2 kill',
    info: 'pm2 info' + ` ${pm2ConfigName}`,
    uninstall: 'pm2 kill',
  };

  await writeFile(
    path.resolve(dest, 'package.json'),
    JSON.stringify(package, null, 2)
  );

  await writeFile(
    path.resolve(dest, pm2ConfigName),
    JSON.stringify(pm2ConfigData, null, 2)
  );

  return;
}

copyProject()
  .then(() => {
    return buildServerPack();
  })
  .then(() => {
    consola.success('Server Pack Build complete!');

    return buildVite();
  })
  .then((rout) => {
    consola.success('Pack Success');
  })
  .catch((err) => {
    consola.error(err);
    console.log(err);
  });
