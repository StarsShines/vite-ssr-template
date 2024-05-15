import { info, error } from './log4j.js';
function isAssetFile(filename) {
  return /\.(js|css|png|jpg|ico)$/i.test(filename);
}
export const logger = () => {
  return async (ctx, next) => {
    const start = new Date(); //开始时间
    let ms; //间隔时间
    try {
      await next(); // 下一个中间件
      console.log(process.memoryUsage());
      if (!isAssetFile(ctx.path) && !ctx.path.startsWith('/vuelog')) {
        ms = new Date() - start;
        info(ctx, `${ms}ms`); //记录响应日志
      }
    } catch (err) {
      ms = new Date() - start;
      error(ctx, err, `${ms}ms`); //记录异常日志
    }
  };
};
