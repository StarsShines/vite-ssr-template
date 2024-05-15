import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import { resolve } from 'path';
import proxyData from './proxy';

// https://vitejs.dev/config/
export default ({ mode }) => {
  const curBuild = process.argv[2];
  return defineConfig({
    base: '/',
    server: {
      proxy: proxyData as { string: string }
    },
    define: {
      'process.env.NODE_ENV': mode === 'development' ? '"development"' : '"production"'
    },
    build: {
      assetsDir: curBuild === 'build:csr' ? `static/${new Date().getFullYear()}${new Date().getMonth() + 1}/csr` : 'test/assets', // 生成静态资源的存放路径
      assetsInlineLimit: 4096 // 小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项
    },
    resolve: {
      //设置别名
      alias: {
        '@': resolve(__dirname, 'src'),
        '@common': resolve(__dirname, 'src/common'),
        '@hooks': resolve(__dirname, 'src/common/hooks'),
        '@utils': resolve(__dirname, 'src/common/js'),
        '@store': resolve(__dirname, 'src/store'),
        '@types': resolve(__dirname, 'src/types'),
        '@assets': resolve(__dirname, 'src/assets')
      }
    },
    plugins: [
      vue(),
      Components({
        dirs: ['src/components'],
        resolvers: [
          VantResolver({
            //ssr中5个小时才解决的问题，ssr中无法自动引入样式！！！
            importStyle: false
          })
        ]
      }),
      AutoImport({
        // 自动导入vue相关的Api
        resolvers: [
          VantResolver({
            //ssr中55个小时才解决的问题，ssr中无法自动引入样式！！！
            importStyle: false
          })
        ],
        imports: ['vue', 'vue-router', 'pinia'],
        include: [
          /\.[tjm]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/ // .md
        ],
        // 生成auto-import.d.ts声明文件
        dts: true,
        eslintrc: {
          enabled: true, // 若没此json文件，先开启，生成后在关闭
          filepath: './.eslintrc-auto-import.json', // 设置eslintrc-auto-import.json生成路径 Default `./.eslintrc-auto-import.json`
          globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        }
      })
    ],
    css: {
      preprocessorOptions: {
        less: {
          // 支持内联 JavaScript
          javascriptEnabled: true
        }
      }
    }
  });
};
