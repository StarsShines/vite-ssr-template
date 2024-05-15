/**
 * 日志生成及格式化
 */
import log4j from 'koa-log4';
const uuid = (pid = '') => {
  return String(pid) + String(new Date().getTime());
};
const msFn = () => {
  const date = new Date();
  const milliseconds = date.getMilliseconds().toString().padEnd(3, '0');
  return `${milliseconds}`;
};
//服务错误日志
const formatError = (ctx, err, costTime) => {
  const {
    url,
    response: { status },
    request: {
      header: { host },
      method
    }
  } = ctx;
  const msg = ctx.response.headers['content-type'] == 'text/html; charset=utf-8' ? 'html数据' : ctx.body;
  const Pid = ctx.request.header['pversion-id'];
  const Header = JSON.stringify(ctx.request.header);
  const SourceIp = ctx.request.ip || ctx.request.headers['x-forwarded-for'] || ctx.request.connection;
  return `.${msFn()}|${url}|${method}|status=${status}|host=${String(host)}|SourceIp=${SourceIp}|${uuid(Pid)}|${costTime}|${Header}|body=${msg}|error=${err}`;
};
//服务日常日志
const formatRes = (ctx, costTime) => {
  const {
    url,
    response: { status },
    request: {
      header: { host },
      method
    }
  } = ctx;
  const msg = ctx.response.headers['content-type'] == 'text/html; charset=utf-8' ? 'html数据' : ctx.body;
  const Pid = ctx.request.header['pversion-id'];
  const Header = JSON.stringify(ctx.request.header);
  const SourceIp = ctx.request.ip || ctx.request.headers['x-forwarded-for'] || ctx.request.connection;
  return `.${msFn()}|${url}|${method}|status=${status}|host=${String(host)}|SourceIp=${SourceIp}|${uuid(Pid)}|${costTime}|${Header}|body=${msg}`;
};
//vue错误日志
const formatWarn = (ctx, url, err) => {
  const {
    request: {
      header: { host, cookie }
    }
  } = ctx;
  const Header = JSON.stringify(ctx.request.header);
  const Pid = ctx.request.header['pversion-id'];
  return `.${msFn()}|${url}|${uuid(Pid)}|status=500|${Header}|body=${err}`;
};
//请求接口日志
const serverWarn = (ctx, url, data) => {
  const {
    request: {
      header: { host, cookie }
    }
  } = ctx;
  const Header = JSON.stringify(ctx.request.header);
  const Pid = ctx.request.header['pversion-id'];
  return `.${msFn()}|${url}|${data.method}|${data.status}|${uuid(Pid)}|params=${data.params}|${Header}|body=${data.data}`;
};

const levels = {
  trace: log4j.levels.TRACE,
  debug: log4j.levels.DEBUG,
  info: log4j.levels.INFO,
  warn: log4j.levels.WARN,
  error: log4j.levels.ERROR,
  fatal: log4j.levels.FATAL
};
// log4j配置
log4j.configure({
  // 指定输出文件类型和文件名
  appenders: {
    //常规输出
    console: { type: 'console' },
    //日常日志
    info: {
      type: 'dateFile',
      pattern: 'yyyy-MM-dd.log',
      //线上使用
      filename: process.env.NODE_ENV === 'production' ? '/home/work/test/logs/access.log' : 'logs/access.log',
      // filename: 'logs/access.log',
      layout: { type: 'pattern', pattern: 'test-ssr|%d{yyyy-MM-dd hh:mm:ss}%m' }
    },
    //错误日志
    error: {
      type: 'dateFile',

      //线上使用
      filename: process.env.NODE_ENV === 'production' ? '/home/work/test/logs/warn_error.log' : 'logs/warn_error.log',
      // filename: 'logs/warn_error.log',
      pattern: 'yyyy-MM-dd.log',
      layout: { type: 'pattern', pattern: 'test-ssr|%d{yyyy-MM-dd hh:mm:ss}%m' }
    },
    //vue日志
    vueError: {
      type: 'dateFile',
      //线上使用
      filename: process.env.NODE_ENV === 'production' ? '/home/work/test/logs/vue_error.log' : 'logs/vue_error.log',
      // filename: 'logs/vue_error.log',
      pattern: 'yyyy-MM-dd.log',
      layout: { type: 'pattern', pattern: 'test-ssr|%d{yyyy-MM-dd hh:mm:ss}%m' }
    }
  },
  // 设置日志输出级别
  categories: {
    default: {
      appenders: ['console'],
      level: 'debug'
    },
    info: {
      appenders: ['info'],
      level: 'info'
    },
    error: {
      appenders: ['error'],
      level: 'error'
    },
    warn: {
      appenders: ['vueError'],
      level: 'warn'
    }
  }
});
// 抛出日志记录方法
/**
 * 日志输出 level为debug
 * @param { string } content
 */
export const debug = (content) => {
  let logger = log4j.getLogger('debug');
  logger.level = levels.debug;
  logger.debug(formatRes(content));
};
/**
 * 日志输出 level为info
 * @param { string } ctx
 */
export const info = (ctx, costTime) => {
  let logger = log4j.getLogger('info');
  logger.level = levels.info;
  logger.info(formatRes(ctx, costTime));
};
/**
 * 日志输出 level为error
 * @param { string } ctx
 */
export const error = (ctx, err, costTime) => {
  let logger = log4j.getLogger('error');
  logger.level = levels.error;
  logger.error(formatError(ctx, err, costTime));
};
/**
 * 日志输出 level为warn
 * @param { string } ctx
 */
export const warn = (ctx, err, costTime) => {
  let logger = log4j.getLogger('warn');
  logger.level = levels.warn;
  logger.warn(formatWarn(ctx, err, costTime));
};
