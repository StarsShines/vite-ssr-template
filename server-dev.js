import fs from 'node:fs/promises';
import Koa from 'koa';
import Router from 'koa-router';
import connect from 'koa-connect';
import send from 'koa-send';
import { resolve } from 'path';
import bodyparser from 'koa-bodyparser';
const logger = (await import('./logconfig/middlewareLogger.js')).logger;
const info = (await import('./logconfig/log4j.js')).info;
const error = (await import('./logconfig/log4j.js')).error;
const warn = (await import('./logconfig/log4j.js')).warn;
const { createServer } = await import('vite');
// const isProduction = process.env.NODE_ENV === 'production';
let a = [];
console.log(process.env.PORT, 'port');
// 常量信息
const port = process.env.PORT || 3000;
const clientRoot = resolve('public');
const viteServer = await createServer({
  server: { middlewareMode: true },
  logLevel: 'info',
  appType: 'custom',
  root: process.cwd()
});
// 实例
const app = new Koa();
const router = new Router();
// 路由配置
router.post('/vuelog', async (ctx, next) => {
  const params = ctx.request.body;
  console.log(params);
  warn(ctx, params.url, params.errmsg);
  ctx.body = {
    data: null,
    message: '录入完成',
    errno: 0
  };
});
// 中间件信息
// 日志
app.use(logger());
// bodyParser中间件
app.use(bodyparser());
// 路由
app.use(router.routes());
app.use(router.allowedMethods());
app.use(connect(viteServer.middlewares));

app.use(async (ctx) => {
  console.log('ctx', ctx.path);
  // setInterval(() => {
  //   a.push(new Array(3000).fill('aaaaaa'));
  // });
  try {
    if (ctx.path.startsWith('/test/assets') || ctx.path.startsWith('/favicon')) {
      await send(ctx, ctx.path, { root: clientRoot });
      if (String(ctx.response.status).startsWith('4') || String(ctx.response.status).startsWith('5')) {
        error(ctx, 0);
      }
      return;
    }
    if (ctx.path.startsWith('/vuelog')) {
      console.log('log');
      // return;
    }
    // 1. 获取index.html
    let template = await fs.readFile('./index.html', 'utf-8');

    // 2. 应用 Vite HTML 转换。这将会注入 Vite HMR 客户端，
    template = await viteServer.transformIndexHtml(ctx.path, template);

    // 3. 加载服务器入口, vite.ssrLoadModule 将自动转换
    const { render } = await viteServer.ssrLoadModule('/src/entry-server.ts');

    //  4. 渲染应用的 HTML
    const [renderedHtml, state] = await render(ctx, {});
    // const initState = JSON.stringify(state);
    // console.log('执行dev', initState, 'initState');
    console.log('pin');
    const html = template.replace('<!--app-html-->', renderedHtml).replace('<!--pinia-state-->', JSON.stringify(state));
    ctx.type = 'text/html';
    ctx.body = html;
  } catch (e) {
    viteServer && viteServer.ssrFixStacktrace(e);
    ctx.throw(500, e.stack);
  }
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
