import createStore from '@/store';
import { registerPinia } from '@/store';
import { createApp } from './main.js';
import { createRouter } from './router';
import { setVuelog } from '@/api';

const router = createRouter('client');
const pinia = createStore();

const { app } = createApp();

// 初始化 pinia
// 注意：__INITIAL_STATE__需要在 src/types/shims-global.d.ts中定义
console.log(import.meta.env.SSR, 'ssr是不是');
if (!import.meta.env.SSR) {
  // 在客户端，我们初始化 state（不要放在下面初始化！！！）
  console.log('store init');
  pinia.state.value = JSON.parse(window.__INITIAL_STATE__);
  //pinia初始化完成后注册pinia hooks
  registerPinia(pinia);
  // 全局拦截+日志上报
  app.config.errorHandler = (err: any, _instance: any, source: string) => {
    console.error('err', err);
    setVuelog({
      url: location.href.toString(),
      errmsg: err.toString() + `source：${source}`,
    });
    throw err;
  };
}

app.use(router);
app.use(pinia);
console.log(app, 'logvue');
if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__ === '<!--pinia-state-->') {
  console.log('csr');
  //csr埋点
  // xxxPoint.init({
  //   appKey: 'test-csr',
  //   version: '0.0.0',
  //   environment: 'development',
  //   showLog: true,

  // });
  //相对于ssr，需要csr预处理的方法及事件在这里添加
  //TODO
}

router.isReady().then(() => {
  app.mount('#app', true);
});
