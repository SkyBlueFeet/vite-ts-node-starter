import { Context, Next } from 'koa';
import Log4js, { levels } from 'log4js';

const LogPath = 'logs';

const isDev = process.env.NODE_ENV === 'development';

function getLogFileName(name: string) {
  return `${LogPath}/${name}.log`;
}

const startup: Record<string, Log4js.Appender> = {
  startup: {
    type: 'file',
    filename: getLogFileName('startup'),
    category: 'startup',
  },

  startupError: {
    type: 'logLevelFilter',
    level: 'ERROR',
    appender: 'fatalFile',
  },
};

const runtime: Record<string, Log4js.Appender> = {
  app: {
    type: 'dateFile',
    filename: getLogFileName('app'),
    pattern: 'yyyy-MM-dd',
    alwaysIncludePattern: true,
    keepFileExt: true,
  },
  errors: {
    type: 'logLevelFilter',
    level: 'ERROR',
    appender: 'errorFile',
  },
};

const config: Log4js.Configuration = {
  appenders: {
    access: {
      type: 'dateFile',
      filename: getLogFileName('access'),
      pattern: 'yyyy-MM-dd',
      alwaysIncludePattern: true,
      keepFileExt: true,
      category: 'http',
    },

    errorFile: {
      type: 'file',
      filename: getLogFileName('errors'),
    },

    fatalFile: {
      type: 'file',
      filename: getLogFileName('fatals'),
    },
    dev: {
      type: 'console',
    },
    out: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '%d %p %c %X{user} %m%n',
      },
    },
    ...startup,
    ...runtime,
  },
  categories: {
    default: { appenders: Object.keys(runtime), level: 'ALL' },
    http: { appenders: ['access'], level: 'ALL' },
    startup: { appenders: Object.keys(startup), level: 'ALL' },
  },
};

if (isDev) {
  for (const categories of Object.keys(config.categories)) {
    config.categories[categories].appenders.push('dev');
  }
}

Log4js.configure(config);

function CreateLogger(type: string, level: string = 'DEBUG') {
  const logger = Log4js.getLogger(type);

  logger.level = level;

  return logger;
}

const HttpLoggerMiddleware = function createHttpMiddleware() {
  const httpLog = Log4js.getLogger('http');

  return async function (ctx: Context, next: Next) {
    const start = Date.now();

    await next();

    httpLog.info(`${ctx.method} ${ctx.url} - ${Date.now() - start}ms`);
  };
};

const logger = CreateLogger('default');

export { CreateLogger, HttpLoggerMiddleware, logger };
