import '@/common/css/reset.css';
import '@/common/js/polyfill';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
import { createSSRApp } from 'vue';
import App from './App.vue';
// . 引入组件样式
import 'vant/lib/index.css';

console.log('main执行');

export const createApp = () => {
  const app = createSSRApp(App);

  return { app };
};
