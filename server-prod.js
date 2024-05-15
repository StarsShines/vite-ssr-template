/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'node:fs/promises';
import Koa from 'koa';
import send from 'koa-send';
import proxy from 'koa2-proxy-middleware';
import bodyparser from 'koa-bodyparser';
import Router from 'koa-router';
import { resolve } from 'path';
//常量
const logger = (await import('./logconfig/middlewareLogger.js')).logger;
const info = (await import('./logconfig/log4j.js')).info;
const error = (await import('./logconfig/log4j.js')).error;
const warn = (await import('./logconfig/log4j.js')).warn;
const clientRoot = resolve('dist/client');
const template = await fs.readFile('./dist/client/index.html', 'utf-8');
const render = (await import('./dist/server/entry-server.js')).render;
const manifest = await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8');

//实例
const app = new Koa();
const router = new Router();
//路由信息
router.post('/vuelog', async (ctx, next) => {
  const params = ctx.request.body;
  console.log(params);
  warn(ctx, params.url, params.errmsg);
  ctx.body = {
    data: null,
    message: '录入完成',
    errno: 0,
  };
});
//转发服务
const options = {
  targets: {
    '/api/xxx/(.*)': {
      target: 'http://127.0.0.1/test/api',
      changeOrigin: true, // 是否跨域
      pathRewrite: {
        '/api': '', // 重写路径
      },
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('platform', 'loc');
        console.log(req.url);
      },
      onProxyRes: (proxyRes, req, res) => {
        /* 允许当前域 */
        // console.log(req)
        proxyRes.headers['access-control-allow-origin'] = req.headers.origin;
        proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
      },
      onError: (err, req, res) => {
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end('Something went wrong. And we are reporting a custom error message.');
      },
    },
  },
};

//日志中间件
app.use(logger());
//转发中间件
app.use(proxy(options));
//bodyparser
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  }),
);
//router
app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (ctx) => {
  // 请求的是静态资源 或者/favicon.ico
  //设置允许跨域的域名，*代表允许任意域名跨域
  // console.log('server-prod: ', ctx.path)
  ctx.set('Access-Control-Allow-Origin', ctx.request.header['origin']);
  ctx.set('Access-Control-Allow-Credentials', 'true');
  ctx.set('Access-Control-Allow-Headers', 'content-type,platform');
  ctx.set('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
  if (ctx.method === 'OPTIONS') {
    ctx.body = 200;
    return;
  }
  if (ctx.path.startsWith('/test/assets') || ctx.path.startsWith('/favicon')) {
    await send(ctx, ctx.path, { root: clientRoot });
    if (String(ctx.response.status).startsWith('4') || String(ctx.response.status).startsWith('5')) {
      error(ctx, 0);
    }
    return;
  }
  const [renderedHtml, state, preloadLinks] = await render(ctx, manifest);
  const html = template
    .replace('<!--preload-links-->', preloadLinks)
    .replace('<!--pinia-state-->', JSON.stringify(state))
    .replace('<!--app-html-->', renderedHtml);
  ctx.type = 'text/html';
  ctx.body = html;
});

app.listen(8000, () => console.log('started server on http://localhost:8000'));
