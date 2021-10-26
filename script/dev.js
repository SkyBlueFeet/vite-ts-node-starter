const { createServer, createLogger } = require('vite');
const chalk = require('chalk');
const nodemon = require('nodemon');
const path = require('path');

process.env.NODE_ENV = 'development';

require('./env');

/**
 * @type import('consola').Consola
 */
const consola = require('consola');
const { isUndefined, isArray } = require('lodash');

const startDate = Date.now();

async function ViteDevelopServe() {
  const server = await createServer();

  if (!server.httpServer) {
    throw new Error('HTTP server not available');
  }
  await server.listen();
  const info = server.config.logger.info;
  info(
    chalk.cyan(`\n  vite v${require('vite/package.json').version}`) +
      chalk.green(` dev server running at:\n`),
    {
      clear: !server.config.logger.hasWarned,
    }
  );
  server.printUrls();
}

ViteDevelopServe()
  .then(() => {
    const NodemonClient = nodemon('');

    NodemonClient.once('start', (files) => {
      consola.log(
        chalk.cyan(`\n  node-server v${require('../package.json').version}`) +
          chalk.green(` running at:\n`)
      );

      consola.log(
        chalk.white(`  > Local:`) +
          chalk.cyan(`http://localhost:${process.env.SERVER_PORT}/\n`)
      );

      const startupDuration = Date.now() - startDate;
      consola.log(
        `\n  ${chalk.cyan(`ready in ${Math.ceil(startupDuration)}ms.`)}\n`
      );
    });

    NodemonClient.on('restart', (files) => {
      if (!isUndefined(files) && isArray(files) && files.length > 0) {
        files = files
          .map((filename) => path.relative(process.cwd(), filename))
          .join(',');
      } else {
        files = '';
      }

      console.info(
        chalk.green(new Date().toLocaleString()),
        chalk.cyan('file update'),
        files
      );
    });

    return NodemonClient;
  })
  .catch((e) => {
    createLogger('error').error(
      chalk.red(`error when starting dev server:\n${e.stack}`),
      {
        error: e,
      }
    );
    process.exit(1);
  });
