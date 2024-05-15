## test ssr

## node 版本>18 建议 20

## 进入 daocker 容器方法

docker exec -it [容器 id 或 name] /bin/sh

## 查询 docker 镜像状态

docker ps

## 查询 docker 日志

docker logs [id/name]

## 查询 daocker 镜像大小

docker images --format "{{.Repository}}: {{.Size}}"

## Project setup

```
本地开发不构建
yarn dev
本地构建
yarn build
本地生产环境
yarn serve

上线测试

正常的上线流程
```

## 项目结构

```
├── README.md                        Readme
├── logconfig                        日志生成配置
├── logs                            日志存放处（线上在home下）
├── nodeInstall                      docker构建时需要安装的依赖
├── public                           静态资源
│   ├── favicon.ico                 icon
├── dist                             构建完成的资源存放路径
│   ├── client                      打包后的静态资源
│   ├── server                      服务器渲染
├── package.json                     管理项目依赖外部模块
├── index.html                       模版html
├── server-dev.js                    dev服务主入口
├── server-prod.js                   prod服务主入口
├── vite.config.ts                   vite相关配置
├── proxy.ts                         代理配置
├── build.sh                        构建配置（dockerfile内容由此出录入）
├── build_.sh                        本地校验构建配置（dockerfile内容由此出录入）
├── build_csr.sh                      客端构建配置（暂时无用）
├── process.json                    部署后pm2使用
├── Dockerfile                       docker（内容在build.sh中写入）
├── src                              源码目录
│   ├── App.vue                     起始 Vue-component，可以理解成 Vue 的 root Component
│   ├── common                      工具函数/方法
│   │    ├──css                    公共css
│   │    ├──hooks                  公共hooks
│   │    ├──js                     公共utils
│   ├── vite-env.d.ts               防止ts报错
│   ├── entry-client.ts             客端加载入口文件
│   ├── entry-server.ts             服务端加载入口文件
│   ├── main.ts                     公共入口文件
│   ├── pages                       页面
│   │    ├──模块name                对应模块的页面
│   ├── components                  通用组件
│   │    ├──模块name                对应模块的组件
│   ├── api                         接口
│   │    ├──模块name.ts             对应模块的api
│   ├── assets                      源静态资源
│   │    ├──模块name                对应模块的静态资源
│   ├── constant                    全局变量
│   ├── router                      前后端同构路由
│   ├── store                       前后端同构Store(pinia)
│   │    ├──模块name.ts              对应模块的store
│   └── types                       全局ts声明
...其他为自动导入配置aut-/components.d、postcss.config-rem转化、ts相关配置、prettierrc美化、eslint
```

### SSR 数据预获取 详细参考 postsv.vue

```javascript
const asyncFn = (): Promise<any[]> => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      const lists: Object[] = [
        { id: '1', title: '1111' },
        { id: '2', title: '2222' },
        { id: '3', title: '3333' },
        { id: '4', title: '4444' }
      ];
      resolve(lists);
    }, 1000);
  });
};
const getPosts = async () => {
  const data = await asyncFn();
  userStore.updateList(data);
  console.log('请求执行完毕');
};
onServerPrefetch(async () => {
  console.log('nnnn');
  await getPosts();
});
onMounted(() => {
  console.log('csr事件初始化，已执行ssr');
  if (!userStore.list.value) {
    console.log('csr事件初始化，未执行ssr');
    await getPosts();//纯csr下要手动执行
  }
  console.log(userStore, 'list');
});
```

### uat 测试

### tke mirror 地址

### odp mirror 地址

### 线上 地址

#### 线上服务日志查看 倒数 100 条消息

--pm2 日志
cat /home/test/logs/error.log tail -100f /home/test/logs/out.log
--标准化采集日志（access 日常，warn_error 服务异常日志，vue 错误日志）
cat /home/test/logs/access.log 或 tail -100f/home/test/logs/access.log
cat /home/test/logs/warn_error.log 或 tail -100f/home/test/logs/warn_error.log
cat /home/test/logs/vue_error.log 或 tail -100f/home/test/logs/vue_error.log

### process.json 配置说明

apps： json 结构，apps 是一个数组，每一个数组成员就是对应一个 pm2 中运行的应用； name：应用程序名称； cwd：应用程序所在的目录； script：应用程序的脚本路径； log_date_format： 指定日志日期格式，如 YYYY-MM-DD HH：mm：ss； error_file：自定义应用程序的错误日志文件，代码错误可在此文件查找； out_file：自定义应用程序日志文件，如应用打印大量的标准输出，会导致 pm2 日志过大； pid_file：自定义应用程序的 pid 文件； interpreter：指定的脚本解释器； interpreter_args：传递给解释器的参数； instances： 应用启动实例个数，仅在 cluster 模式有效，默认为 fork； min_uptime：最小运行时间，这里设置的是 60s 即如果应用程序在 60s 内退出，pm2 会认为程序异常退出，此时触发重启 max_restarts 设置数量； max_restarts：设置应用程序异常退出重启的次数，默认 15 次（从 0 开始计数）； autorestart ：默认为 true, 发生异常的情况下自动重启； cron_restart：定时启动，解决重启能解决的问题； max_memory_restart：最大内存限制数，超出自动重启； watch：是否启用监控模式，默认是 false。如果设置成 true，当应用程序变动时，pm2 会自动重载。这里也可以设置你要监控的文件。 ignore_watch：忽略监听的文件夹，支持正则表达式； merge_logs： 设置追加日志而不是新建日志； exec_interpreter：应用程序的脚本类型，默认是 nodejs； exec_mode：应用程序启动模式，支持 fork 和 cluster 模式，默认是 fork； autorestart：启用/禁用应用程序崩溃或退出时自动重启； vizion：启用/禁用 vizion 特性(版本控制)； env：环境变量，object 类型； force：默认 false，如果 true，可以重复启动一个脚本。pm2 不建议这么做； restart_delay：异常重启情况下，延时重启时间；

维护人：StarsShines
